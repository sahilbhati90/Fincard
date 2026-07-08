import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

/**
 * Reusable button primitive wrapping the global .btn CSS classes so
 * every screen gets consistent sizing, states and focus rings for free.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      class="btn"
      [class.btn--primary]="variant() === 'primary'"
      [class.btn--secondary]="variant() === 'secondary'"
      [class.btn--ghost]="variant() === 'ghost'"
      [class.btn--danger]="variant() === 'danger'"
      [class.btn--sm]="size() === 'sm'"
      [class.btn--block]="block()"
      [disabled]="disabled() || loading()"
    >
      @if (loading()) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    .spinner {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly block = input(false);
}
