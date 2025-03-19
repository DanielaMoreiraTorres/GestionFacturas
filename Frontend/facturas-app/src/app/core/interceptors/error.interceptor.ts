import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      let error = err?.error?.errors || err?.error?.message || err.message;
      if (Array.isArray(error) && error.length === 1) {
        error = error[0]; // Extrae el texto si es un array de un solo elemento
      }
      console.error('errorInterceptor', err);
      return throwError(() => error);
    })
  );
};
