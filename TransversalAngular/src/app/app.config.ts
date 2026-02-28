import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { authErrorInterceptor } from './interceptors/auth-error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // 1) añade Authorization
    // 2) si el token es inválido/expirado, cierra sesión y redirige a /login
    provideHttpClient(withInterceptors([authInterceptor, authErrorInterceptor]))
  ]
};
