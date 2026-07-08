import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { finalize, switchMap } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { PlaidService } from '../../core/services/plaid.service';
import { ToastService } from '../../core/services/toast.service';
import { Card } from '../../shared/components/card/card';
import { Badge } from '../../shared/components/badge/badge';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Button } from '../../shared/components/button/button';
import { AccountType } from '../../core/models/account.model';

const ACCOUNT_ICON: Record<AccountType, string> = {
  checking: 'bxs-wallet',
  savings: 'bxs-piggy-bank',
  credit: 'bxs-credit-card',
  investment: 'bxs-line-chart',
};

const ACCOUNT_GRADIENT: Record<AccountType, string> = {
  checking: 'linear-gradient(135deg, #3c5be6 0%, #1e3a8a 100%)',
  savings: 'linear-gradient(135deg, #0f766e 0%, #022c22 100%)',
  credit: 'linear-gradient(135deg, #9333ea 0%, #4c1d95 100%)',
  investment: 'linear-gradient(135deg, #d98c1f 0%, #78350f 100%)',
};

@Component({
  selector: 'app-my-banks',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, Card, Badge, Skeleton, EmptyState, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-banks.html',
  styleUrl: './my-banks.scss',
})
export class MyBanksPage implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly plaidService = inject(PlaidService);
  private readonly toast = inject(ToastService);

  protected readonly accounts = this.accountService.accounts;
  protected readonly loading = this.accountService.loading;
  protected readonly connecting = signal(false);
  protected readonly accountIcon = ACCOUNT_ICON;
  protected readonly accountGradient = ACCOUNT_GRADIENT;

  ngOnInit(): void {
    this.accountService.loadAccounts().subscribe();
  }

  protected connectBank(): void {
    this.connecting.set(true);
    this.plaidService
      .connectBank()
      .pipe(
        switchMap(() => this.accountService.loadAccounts()),
        finalize(() => this.connecting.set(false)),
      )
      .subscribe({
        next: () => this.toast.show('Bank connected successfully.', 'success'),
        error: () => this.toast.show('Bank connection could not be completed.', 'danger'),
      });
  }
}
