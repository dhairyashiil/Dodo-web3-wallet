'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { toast } from 'sonner'
import { Wallet } from '@/app/home/send/page'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletType } from './AirdropToken'

export function ExpandableCardDemo() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(null)
  const [selectedPublicKey, setSelectedPublicKey] = useState<string>('')
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  const [walletType, setWalletType] = useState<WalletType>('dodo')

  const wallet = useWallet()
  let externalPublicKey
  if (wallet.connected) {
    console.log('wallet is connected')
    externalPublicKey = wallet.publicKey
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false)
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useEffect(() => {
    const storedWallets = localStorage.getItem('wallets')
    if (storedWallets) {
      try {
        const parsedWallets: Wallet[] = JSON.parse(storedWallets)
        setWallets(parsedWallets)
        // Set the first wallet as selected by default if available
        if (parsedWallets.length > 0) {
          setSelectedPublicKey(parsedWallets[0].solanaPublicKey)
        }
      } catch (e) {
        console.error('Failed to parse wallets from localStorage', e)
      }
    }
  }, [])

  useOutsideClick(ref, () => {
    setActive(null)
    setBalance(null)
    setError(null)
  })

  const fetchBalance = async () => {
    if (!selectedPublicKey.trim()) {
      setError('Please select a wallet')
      return
    }

    setLoading(true)
    setError(null)
    setBalance(null)

    try {
      let apiUrl = ''
      let responseData: any

      if (active && typeof active === 'object') {
        switch (active.title) {
          case 'Solana (SOL)':
            apiUrl = 'https://api.devnet.solana.com'
            const solanaResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [selectedPublicKey],
              }),
            })
            responseData = await solanaResponse.json()
            setBalance(
              responseData.result?.value
                ? (responseData.result.value / 1000000000).toFixed(4) + ' SOL'
                : '0 SOL'
            )
            break

          case 'Ethereum (ETH)':
            toast.success(
              'Right now, this feature works only with Solana. Support for this token is coming soon!'
            )
            break

          case 'USD Coin (USDC)':
            toast.success(
              'Right now, this feature works only with Solana. Support for this token is coming soon!'
            )
            break

          case 'Bitcoin (BTC)':
            toast.success(
              'Right now, this feature works only with Solana. Support for this token is coming soon!'
            )
            break

          default:
            setBalance(null)
        }
      }
    } catch (err) {
      setError('Failed to fetch balance. Please try again.')
      console.error('Error fetching balance:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className="fixed inset-0 z-[100] mt-48 grid place-items-center">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={() => {
                setActive(null)
                setBalance(null)
                setError(null)
              }}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex h-fit w-full max-w-[400px] flex-col overflow-hidden bg-white dark:bg-neutral-900 sm:rounded-2xl md:h-fit md:max-h-[800px]"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="h-60 w-full object-cover object-top sm:rounded-tl-lg sm:rounded-tr-lg lg:h-60"
                />
              </motion.div>

              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="text-sm font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-xs text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-neutral-700">
                    <label className="mb-2 block text-gray-700">Wallet Type</label>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          checked={walletType === 'dodo'}
                          onChange={() => setWalletType('dodo')}
                        />
                        <span className="ml-2">Dodo Wallet</span>
                      </label>

                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          checked={walletType === 'external'}
                          onChange={() => {
                            setWalletType('external')
                            if (wallet.connected && wallet.publicKey) {
                              setSelectedPublicKey(wallet.publicKey.toBase58())
                            }
                          }}
                          disabled={!externalPublicKey}
                        />
                        <span className={`ml-2 ${!externalPublicKey ? 'text-gray-400' : ''}`}>
                          {wallet?.wallet?.adapter.name || 'External'} Wallet{' '}
                          {!externalPublicKey && '(Not connected)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="text-sm text-neutral-700">
                    <label className="mb-2 block text-gray-700">
                      Public Key of Recipient&apos;s Account
                    </label>
                    {walletType === 'dodo' ? (
                      <select
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                          const index = parseInt(e.target.value)
                          if (!isNaN(index) && index >= 0 && index < wallets.length) {
                            const selectedWallet = wallets[index]
                            setSelectedPublicKey(selectedWallet.solanaPublicKey)
                          }
                        }}
                        value={wallets.findIndex((w) => w.solanaPublicKey === selectedPublicKey)}
                      >
                        <option value="">Select Account From Dodo Wallet</option>
                        {wallets.map((wallet, index) => (
                          <option key={index} value={index}>
                            {wallet.solanaPublicKey}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        {externalPublicKey ? (
                          <input
                            type="text"
                            readOnly
                            value={externalPublicKey.toBase58()}
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
                          />
                        ) : (
                          <div className="rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-500">
                            No external wallet connected
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Select Account
                    </label>
                    {wallets.length > 0 ? (
                      <select
                        value={selectedPublicKey}
                        onChange={(e) => setSelectedPublicKey(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        {wallets.map((wallet) => (
                          <option
                            key={wallet.solanaPublicKey}
                            value={wallet.solanaPublicKey}
                            className="text-xs"
                          >
                            {wallet.solanaPublicKey.substring(0, 6)}...
                            {wallet.solanaPublicKey.slice(-4)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="rounded bg-neutral-100 p-2 text-xs text-red-500 dark:bg-neutral-800">
                        No wallets found. Please add a wallet first.
                      </div>
                    )}
                  </div> */}

                  <button
                    onClick={fetchBalance}
                    disabled={loading || wallets.length === 0}
                    className="w-full rounded-md bg-green-500 px-4 py-2 text-xs font-bold text-white hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Checking...' : 'Check Balance'}
                  </button>

                  {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}

                  {balance && (
                    <div className="mt-2 rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                        Balance: <span className="font-bold text-green-500">{balance}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto w-full max-w-xl gap-3">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="my-3 flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-white p-3 hover:border hover:border-black hover:bg-neutral-50 dark:hover:bg-neutral-800 md:flex-row"
          >
            <div className="flex flex-col gap-3 md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={80}
                  height={80}
                  src={card.src}
                  alt={card.title}
                  className="h-32 w-32 rounded-md object-cover object-top md:h-14 md:w-14"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="text-center text-lg font-medium text-neutral-800 dark:text-neutral-200 md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-center text-xs text-yellow-500 dark:text-neutral-400 md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="mt-3 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold hover:bg-neutral-700 hover:text-white md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 text-neutral-700"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}

const cards = [
  {
    description: 'Cryptocurrency',
    title: 'Solana (SOL)',
    src: '/solana-sol-logo.png',
    ctaText: 'Check Balance',
    ctaLink: 'https://www.binance.com/en/trade/SOL_USDT',
    content: () => {
      return (
        <p className="text-xs">
          Solana is a high-performance blockchain supporting decentralized apps and
          crypto-currencies.
        </p>
      )
    },
  },
  {
    description: 'Cryptocurrency',
    title: 'Ethereum (ETH)',
    src: '/ethereum-eth-logo.png',
    ctaText: 'Check Balance',
    ctaLink: 'https://www.binance.com/en/trade/ETH_USDT',
    content: () => {
      return (
        <p className="text-xs">
          Ethereum is a decentralized, open-source blockchain with smart contract functionality.
        </p>
      )
    },
  },
  {
    description: 'Stablecoin',
    title: 'USD Coin (USDC)',
    src: '/usd-coin-usdc-logo.png',
    ctaText: 'Check Balance',
    ctaLink: 'https://www.binance.com/en/trade/USDC_USDT',
    content: () => {
      return (
        <p className="text-xs">
          USD Coin is a stablecoin pegged to the US dollar and regulated by financial authorities.
        </p>
      )
    },
  },
  {
    description: 'Cryptocurrency',
    title: 'Bitcoin (BTC)',
    src: '/bitcoin-btc-logo.png',
    ctaText: 'Check Balance',
    ctaLink: 'https://www.binance.com/en/trade/BTC_USDT',
    content: () => {
      return (
        <p className="text-xs">
          Bitcoin is the first decentralized cryptocurrency, created in 2009 by an anonymous person
          or group.
        </p>
      )
    },
  },
]
