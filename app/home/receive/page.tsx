"use client";

import { useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";

// {
//     name: "Alchemy",
//     url: "https://solana-devnet.g.alchemy.com/v2/", // API Key: jfdJi0c1ziLLMc2lRF_gu5p_ByMqeY_U
//     requiresKey: true
//   },

const RPC_PROVIDERS = [
  {
    name: "Quicknode",
    url: "https://newest-blue-hill.solana-devnet.quiknode.pro/", // API Key: e8d6f0a2a56ea2bcbb7b76df179a366105a10dd6
    requiresKey: true,
  },
  {
    name: "Helius",
    url: "https://devnet.helius-rpc.com/?api-key=",
    requiresKey: true,
  },
  {
    name: "Infura",
    url: "https://solana-devnet.infura.io/v3/",
    requiresKey: true,
  },
  {
    name: "Solana Public RPC",
    url: "https://api.devnet.solana.com",
    requiresKey: false,
  },
];

export default function ReceivePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(RPC_PROVIDERS[3]); // Default to Solana Public RPC
  const [apiKey, setApiKey] = useState("");

  const getConnectionUrl = () => {
    if (selectedProvider.requiresKey) {
      return `${selectedProvider.url}${apiKey}`;
    }
    return selectedProvider.url;
  };

  const handleAirdrop = async () => {
    if (!publicKey || !amount) {
      toast.success("Please fill all fields");
      return;
    }

    if (selectedProvider.requiresKey && !apiKey) {
      toast.success(`API key is required for ${selectedProvider.name}`);
      return;
    }

    try {
      setIsLoading(true);
      const connection = new Connection(getConnectionUrl(), "confirmed");
      const publicKeyObj = new PublicKey(publicKey);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      toast.loading(`Requesting airdrop via ${selectedProvider.name}...`);
      const tx = await connection.requestAirdrop(publicKeyObj, lamports);
      await connection.confirmTransaction(tx);

      toast.success(
        `Success! ${amount} SOL airdropped to ${publicKey.slice(
          0,
          4
        )}...${publicKey.slice(-4)} via ${selectedProvider.name}`
      );
      setIsModalOpen(false);
      setPublicKey("");
      setAmount("");
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.success(
        `Airdrop failed via ${selectedProvider.name}. Error: ${error}`
      );
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Receive SOL</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Request SOL Airdrop
        </button>

        {/* Airdrop Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Token Airdrop (Devnet)
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    RPC Provider
                  </label> 
                  <select
                    value={selectedProvider.name}
                    onChange={(e) => {
                      const provider = RPC_PROVIDERS.find(
                        (p) => p.name === e.target.value
                      );
                      setSelectedProvider(provider || RPC_PROVIDERS[4]);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <label className="block text-gray-700 mb-2">
                      {selectedProvider.name} API Key
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${selectedProvider.name} API key`}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 mb-2">Token</label>
                  <input
                    type="text"
                    value="SOLANA"
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Public Key of Recipient's Account
                  </label>
                  <input
                    type="text"
                    placeholder="Enter public key"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Amount (in SOL)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    1 SOL = {LAMPORTS_PER_SOL} lamports
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAirdrop}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-white font-medium ${
                    isLoading
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  } transition-colors`}
                >
                  {isLoading ? "Processing..." : "Airdrop"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
