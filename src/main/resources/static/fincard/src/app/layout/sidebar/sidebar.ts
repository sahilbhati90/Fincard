import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly collapsed = input(false);
  readonly collapseToggle = output<void>();

  protected readonly primaryNav: NavItem[] = [
    { label: 'Dashboard', icon: 'bxs-dashboard', route: '/dashboard' },
    { label: 'My Banks', icon: 'bxs-bank', route: '/my-banks' },
    { label: 'Transactions', icon: 'bxs-receipt', route: '/transactions' },
    { label: 'Transfer Funds', icon: 'bxs-send', route: '/transfer' },
  ];

  protected readonly secondaryNav: NavItem[] = [
    { label: 'Settings', icon: 'bxs-cog', route: '/settings' },
  ];
}
