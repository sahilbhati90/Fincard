import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AccountType, BalanceSummary, BankAccount } from '../models/account.model';

/** Raw shape returned by GET /api/plaid/user-banks (backend field names). */
interface UserBankResponse {
    accountId: string;
    itemId: string;
    accountName: string;
    institutionName: string;
    mask: string;
    type: string;             // Plaid type e.g. "depository", "credit"
    subtype: string;          // Plaid subtype e.g. "checking", "savings", "credit card"
    balance: string;          // formatted string e.g. "1234.56"
}

/** Maps Plaid's type/subtype into our simpler AccountType. */
function toAccountType(type: string, subtype: string): AccountType {
    const sub = (subtype || '').toLowerCase();
    if (sub.includes('credit')) return 'credit';
    if (sub.includes('saving')) return 'savings';
    if (sub.includes('invest') || sub.includes('brokerage') || sub.includes('401k')) return 'investment';
    return 'checking';
}

/**
 * Owns bank account state for the whole app. Dashboard, My Banks and
 * Transfer pages all read from the same signal so balances stay in
 * sync without re-fetching.
 */
@Injectable({ providedIn: 'root' })
export class AccountService {
    private readonly http = inject(HttpClient);

    private readonly accountsSignal = signal<BankAccount[]>([]);
    private readonly loadingSignal = signal(false);

    readonly accounts = this.accountsSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();

    readonly summary = computed<BalanceSummary>(() => {
        const accounts = this.accountsSignal();
        return {
            totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
            connectedBanks: accounts.length,
            currency: 'USD',
            changeVsLastMonth: 4.8, // backend doesn't track month-over-month change yet
        };
    });

    loadAccounts(): Observable<BankAccount[]> {
        this.loadingSignal.set(true);
        return this.fetchAccounts().pipe(
            tap((accounts) => {
                this.accountsSignal.set(accounts);
                this.loadingSignal.set(false);
            }),
        );
    }

    private fetchAccounts(): Observable<BankAccount[]> {
        return this.http.get<UserBankResponse[]>('/api/plaid/user-banks').pipe(
            map((banks) =>
                banks.map((b, index) => ({
                    id: b.accountId || `${b.itemId}-${b.mask || index}`,
                    itemId: b.itemId,
                    institutionName: b.institutionName,
                    accountType: toAccountType(b.type, b.subtype),
                    nickname: b.accountName,
                    mask: b.mask,
                    balance: parseFloat(b.balance) || 0,
                    currency: 'USD',
                    isPrimary: index === 0,
                    connectedAt: '', // backend doesn't send this yet — see notes
                })),
            ),
        );
    }

    applyTransfer(senderAccountId: string, recipientAccountId: string, amount: number): void {
        this.accountsSignal.update((accounts) =>
            accounts.map((account) => {
                if (account.id === senderAccountId) {
                    return { ...account, balance: account.balance - amount };
                }
                if (account.id === recipientAccountId) {
                    return { ...account, balance: account.balance + amount };
                }
                return account;
            }),
        );
    }
}
