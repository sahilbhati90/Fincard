import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-page">
      <h1>500</h1>
      <h2>Something went wrong</h2>
      <p>An unexpected error occurred on our end. Please try again shortly.</p>
      <a routerLink="/dashboard"><app-button>Back to Dashboard</app-button></a>
    </div>
  `,
  styleUrl: './error-page.scss',
})
export class ServerErrorPage {}
