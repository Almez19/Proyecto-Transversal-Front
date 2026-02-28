import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth-service';

/**
 * Si el backend responde 401/403, significa que el token no es válido/está expirado
 * o el usuario no tiene permisos. Para que "Mi perfil" (y el resto de pantallas)
 * no se queden en estados raros, cerramos sesión y llevamos a /login.
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          auth.logout();
          // Evita bucles si ya estamos en login
          if (!router.url.startsWith('/login')) {
            router.navigateByUrl('/login');
          }
        }
        // 403: normalmente es rol incorrecto, pero también conviene mandar al home
        if (err.status === 403) {
          if (!router.url.startsWith('/')) {
            router.navigateByUrl('/');
          }
        }
      }
      return throwError(() => err);
    })
  );
};
