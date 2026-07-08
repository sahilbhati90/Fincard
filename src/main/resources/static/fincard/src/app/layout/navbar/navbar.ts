import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { Avatar } from '../../shared/components/avatar/avatar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly theme = inject(ThemeService);
  protected readonly auth = inject(AuthService);

  readonly menuToggle = output<void>();

  protected toggleTheme(): void {
    this.theme.toggle();
  }
}
