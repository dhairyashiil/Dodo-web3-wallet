'use client'
import DeviceDetector from '@/components/DeviceDetector'
import { FloatingNavDemo } from '@/components/FloatingNavbar'
import { SidebarDemo } from '@/components/Sidebar'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

// Required styles
import '@solana/wallet-adapter-react-ui/styles.css'
import { useMemo } from 'react'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  return (
    <html lang="en">
      <body>
        <DeviceDetector>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>
                <SidebarDemo>
                  {children} <FloatingNavDemo />
                </SidebarDemo>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </DeviceDetector>
      </body>
    </html>
  )
}
