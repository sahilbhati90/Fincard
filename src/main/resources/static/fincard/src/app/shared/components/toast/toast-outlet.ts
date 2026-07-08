import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.variant }} animate-in">
          <span>{{ toast.text }}</span>
          <button
            type="button"
            class="toast__close"
            aria-label="Dismiss notification"
            (click)="toastService.dismiss(toast.id)"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-width: 360px;
    }
    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      font-size: 13px;
      font-weight: 500;
      color: var(--text);
    }
    .toast--success { border-left: 3px solid var(--success); }
    .toast--danger { border-left: 3px solid var(--danger); }
    .toast--warning { border-left: 3px solid var(--warning); }
    .toast--info { border-left: 3px solid var(--info); }
    .toast__close {
      background: none;
      border: none;
      color: var(--muted);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
  `],
})
export class ToastOutlet {
  protected readonly toastService = inject(ToastService);
}
