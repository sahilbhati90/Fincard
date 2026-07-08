import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { ToastOutlet } from './shared/components/toast/toast-outlet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastOutlet],
  template: `
    <router-outlet />
    <app-toast-outlet />
  `,
})
export class App {
  /** Instantiating ThemeService here activates the theme effect at app bootstrap. */
  private readonly theme = inject(ThemeService);
}
