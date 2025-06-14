'use client'
import { useState } from 'react'
import { Keypair, SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
} from '@solana/spl-token'
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata'
import { toast } from 'sonner'
import Link from 'next/link'
import { IconExternalLink } from '@tabler/icons-react'

export default function TokenCreator() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [tokenCreated, setTokenCreated] = useState(false)
  const [mintAddress, setMintAddress] = useState('')
  const [explorerLink, setExplorerLink] = useState('')

  // Form state
  const [tokenDetails, setTokenDetails] = useState({
    name: '',
    symbol: '',
    imageUrl: '',
    supply: '',
    decimals: '9',
  })

  // Authority options
  const [authorityOptions, setAuthorityOptions] = useState({
    mintAuthorityNull: false,
    freezeAuthorityNull: true, // Default to null for freeze authority
    updateAuthorityNull: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTokenDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAuthorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setAuthorityOptions((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  async function createToken() {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    if (
      !tokenDetails.name ||
      !tokenDetails.symbol ||
      !tokenDetails.imageUrl ||
      !tokenDetails.supply
    ) {
      toast.error('Please fill all required fields')
      return
    }

    const decimals = parseInt(tokenDetails.decimals)
    if (isNaN(decimals)) {
      toast.error('Please enter valid decimals (0-18)')
      return
    }

    setIsLoading(true)
    setTokenCreated(false)

    try {
      const mintKeypair = Keypair.generate()
      setMintAddress(mintKeypair.publicKey.toString())

      // Prepare metadata
      const metadata = {
        mint: mintKeypair.publicKey,
        name: tokenDetails.name.trim(),
        symbol: tokenDetails.symbol.trim().substring(0, 10),
        uri: tokenDetails.imageUrl.trim(),
        additionalMetadata: [],
      }

      // Calculate required account space and lamports
      const mintLen = getMintLen([ExtensionType.MetadataPointer])
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length
      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen)

      // Convert supply to actual tokens based on decimals
      const supply = parseFloat(tokenDetails.supply)
      if (isNaN(supply)) {
        toast.error('Please enter a valid supply amount')
        return
      }
      const rawSupply = Math.floor(supply * Math.pow(10, decimals))

      // Determine authorities
      const mintAuthority = authorityOptions.mintAuthorityNull ? null : wallet.publicKey
      const freezeAuthority = authorityOptions.freezeAuthorityNull ? null : wallet.publicKey
      const updateAuthority = authorityOptions.updateAuthorityNull ? null : wallet.publicKey

      // Build transaction
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),

        // createInitializeMetadataPointerInstruction(
        //   mintKeypair.publicKey,
        //   updateAuthority || wallet.publicKey, // Fallback to wallet if update authority is null
        //   mintKeypair.publicKey,
        //   TOKEN_2022_PROGRAM_ID
        // ),
        // createInitializeMintInstruction(
        //   mintKeypair.publicKey,
        //   decimals,
        //   mintAuthority || PublicKey.default, // Use default if null
        //   freezeAuthority,
        //   TOKEN_2022_PROGRAM_ID
        // ),
        // createInitializeInstruction({
        //   programId: TOKEN_2022_PROGRAM_ID,
        //   mint: mintKeypair.publicKey,
        //   metadata: mintKeypair.publicKey,
        //   name: metadata.name,
        //   symbol: metadata.symbol,
        //   uri: metadata.uri,
        //   mintAuthority: mintAuthority || PublicKey.default, // Use default if null
        //   updateAuthority: updateAuthority || PublicKey.default, // Use default if null
        // })

        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        })
      )

      // Set transaction parameters
      transaction.feePayer = wallet.publicKey
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.partialSign(mintKeypair)

      // Send transaction
      const signature = await wallet.sendTransaction(transaction, connection)
      const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      setExplorerLink(link)

      toast.success('Token created successfully!')
      setTokenCreated(true)
    } catch (error: any) {
      console.error('Error creating token:', error)
      toast.error(`Failed to create token: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="m-5 w-[600px] rounded-lg bg-white p-5 text-sm text-black">
        <h2 className="mb-4 text-xl font-bold">Create New Token</h2>

        <div className="space-y-4">
          {/* Token details form (same as before) */}
          <div>
            <label className="mb-2 block text-gray-700">Token Name*</label>
            <input
              type="text"
              name="name"
              value={tokenDetails.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="My Awesome Token"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-700">Token Symbol*</label>
            <input
              type="text"
              name="symbol"
              value={tokenDetails.symbol}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="MAT"
              maxLength={10}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-700">Image URL*</label>
            <input
              type="url"
              name="imageUrl"
              value={tokenDetails.imageUrl}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/token-image.png"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-700">Initial Supply*</label>
            <input
              type="number"
              name="supply"
              value={tokenDetails.supply}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="1000000"
              min="0.000000001"
              step="any"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-700">Decimals*</label>
            <input
              type="number"
              name="decimals"
              value={tokenDetails.decimals}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="9"
              min="0"
              max="18"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Number of decimal places (usually 9 for Solana tokens)
            </p>
          </div>

          {/* Authority options */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-lg font-medium">Authority Settings</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mint Authority</p>
                  <p className="text-sm text-gray-600">
                    {authorityOptions.mintAuthorityNull
                      ? 'Will be set to NULL (cannot mint more tokens)'
                      : 'Will be set to your wallet (can mint more tokens)'}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="mintAuthorityNull"
                    checked={authorityOptions.mintAuthorityNull}
                    onChange={handleAuthorityChange}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Freeze Authority</p>
                  <p className="text-sm text-gray-600">
                    {authorityOptions.freezeAuthorityNull
                      ? 'Will be set to NULL (cannot freeze accounts)'
                      : 'Will be set to your wallet (can freeze accounts)'}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="freezeAuthorityNull"
                    checked={authorityOptions.freezeAuthorityNull}
                    onChange={handleAuthorityChange}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Update Authority</p>
                  <p className="text-sm text-gray-600">
                    {authorityOptions.updateAuthorityNull
                      ? 'Will be set to NULL (cannot update metadata)'
                      : 'Will be set to your wallet (can update metadata)'}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="updateAuthorityNull"
                    checked={authorityOptions.updateAuthorityNull}
                    onChange={handleAuthorityChange}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"></div>
                </label>
              </div>
            </div>
          </div>

          {tokenCreated && (
            <div className="rounded-lg bg-green-100 p-3">
              <p className="font-medium">Token Created Successfully!</p>
              <p>Mint Address: {mintAddress}</p>
              {explorerLink && (
                <Link href={explorerLink} target="_blank" rel="noopener noreferrer">
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-700 hover:underline">
                    <span>View on Solana Explorer</span>
                    <IconExternalLink className="h-4 w-4" />
                  </div>
                </Link>
              )}
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={createToken}
              disabled={isLoading || !wallet.connected}
              className={`w-full rounded-lg px-4 py-3 font-medium text-white ${
                isLoading || !wallet.connected
                  ? 'cursor-not-allowed bg-purple-400'
                  : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors`}
            >
              {isLoading
                ? 'Creating Token...'
                : !wallet.connected
                  ? 'Connect Wallet to Continue'
                  : 'Create Token'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
