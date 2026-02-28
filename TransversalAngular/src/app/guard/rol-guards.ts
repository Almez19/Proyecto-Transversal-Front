import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth-service';

export const clienteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaLogueado()) {
    return router.parseUrl('/login');
  }
  if (!authService.esCliente()) {
    return router.parseUrl('/');
  }
  return true;
};

export const staffGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaLogueado()) {
    return router.parseUrl('/login');
  }
  if (!authService.esStaff()) {
    return router.parseUrl('/');
  }
  return true;
};
