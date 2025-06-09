export interface Account {
  id: string;
  name: string;
  address: string;
  balance: string;
  isActive: boolean;
  derivationPath?: string;
}

export interface WalletState {
  accounts: Account[];
  activeAccountId: string | null;
  isUnlocked: boolean;
  seedPhrase?: string;
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  contractAddress?: string;
}