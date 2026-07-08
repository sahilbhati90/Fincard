import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-page">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <a routerLink="/dashboard"><app-button>Back to Dashboard</app-button></a>
    </div>
  `,
  styleUrl: './error-page.scss',
})
export class NotFoundPage {}
