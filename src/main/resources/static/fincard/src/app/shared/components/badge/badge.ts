import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge badge--{{ variant() }}"><ng-content /></span>`,
})
export class Badge {
  readonly variant = input<BadgeVariant>('neutral');
}
