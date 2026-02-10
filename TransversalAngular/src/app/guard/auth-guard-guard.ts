import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../service/login-service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  
    const authService = inject(LoginService);
    const router = inject(Router);

    
 if (authService.isLoggedIn) {
    return true; // permite acceder a la ruta
  } else {
    router.navigate(['/login']); // redirige si es falso
    return false; // bloquea la ruta
  }





};


