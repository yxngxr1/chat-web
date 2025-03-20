// auth.interceptor.ts
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const storage = inject(StorageService);
  const token = storage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  request = request.clone({
    setHeaders: headers
  });

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.log('Не аутентифицирован');
        
      }
      if (error.status === 403) {
        console.log('Нет доступа');
      }
      return throwError(() => error);
    })
  );
};
