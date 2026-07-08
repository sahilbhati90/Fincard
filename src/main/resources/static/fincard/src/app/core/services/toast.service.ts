import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  variant: 'success' | 'danger' | 'info' | 'warning';
}

let nextId = 0;

/**
 * Global toast notification queue, rendered once by <app-toast-outlet>
 * in the root shell. Any component/service can inject and push.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(text: string, variant: ToastMessage['variant'] = 'info', duration = 3500): void {
    const toast: ToastMessage = { id: nextId++, text, variant };
    this.toastsSignal.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number): void {
    this.toastsSignal.update((list) => list.filter((t) => t.id !== id));
  }
}
