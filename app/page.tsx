'use client'
import React, { useState, useEffect } from 'react'
import WalletSetup from '../components/WalletSetup'

function App() {
  useEffect(() => {
    const storedWallets = localStorage.getItem('wallets')
    const storedMnemonic = localStorage.getItem('mnemonics')

    if (storedWallets && storedMnemonic) {
      window.location.href = '/home'
    }
  }, [])

  return <WalletSetup />
}

export default App
