import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="skeleton" [style.width]="width()" [style.height]="height()" aria-hidden="true"></div>`,
})
export class Skeleton {
  readonly width = input('100%');
  readonly height = input('16px');
}
