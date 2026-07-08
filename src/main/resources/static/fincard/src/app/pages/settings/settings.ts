import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Card } from '../../shared/components/card/card';
import { Button } from '../../shared/components/button/button';

interface ToggleSetting {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

const NOTIFICATION_SETTINGS_KEY = 'fincard.notification-settings';
const DEFAULT_NOTIFICATION_SETTINGS: ToggleSetting[] = [
  { key: 'transactions', label: 'Transaction alerts', description: 'Get notified for every new transaction.', enabled: true },
  { key: 'weekly', label: 'Weekly summary', description: 'A digest of your spending every Monday.', enabled: true },
  { key: 'security', label: 'Security alerts', description: 'Sign-in attempts and account changes.', enabled: true },
  { key: 'marketing', label: 'Product updates', description: 'News about new Fincard features.', enabled: false },
];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [Card, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsPage {
  protected readonly theme = inject(ThemeService);
  protected readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  protected readonly signingOut = signal(false);

  protected readonly themeOptions: Array<{ value: ThemeMode; label: string; icon: string }> = [
    { value: 'light', label: 'Light', icon: 'bx-sun' },
    { value: 'dark', label: 'Dark', icon: 'bx-moon' },
    { value: 'system', label: 'System', icon: 'bx-desktop' },
  ];

  protected readonly notificationSettings = signal<ToggleSetting[]>(this.restoreNotificationSettings());

  protected toggleSetting(key: string): void {
    this.notificationSettings.update((settings) =>
      settings.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)),
    );
    this.persistNotificationSettings();
  }

  protected setTheme(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }

  protected logout(): void {
    this.toast.show('Signing you out...', 'info');
    this.signingOut.set(true);
    this.auth
      .logout()
      .pipe(finalize(() => this.signingOut.set(false)))
      .subscribe();
  }

  private restoreNotificationSettings(): ToggleSetting[] {
    const raw = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;

    try {
      const saved = JSON.parse(raw) as Record<string, boolean>;
      return DEFAULT_NOTIFICATION_SETTINGS.map((setting) => ({
        ...setting,
        enabled: saved[setting.key] ?? setting.enabled,
      }));
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  }

  private persistNotificationSettings(): void {
    const values = this.notificationSettings().reduce<Record<string, boolean>>((saved, setting) => {
      saved[setting.key] = setting.enabled;
      return saved;
    }, {});
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(values));
  }
}
