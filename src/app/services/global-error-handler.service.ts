import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const snackBar = this.injector.get(MatSnackBar);
    const router = this.injector.get(Router);
    const authService = this.injector.get(AuthService);

    if (error instanceof HttpErrorResponse) {
        this.handleHttpError(error, snackBar, router, authService);
    } else {
        this.handleClientError(error, snackBar);
    }

    console.debug('Произошла ошибка:', error);
  }

  private handleHttpError(
    error: HttpErrorResponse,
    snackBar: MatSnackBar,
    router: Router,
    authService: AuthService
  ): void {
    console.info(error.status);
    switch (error.status) {
        case 0:
            this.showSnackbar(snackBar, error.error || 'Не удалось подключиться к серверу. Проверьте интернет или попробуйте позже.');
            break;
        case 400:
            this.showSnackbar(snackBar, error.error || 'Некорректный запрос');
            break;
        case 401:
            this.showSnackbar(snackBar, error.error || 'Не аутентифицирован. Войдите в аккаунт');
            authService.logout();
            break;
        case 403:
            this.showSnackbar(snackBar, error.error || 'Нет доступа');
            break;
        case 404:
            this.showSnackbar(snackBar, error.error || 'Ресурс не найден');
            break;
        case 500:
            this.showSnackbar(snackBar, error.error || 'Ошибка сервера. Попробуйте позже');
            break;
        case 503:
            this.showSnackbar(snackBar, error.error || 'Сервис временно недоступен');
            break;
        default:
            this.showSnackbar(snackBar, error.message || 'Произошла ошибка');
    }
  }

  private handleClientError(error: any, snackBar: MatSnackBar): void {
    this.showSnackbar(snackBar, 'Произошла ошибка в приложении');
    console.error(error);
  }

  private showSnackbar(snackBar: MatSnackBar, message: string): void {
    snackBar.open(message, 'Закрыть', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
