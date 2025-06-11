"use client";
import React, { useState, useEffect } from "react";
import WalletSetup from "../components/WalletSetup";
import { useWallet } from "../hooks/useWallet";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [balanceVisible, setBalanceVisible] = useState(true);

  const {
    walletState,
    createWallet,
    importWallet,
    importFromPrivateKey,
    addNewAccount,
    switchAccount,
    getActiveAccount,
  } = useWallet();

  /*
  // Check if wallet exists on app load
  useEffect(() => {
    const stored = localStorage.getItem("wallet_encrypted");
    if (stored) {
      // In a real app, you'd prompt for password here
      // For demo purposes, we'll auto-unlock
      try {
        const walletData = JSON.parse(stored);
        if (walletData.seedPhrase && walletData.accounts) {
          createWallet(walletData.seedPhrase);
        }
      } catch (error) {
        console.error("Failed to load wallet:", error);
      }
    }
  }, []);
  */

  // const renderActiveComponent = () => {
  //   switch (activeTab) {
  //     case 'dashboard':
  //       return (
  //         <Dashboard
  //           balanceVisible={balanceVisible}
  //           onToggleBalance={() => setBalanceVisible(!balanceVisible)}
  //           activeAccount={getActiveAccount()}
  //         />
  //       );
  //     case 'send':
  //       return <SendTokens />;
  //     case 'swap':
  //       return <SwapTokens />;
  //     case 'activity':
  //       return <Activity />;
  //     case 'accounts':
  //       return (
  //         <AccountManager
  //           accounts={walletState.accounts}
  //           activeAccountId={walletState.activeAccountId}
  //           onSwitchAccount={switchAccount}
  //           onAddNewAccount={addNewAccount}
  //           onImportPrivateKey={importFromPrivateKey}
  //         />
  //       );
  //     case 'portfolio':
  //       return (
  //         <div className="text-center py-12">
  //           <h2 className="text-2xl font-bold text-white mb-4">Portfolio Analytics</h2>
  //           <p className="text-gray-400">Coming soon - Advanced portfolio tracking and analytics</p>
  //         </div>
  //       );
  //     case 'security':
  //       return (
  //         <div className="text-center py-12">
  //           <h2 className="text-2xl font-bold text-white mb-4">Security Settings</h2>
  //           <p className="text-gray-400">Coming soon - Advanced security features and settings</p>
  //         </div>
  //       );
  //     case 'settings':
  //       return (
  //         <div className="text-center py-12">
  //           <h2 className="text-2xl font-bold text-white mb-4">Wallet Settings</h2>
  //           <p className="text-gray-400">Coming soon - Customize your wallet preferences</p>
  //         </div>
  //       );
  //     default:
  //       return (
  //         <Dashboard
  //           balanceVisible={balanceVisible}
  //           onToggleBalance={() => setBalanceVisible(!balanceVisible)}
  //           activeAccount={getActiveAccount()}
  //         />
  //       );
  //   }
  // };

  // Show wallet setup if no wallet exists
  // if (!walletState.isUnlocked || walletState.accounts.length === 0) {
  return (
    <WalletSetup
      onCreateWallet={createWallet}
      onImportWallet={importWallet}
      onImportPrivateKey={importFromPrivateKey}
    />
  );
  // }
}

export default App;
