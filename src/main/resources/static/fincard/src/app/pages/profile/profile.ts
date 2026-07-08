import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ToastService } from '../../core/services/toast.service';
import { Card } from '../../shared/components/card/card';
import { Avatar } from '../../shared/components/avatar/avatar';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, TitleCasePipe, Card, Avatar, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly dashboardService = inject(DashboardService);
  private readonly toast = inject(ToastService);

  protected readonly saving = signal(false);
  protected readonly summary = this.dashboardService.summary;
  protected readonly summaryLoading = this.dashboardService.loading;
  protected readonly userInitials = computed(() => this.auth.user()?.fullName ?? 'User');

  protected readonly form = this.fb.nonNullable.group({
    fullName: [this.auth.user()?.fullName ?? '', Validators.required],
    email: [{ value: this.auth.user()?.email ?? '', disabled: true }, [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    const user = this.auth.user();
    if (user) {
      this.form.patchValue({
        fullName: user.fullName,
        email: user.email,
      });
    }

    this.dashboardService.loadSummary().subscribe();
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.auth.updateCurrentUser({
      fullName: this.form.controls.fullName.value.trim(),
    });
    this.saving.set(false);
    this.toast.show('Profile updated for this session.', 'success');
  }
}
