import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Navbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  /**
   * Dual-purpose flag driven purely by CSS breakpoints in sidebar.scss:
   * on desktop it narrows the sidebar to an icon rail, on mobile the same
   * class instead slides the drawer into view. Starts closed on both.
   */
  protected readonly sidebarCollapsed = signal(false);

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  @HostListener('window:resize')
  protected onResize(): void {
    if (window.innerWidth >= 768) {
      this.sidebarCollapsed.set(false);
    }
  }
}
