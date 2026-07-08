import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';

interface DashboardSummaryResponse {
  totalBanks: number;
  totalBalance: number;
  totalBalanceFormatted: string;
  userName?: string;
}

export interface DashboardSummary {
  totalBanks: number;
  totalBalance: number;
  totalBalanceFormatted: string;
  userName: string;
  currency: string;
  changeVsLastMonth: number;
}

const EMPTY_SUMMARY: DashboardSummary = {
  totalBanks: 0,
  totalBalance: 0,
  totalBalanceFormatted: '0.00',
  userName: '',
  currency: 'USD',
  changeVsLastMonth: 0,
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  private readonly summarySignal = signal<DashboardSummary>(EMPTY_SUMMARY);
  private readonly loadingSignal = signal(false);

  readonly summary = this.summarySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly hasConnectedBanks = computed(() => this.summarySignal().totalBanks > 0);

  loadSummary(): Observable<DashboardSummaryResponse> {
    this.loadingSignal.set(true);
    return this.http.get<DashboardSummaryResponse>('/api/dashboard/summary').pipe(
      tap((summary) => {
        this.summarySignal.set({
          totalBanks: summary.totalBanks,
          totalBalance: summary.totalBalance,
          totalBalanceFormatted: summary.totalBalanceFormatted,
          userName: summary.userName ?? '',
          currency: 'USD',
          changeVsLastMonth: 0,
        });
      }),
      finalize(() => this.loadingSignal.set(false)),
    );
  }
}
