import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="card"
      [class.card--interactive]="interactive()"
      [class.card--pad-sm]="padding() === 'sm'"
      [class.card--pad-none]="padding() === 'none'"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: var(--space-6);
      overflow: hidden;
      transition: box-shadow 200ms var(--ease-standard), transform 200ms var(--ease-standard);
    }
    .card--pad-sm { padding: var(--space-4); }
    .card--pad-none { padding: 0; }
    .card--interactive:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
  `],
})
export class Card {
  readonly interactive = input(false);
  readonly padding = input<'sm' | 'md' | 'none'>('md');
}
