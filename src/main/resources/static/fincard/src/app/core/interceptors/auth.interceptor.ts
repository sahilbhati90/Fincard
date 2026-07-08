import { HttpInterceptorFn } from '@angular/common/http';

/** Ensures the session cookie (JSESSIONID) is sent with every request. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};