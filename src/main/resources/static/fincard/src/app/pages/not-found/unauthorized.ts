import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-page">
      <h1>401</h1>
      <h2>Unauthorized</h2>
      <p>You don't have permission to view this page, or your session has expired.</p>
      <a routerLink="/login"><app-button>Go to Sign In</app-button></a>
    </div>
  `,
  styleUrl: './error-page.scss',
})
export class UnauthorizedPage {}
