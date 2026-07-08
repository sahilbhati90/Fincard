import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { Card } from '../../shared/components/card/card';
import { Badge } from '../../shared/components/badge/badge';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Button } from '../../shared/components/button/button';
import { TransactionCategory, TransactionStatus } from '../../core/models/transaction.model';

const STATUS_VARIANT: Record<TransactionStatus, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

const CATEGORY_FILTERS: Array<{ label: string; value: TransactionCategory | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Food', value: 'food' },
  { label: 'Transport', value: 'transport' },
  { label: 'Subscriptions', value: 'subscription' },
  { label: 'Transfers', value: 'transfer' },
];

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    FormsModule,
    RouterLink,
    Card,
    Badge,
    Skeleton,
    EmptyState,
    Button,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsPage implements OnInit {
  private readonly transactionService = inject(TransactionService);

  protected readonly loading = this.transactionService.loading;
  protected readonly searchTerm = signal('');
  protected readonly activeCategory = signal<TransactionCategory | 'all'>('all');
  protected readonly categoryFilters = CATEGORY_FILTERS;
  protected readonly statusVariant = STATUS_VARIANT;
  protected readonly transactions = this.transactionService.transactions;

  protected readonly filteredTransactions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.activeCategory();

    return this.transactionService.transactions().filter((tx) => {
      const matchesCategory = category === 'all' || tx.category === category;
      const searchableText = [
        tx.merchant,
        tx.category,
        tx.accountName,
        tx.institutionName,
        tx.status,
      ].join(' ').toLowerCase();
      const matchesTerm = !term || searchableText.includes(term);
      return matchesCategory && matchesTerm;
    });
  });

  protected readonly totalOutflow = computed(() =>
    this.filteredTransactions()
      .filter((tx) => tx.direction === 'debit')
      .reduce((total, tx) => total + tx.amount, 0),
  );

  protected readonly totalInflow = computed(() =>
    this.filteredTransactions()
      .filter((tx) => tx.direction === 'credit')
      .reduce((total, tx) => total + tx.amount, 0),
  );

  ngOnInit(): void {
    this.refreshTransactions();
  }

  protected setCategory(category: TransactionCategory | 'all'): void {
    this.activeCategory.set(category);
  }

  protected refreshTransactions(): void {
    this.transactionService.loadTransactions(100).subscribe();
  }
}
