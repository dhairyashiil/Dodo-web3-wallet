"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ResetPage() {
  const Reset = () => {
    try {
      localStorage.removeItem("mnemonics");
      localStorage.removeItem("pathTypes");
      localStorage.removeItem("paths");
      localStorage.removeItem("wallets");

      toast.success(
        "All wallet data has been cleared. You can now set up a new wallet."
      );

      window.location.href = "/";
    } catch (error) {
      console.error("Reset failed:", error);
      toast.success("Failed to clear wallet data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Wallet Reset</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Start fresh - clear current wallet and begin onboarding again
          </h2>
          <p className="text-gray-600 mb-4">
            This will permanently delete all your current wallet data including:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-600">
            <li>Wallet mnemonics (secret recovery phrase)</li>
            <li>Derivation paths</li>
            <li>Wallet addresses</li>
          </ul>
          <p className="text-red-500 font-medium mb-4">
            Warning: This action cannot be undone. Make sure you have backed up
            your mnemonics.
          </p>

          <button
            onClick={Reset}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Reset Wallet & Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
