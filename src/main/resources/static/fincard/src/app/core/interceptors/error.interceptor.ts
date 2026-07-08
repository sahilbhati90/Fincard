import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/** Centralized HTTP error handling: auth expiry, and user-facing toasts. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout().subscribe();
        router.navigate(['/login']);
      } else if (error.status === 0) {
        toast.show('Network error. Please check your connection.', 'danger');
      } else if (error.status >= 500) {
        toast.show('Something went wrong on our end. Please try again.', 'danger');
        router.navigate(['/error/500']);
      }
      return throwError(() => error);
    }),
  );
};
