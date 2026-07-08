export type TransactionCategory =
  | 'shopping'
  | 'food'
  | 'transport'
  | 'income'
  | 'subscription'
  | 'transfer'
  | 'other';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  currency: string;
  date: string;
  status: TransactionStatus;
  accountId: string;
  accountName: string;
  institutionName: string;
  direction: 'credit' | 'debit';
}
