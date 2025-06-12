'use client'
import { IconExternalLink } from '@tabler/icons-react'
import {
  Keypair,
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { useState, useEffect } from 'react'
import bs58 from 'bs58'
import { toast } from 'sonner'
import Link from 'next/link'

export interface Wallet {
  mnemonic: string
  solanaPath: string
  solanaPrivateKey: string
  solanaPublicKey: string
  ethereumPath?: string
  ethereumPrivateKey?: string
  ethereumPublicKey?: string
}

export default function SendToken() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [payer, setPayer] = useState<Keypair | null>(null)
  const [payeeAccount, setPayeeAccount] = useState('')
  const [lamports, setLamports] = useState(0)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [payerBalance, setPayerBalance] = useState<number | null>(null)
  const [success, setSuccess] = useState('')
  const [signLink, setSignLink] = useState('')

  const connection = new Connection('https://api.devnet.solana.com')

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

  useEffect(() => {
    if (payer) {
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(payer.publicKey)
          setPayerBalance(balance)
        } catch (err) {
          console.error('Failed to fetch balance', err)
          setPayerBalance(null)
        }
      }
      fetchBalance()
    } else {
      setPayerBalance(null)
    }
  }, [payer, connection])

  const getKeypairFromPrivateKey = (privateKey: string): Keypair | null => {
    try {
      const secretKey = bs58.decode(privateKey)
      return Keypair.fromSecretKey(secretKey)
    } catch (e) {
      console.error('Failed to create keypair from private key', e)
      return null
    }
  }

  async function main() {
    setIsLoading(true)
    setSuccess('')

    if (!payer) {
      toast.error('Please select a payer account')
      setIsLoading(false)
      return
    }

    if (!payeeAccount) {
      toast.error('Please enter a valid payee public key')
      setIsLoading(false)
      return
    }

    if (lamports <= 0) {
      toast.error('Please enter a positive amount')
      setIsLoading(false)
      return
    }

    try {
      // Validate payee public key
      const payeePublicKey = new PublicKey(payeeAccount)

      if (payerBalance === null || payerBalance < lamports) {
        toast.error(
          `Insufficient balance. Available: ${
            payerBalance ? payerBalance / LAMPORTS_PER_SOL : 0
          } SOL`
        )
        setIsLoading(false)
        return
      }

      toast.loading('Processing transaction...')
      const transaction = new Transaction()
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: payeePublicKey,
          lamports,
        })
      )

      const signature = await connection.sendTransaction(transaction, [payer])
      const smallSignature = `${signature.substring(0, 6)}...${signature.slice(-4)}`
      const solanaExplorerLink = 'https://explorer.solana.com/tx/' + signature + '?cluster=devnet'
      setSignLink(solanaExplorerLink)
      setSuccess(`Transaction successful! Signature: ${smallSignature}`)
      toast.success(`Transaction successful! Signature: ${smallSignature}}`)
      toast.success(
        `Success! ${lamports} SOL sent to ${payeePublicKey
          .toString()
          .slice(0, 4)}...${payeePublicKey.toString().slice(-4)}`
      )
    } catch (err) {
      console.error('Transaction failed', err)
      toast.error(`Transaction failed: ${err instanceof Error ? err.message : String(err)}`)
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
            <label className="mb-2 block text-gray-700">Select Payer Account</label>
            <select
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              onChange={(e) => {
                const index = parseInt(e.target.value)
                if (!isNaN(index) && index >= 0 && index < wallets.length) {
                  const selectedWallet = wallets[index]
                  const keypair = getKeypairFromPrivateKey(selectedWallet.solanaPrivateKey)
                  if (keypair) {
                    setPayer(keypair)
                  } else {
                    toast.error('Invalid private key for selected wallet')
                  }
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
            <label className="mb-2 block text-gray-700">Payee Public Key</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              value={payeeAccount}
              onChange={(e) => setPayeeAccount(e.target.value.trim())}
              placeholder="Enter payee's public key"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-700">Amount (in SOL)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              value={lamports / LAMPORTS_PER_SOL}
              onChange={(e) => setLamports(Number(e.target.value) * LAMPORTS_PER_SOL)}
              placeholder="Enter amount in SOL"
            />
            <p className="mt-1 text-sm text-gray-500">1 SOL = {LAMPORTS_PER_SOL} lamports</p>
          </div>

          {payer && (
            <div className="rounded-lg bg-gray-100 p-3 text-sm">
              <p>Selected Payer: {payer.publicKey.toBase58()}</p>
              <p className="text-purple-600">
                Current Balance:{' '}
                {payerBalance !== null ? `${payerBalance / LAMPORTS_PER_SOL} SOL` : 'Loading...'}
              </p>
            </div>
          )}

          {success && (
            <Link href={signLink}>
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-700 hover:underline">
                <p className="m-0">{success}</p>
                <IconExternalLink className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              </div>
            </Link>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={main}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 font-medium text-white ${
              isLoading ? 'cursor-not-allowed bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
            } transition-colors`}
          >
            {isLoading ? 'Processing...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
