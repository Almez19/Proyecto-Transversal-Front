import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginInterface } from '../interfaces/login-interface';
import { API_URL } from '../config/api';
import { AuthService } from './auth-service';
import { FavoritosService } from './favoritos-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private favoritos = inject(FavoritosService);
  private baseURL : string = `${API_URL}/login`;

  public login (credentials:{email: string, contrasena : string}) : Observable<LoginInterface>{

    return this.httpClient.post<LoginInterface>(this.baseURL, credentials)
    .pipe(
      tap( response =>{

      this.authService.setToken(response.token);
      // Migramos favoritos guardados como 'anonimo' a la cuenta real
      this.favoritos.migrarDesdeAnonimo();

    })
  )

  }

}
