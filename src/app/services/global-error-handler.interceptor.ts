import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorHandlerInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  return next(request).pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};