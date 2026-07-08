export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

export interface BankAccount {
  id: string;
  itemId: string;
  institutionName: string;
  institutionLogoUrl?: string;
  accountType: AccountType;
  nickname: string;
  mask: string;
  balance: number;
  currency: string;
  isPrimary: boolean;
  connectedAt: string;
}

export interface BalanceSummary {
  totalBalance: number;
  connectedBanks: number;
  currency: string;
  changeVsLastMonth: number;
}
