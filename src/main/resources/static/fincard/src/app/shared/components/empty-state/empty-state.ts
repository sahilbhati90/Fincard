import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <i class="bx {{ icon() }}" aria-hidden="true"></i>
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      <ng-content />
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-2);
      padding: var(--space-12) var(--space-6);
      color: var(--text-secondary);
    }
    .empty i { font-size: 40px; color: var(--muted); margin-bottom: var(--space-2); }
    .empty h3 { font-size: 16px; color: var(--text); }
    .empty p { font-size: 13px; max-width: 320px; }
  `],
})
export class EmptyState {
  readonly icon = input('bx-inbox');
  readonly title = input('Nothing here yet');
  readonly description = input('');
}
