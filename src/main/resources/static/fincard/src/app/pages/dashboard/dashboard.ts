import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { Card } from '../../shared/components/card/card';
import { Badge } from '../../shared/components/badge/badge';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Button } from '../../shared/components/button/button';
import { TransactionStatus } from '../../core/models/transaction.model';

const STATUS_VARIANT: Record<TransactionStatus, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, Card, Badge, Skeleton, EmptyState, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionService = inject(TransactionService);
  protected readonly auth = inject(AuthService);

  protected readonly summary = this.dashboardService.summary;
  protected readonly summaryLoading = this.dashboardService.loading;
  protected readonly transactionsLoading = this.transactionService.loading;

  protected readonly recentTransactions = computed(() =>
    this.transactionService.transactions().slice(0, 6),
  );

  protected readonly statusVariant = STATUS_VARIANT;

  ngOnInit(): void {
    this.dashboardService.loadSummary().subscribe();
    this.refreshTransactions();
  }

  protected refreshTransactions(): void {
    this.transactionService.loadTransactions().subscribe();
  }
}
