'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function ResetPage() {
  const Reset = () => {
    try {
      localStorage.removeItem('mnemonics')
      localStorage.removeItem('pathTypes')
      localStorage.removeItem('paths')
      localStorage.removeItem('wallets')

      toast.success('All wallet data has been cleared. You can now set up a new wallet.')

      window.location.href = '/'
    } catch (error) {
      console.error('Reset failed:', error)
      toast.success('Failed to clear wallet data. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Wallet Reset</h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            Start fresh - clear current wallet and begin onboarding again
          </h2>
          <p className="mb-4 text-gray-600">
            This will permanently delete all your current wallet data including:
          </p>
          <ul className="mb-6 list-disc pl-5 text-gray-600">
            <li>Wallet mnemonics (secret recovery phrase)</li>
            <li>Derivation paths</li>
            <li>Wallet addresses</li>
          </ul>
          <p className="mb-4 font-medium text-red-500">
            Warning: This action cannot be undone. Make sure you have backed up your mnemonics.
          </p>

          <button
            onClick={Reset}
            className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700"
          >
            Reset Wallet & Clear All Data
          </button>
        </div>
      </div>
    </div>
  )
}
