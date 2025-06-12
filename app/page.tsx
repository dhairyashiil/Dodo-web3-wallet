"use client";
import React, { useState, useEffect } from "react";
import WalletSetup from "../components/WalletSetup";
import { useWallet } from "../hooks/useWallet";

function App() {

  const {
    walletState,
    createWallet,
    importWallet,
    importFromPrivateKey,
    addNewAccount,
    switchAccount,
    getActiveAccount,
  } = useWallet();

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonic = localStorage.getItem("mnemonics");

    if (storedWallets && storedMnemonic) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <WalletSetup
      onCreateWallet={createWallet}
      onImportWallet={importWallet}
      onImportPrivateKey={importFromPrivateKey}
    />
  );
}

export default App;
