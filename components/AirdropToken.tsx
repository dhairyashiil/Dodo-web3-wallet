'use client'
import { useEffect, useState } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { toast } from 'sonner'
import { IconExternalLink } from '@tabler/icons-react'
import Link from 'next/link'
import { Wallet } from '@/app/home/send/page'

const RPC_PROVIDERS = [
  {
    name: 'Quicknode',
    url: 'https://newest-blue-hill.solana-devnet.quiknode.pro/', // API Key: e8d6f0a2a56ea2bcbb7b76df179a366105a10dd6
    requiresKey: true,
  },
  {
    name: 'Solana Public RPC',
    url: 'https://api.devnet.solana.com',
    requiresKey: false,
  },
  // {
  //     name: "Alchemy",
  //     url: "https://solana-devnet.g.alchemy.com/v2/", // API Key: jfdJi0c1ziLLMc2lRF_gu5p_ByMqeY_U
  //     requiresKey: true
  //   },
  // {
  //   name: "Helius",
  //   url: "https://devnet.helius-rpc.com/?api-key=",
  //   requiresKey: true,
  // },
  // {
  //   name: "Infura",
  //   url: "https://solana-devnet.infura.io/v3/",
  //   requiresKey: true,
  // },
]

export default function AirdropToken() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [publicKey, setPublicKey] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(RPC_PROVIDERS[1]) // Default to Solana Public RPC
  const [apiKey, setApiKey] = useState('')
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [success, setSuccess] = useState('')
  const [signLink, setSignLink] = useState('')

  useEffect(() => {
    const storedWallets = localStorage.getItem('wallets')
    if (storedWallets) {
      try {
        const parsedWallets: Wallet[] = JSON.parse(storedWallets)
        setWallets(parsedWallets)
      } catch (e) {
        console.error('Failed to parse wallets from localStorage', e)
      }
    }
  }, [])

  const getConnectionUrl = () => {
    if (selectedProvider.requiresKey) {
      return `${selectedProvider.url}${apiKey}`
    }
    return selectedProvider.url
  }

  const handleAirdrop = async () => {
    if (!publicKey || !amount) {
      toast.success('Please fill all fields')
      return
    }

    if (selectedProvider.requiresKey && !apiKey) {
      toast.success(`API key is required for ${selectedProvider.name}`)
      return
    }

    try {
      setIsLoading(true)
      setSuccess('')

      const connection = new Connection(getConnectionUrl(), 'confirmed')
      const publicKeyObj = new PublicKey(publicKey)
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL

      toast.loading(`Requesting airdrop via ${selectedProvider.name}...`)
      const signature = await connection.requestAirdrop(publicKeyObj, lamports)
      const smallSignature = `${signature.substring(0, 6)}...${signature.slice(-4)}`
      const solanaExplorerLink = 'https://explorer.solana.com/tx/' + signature + '?cluster=devnet'
      setSignLink(solanaExplorerLink)

      setSuccess(`Airdrop successful! Signature: ${smallSignature}`)
      toast.success(
        `Success! ${amount} SOL airdropped to ${publicKey.slice(
          0,
          4
        )}...${publicKey.slice(-4)} via ${selectedProvider.name}`
      )
      setIsModalOpen(false)
      setPublicKey('')
      setAmount('')
    } catch (error) {
      console.error('Airdrop failed:', error)
      toast.success(`Airdrop failed via ${selectedProvider.name}. Error: ${error}`)
    } finally {
      toast.dismiss()
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="m-5 w-[600px] rounded-lg bg-white p-5 text-sm text-black">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-gray-700">RPC Provider</label>
            <select
              value={selectedProvider.name}
              onChange={(e) => {
                const provider = RPC_PROVIDERS.find((p) => p.name === e.target.value)
                setSelectedProvider(provider || RPC_PROVIDERS[4])
              }}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            >
              {RPC_PROVIDERS.map((provider) => (
                <option key={provider.name} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProvider.requiresKey && (
            <div>
              <label className="mb-2 block text-gray-700">{selectedProvider.name} API Key</label>
              <input
                type="text"
                placeholder={`Enter ${selectedProvider.name} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-gray-700">Token</label>
            <input
              type="text"
              value="SOLANA"
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-700">
              Public Key of Recipient&apos;s Account
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              onChange={(e) => {
                const index = parseInt(e.target.value)
                if (!isNaN(index) && index >= 0 && index < wallets.length) {
                  const selectedWallet = wallets[index]
                  setPublicKey(selectedWallet.solanaPublicKey)
                }
              }}
            >
              <option value="">Select an account</option>
              {wallets.map((wallet, index) => (
                <option key={index} value={index}>
                  {wallet.solanaPublicKey}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-gray-700">Amount (in SOL)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            />
            <p className="mt-1 text-sm text-gray-500">1 SOL = {LAMPORTS_PER_SOL} lamports</p>
          </div>
        </div>

        {success && (
          <Link href={signLink}>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-700 hover:underline">
              <p className="m-0">{success}</p>
              <IconExternalLink className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            </div>
          </Link>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAirdrop}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 font-medium text-white ${
              isLoading ? 'cursor-not-allowed bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
            } transition-colors`}
          >
            {isLoading ? 'Processing...' : 'Airdrop'}
          </button>
        </div>
      </div>
    </div>
  )
}
