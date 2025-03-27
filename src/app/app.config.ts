import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection  } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/AuthInterceptor';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { errorHandlerInterceptor } from './services/global-error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorHandlerInterceptor])
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
