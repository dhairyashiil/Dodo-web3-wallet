import { useState, useEffect } from 'react';
import { Account, WalletState } from '../types/wallet';

// Mock wallet functionality - in a real app, this would integrate with actual Web3 libraries
export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    accounts: [],
    activeAccountId: null,
    isUnlocked: false,
  });

  const generateAccount = (seedPhrase: string, accountIndex: number = 0): Account => {
    // Mock account generation - in real implementation, use libraries like ethers.js or web3.js
    const mockAddresses = [
      '0x1234567890123456789012345678901234567890',
      '0x2345678901234567890123456789012345678901',
      '0x3456789012345678901234567890123456789012',
      '0x4567890123456789012345678901234567890123',
      '0x5678901234567890123456789012345678901234',
    ];
    
    return {
      id: `account-${accountIndex}`,
      name: `Account ${accountIndex + 1}`,
      address: mockAddresses[accountIndex] || `0x${Math.random().toString(16).substr(2, 40)}`,
      balance: (Math.random() * 10).toFixed(4),
      isActive: accountIndex === 0,
      derivationPath: `m/44'/60'/0'/0/${accountIndex}`,
    };
  };

  const createWallet = (seedPhrase: string) => {
    const firstAccount = generateAccount(seedPhrase, 0);
    setWalletState({
      accounts: [firstAccount],
      activeAccountId: firstAccount.id,
      isUnlocked: true,
      seedPhrase,
    });
    localStorage.setItem('wallet_encrypted', JSON.stringify({ seedPhrase, accounts: [firstAccount] }));
  };

  const importWallet = (seedPhrase: string) => {
    createWallet(seedPhrase);
  };

  const importFromPrivateKey = (privateKey: string, accountName: string = 'Imported Account') => {
    // Mock private key import
    const newAccount: Account = {
      id: `imported-${Date.now()}`,
      name: accountName,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      balance: (Math.random() * 5).toFixed(4),
      isActive: false,
    };

    setWalletState(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
    }));
  };

  const addNewAccount = () => {
    if (!walletState.seedPhrase) return;
    
    const newIndex = walletState.accounts.length;
    const newAccount = generateAccount(walletState.seedPhrase, newIndex);
    
    setWalletState(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
    }));
  };

  const switchAccount = (accountId: string) => {
    setWalletState(prev => ({
      ...prev,
      activeAccountId: accountId,
      accounts: prev.accounts.map(acc => ({
        ...acc,
        isActive: acc.id === accountId,
      })),
    }));
  };

  const lockWallet = () => {
    setWalletState(prev => ({
      ...prev,
      isUnlocked: false,
    }));
  };

  const unlockWallet = (password: string) => {
    // Mock unlock - in real implementation, decrypt stored wallet data
    const stored = localStorage.getItem('wallet_encrypted');
    if (stored) {
      const walletData = JSON.parse(stored);
      setWalletState({
        accounts: walletData.accounts,
        activeAccountId: walletData.accounts[0]?.id || null,
        isUnlocked: true,
        seedPhrase: walletData.seedPhrase,
      });
      return true;
    }
    return false;
  };

  const getActiveAccount = (): Account | null => {
    return walletState.accounts.find(acc => acc.id === walletState.activeAccountId) || null;
  };

  return {
    walletState,
    createWallet,
    importWallet,
    importFromPrivateKey,
    addNewAccount,
    switchAccount,
    lockWallet,
    unlockWallet,
    getActiveAccount,
  };
};