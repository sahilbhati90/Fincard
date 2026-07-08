import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="name() + ' avatar'" class="avatar" [style.width.px]="size()" [style.height.px]="size()" />
    } @else {
      <span class="avatar avatar--fallback" [style.width.px]="size()" [style.height.px]="size()">{{ initials() }}</span>
    }
  `,
  styles: [`
    .avatar {
      border-radius: var(--radius-full);
      object-fit: cover;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .avatar--fallback {
      background: var(--primary-subtle);
      color: var(--primary);
      font-weight: 700;
      font-size: 13px;
    }
  `],
})
export class Avatar {
  readonly src = input<string | undefined>(undefined);
  readonly name = input('User');
  readonly size = input(40);

  readonly initials = computed(() =>
    this.name()
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );
}
