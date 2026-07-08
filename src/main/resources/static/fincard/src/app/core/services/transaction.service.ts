import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Transaction, TransactionCategory } from '../models/transaction.model';

/** Raw shape returned by GET /api/transactions/recent (backend field names). */
interface TransactionResponse {
  transactionId: string;
  name: string;           // merchant name
  amount: number;          // Plaid convention: positive = money OUT, negative = money IN
  date: string;
  category: string;        // free-text Plaid category, e.g. "Food and Drink"
  channel: string;
  pending: boolean;        // NOTE: backend field is "isPending" but Jackson serializes boolean
  // getters (isPending()) by stripping "is" -> JSON key is "pending"
  accountName: string;
  institutionName: string;
}

/** Maps Plaid's free-text category into our closed TransactionCategory union. */
function toCategory(raw: string): TransactionCategory {
  const c = (raw || '').toLowerCase();
  if (c.includes('food') || c.includes('restaurant') || c.includes('grocer')) return 'food';
  if (c.includes('travel') || c.includes('transport') || c.includes('taxi') || c.includes('ride')) return 'transport';
  if (c.includes('shop') || c.includes('merchandise')) return 'shopping';
  if (c.includes('payroll') || c.includes('deposit') || c.includes('income')) return 'income';
  if (c.includes('subscription') || c.includes('entertainment')) return 'subscription';
  if (c.includes('transfer')) return 'transfer';
  return 'other';
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);

  private readonly transactionsSignal = signal<Transaction[]>([]);
  private readonly loadingSignal = signal(false);

  readonly transactions = this.transactionsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  loadTransactions(limit = 20): Observable<Transaction[]> {
    this.loadingSignal.set(true);
    return this.fetchTransactions(limit).pipe(
        tap((transactions) => {
          this.transactionsSignal.set(transactions);
        }),
        finalize(() => this.loadingSignal.set(false)),
    );
  }

  private fetchTransactions(limit: number): Observable<Transaction[]> {
    return this.http.get<TransactionResponse[]>(`/api/transactions/recent?limit=${limit}`).pipe(
        map((list) =>
            list.map((t) => ({
              id: t.transactionId,
              merchant: t.name,
              category: toCategory(t.category),
              // Plaid amount sign: positive = debit (money out), negative = credit (money in)
              amount: Math.abs(t.amount),
              currency: 'USD',
              date: t.date,
              status: t.pending ? 'pending' : 'completed',
              accountId: t.accountName,
              accountName: t.accountName,
              institutionName: t.institutionName,
              direction: t.amount >= 0 ? 'debit' : 'credit',
            })),
        ),
    );
  }
}
