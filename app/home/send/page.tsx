"use client"
import { CompareDemo } from "@/components/Compare";
import { createMint } from "@solana/spl-token";
import { IconDeviceIpadExclamation } from "@tabler/icons-react";
import {
  Keypair,
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useState, useEffect } from "react";
import bs58 from "bs58";

interface Wallet {
  mnemonic: string;
  solanaPath: string;
  solanaPrivateKey: string;
  solanaPublicKey: string;
  ethereumPath?: string;
  ethereumPrivateKey?: string;
  ethereumPublicKey?: string;
}

export default function SendPage() {
  const [payer, setPayer] = useState<Keypair | null>(null);
  const [payeeAccount, setPayeeAccount] = useState("");
  const [lamports, setLamports] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payerBalance, setPayerBalance] = useState<number | null>(null);

  const connection = new Connection("https://api.devnet.solana.com");

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    if (storedWallets) {
      try {
        const parsedWallets: Wallet[] = JSON.parse(storedWallets);
        setWallets(parsedWallets);
      } catch (e) {
        console.error("Failed to parse wallets from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (payer) {
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(payer.publicKey);
          setPayerBalance(balance);
        } catch (err) {
          console.error("Failed to fetch balance", err);
          setPayerBalance(null);
        }
      };
      fetchBalance();
    } else {
      setPayerBalance(null);
    }
  }, [payer, connection]);

  const getKeypairFromPrivateKey = (privateKey: string): Keypair | null => {
    try {
      const secretKey = bs58.decode(privateKey);
      return Keypair.fromSecretKey(secretKey);
    } catch (e) {
      console.error("Failed to create keypair from private key", e);
      return null;
    }
  };

  async function main() {
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    if (!payer) {
      setError("Please select a payer account");
      setIsLoading(false);
      return;
    }

    if (!payeeAccount) {
      setError("Please enter a valid payee public key");
      setIsLoading(false);
      return;
    }

    if (lamports <= 0) {
      setError("Please enter a positive amount");
      setIsLoading(false);
      return;
    }

    try {
      // Validate payee public key
      const payeePublicKey = new PublicKey(payeeAccount);
      
      if (payerBalance === null || payerBalance < lamports) {
        setError(`Insufficient balance. Available: ${payerBalance ? payerBalance / LAMPORTS_PER_SOL : 0} SOL`);
        setIsLoading(false);
        return;
      }

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: payeePublicKey,
          lamports,
        })
      );

      const signature = await connection.sendTransaction(transaction, [payer]);
      console.log(`Transferred to ${payeePublicKey.toBase58()}`);
      setSuccess(`Transaction successful! Signature: ${signature}`);
    } catch (err) {
      console.error("Transaction failed", err);
      setError(`Transaction failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-6">Send SOL</h1>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Payer Account:</label>
        <select 
          className="w-full p-2 border rounded bg-white"
          onChange={(e) => {
            const index = parseInt(e.target.value);
            if (!isNaN(index) && index >= 0 && index < wallets.length) {
              const selectedWallet = wallets[index];
              const keypair = getKeypairFromPrivateKey(selectedWallet.solanaPrivateKey);
              if (keypair) {
                setPayer(keypair);
              } else {
                setError("Invalid private key for selected wallet");
              }
            }
          }}
        >
          <option value="">Select an account</option>
          {wallets.map((wallet, index) => (
            <option key={index} value={index}>
              {wallet.solanaPublicKey} (Path: {wallet.solanaPath})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Payee Public Key:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={payeeAccount}
          onChange={(e) => setPayeeAccount(e.target.value.trim())}
          placeholder="Enter payee's public key"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Amount (SOL):</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={lamports / LAMPORTS_PER_SOL}
          onChange={(e) => setLamports(Number(e.target.value) * LAMPORTS_PER_SOL)}
          placeholder="Enter amount in SOL"
          // step="0.01"
          // min="0"
        />
      </div>

      <button
        className={`w-full py-2 px-4 rounded font-medium ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        onClick={main}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Send"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded flex items-start">
          <IconDeviceIpadExclamation className="flex-shrink-0 mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {payer && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <p>Selected Payer: {payer.publicKey.toBase58()}</p>
          <p>Current Balance: {payerBalance !== null ? `${payerBalance / LAMPORTS_PER_SOL} SOL` : "Loading..."}</p>
        </div>
      )}
    </div>
  );
}