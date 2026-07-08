import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { ToastService } from './services/toast.service';

/** Catches uncaught runtime errors app-wide and surfaces a friendly toast. */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    console.error('[GlobalErrorHandler]', error);
    this.zone.run(() =>
      this.toast.show('An unexpected error occurred. Our team has been notified.', 'danger'),
    );
  }
}
