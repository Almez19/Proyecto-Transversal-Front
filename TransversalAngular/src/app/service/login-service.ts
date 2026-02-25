import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginInterface } from '../interfaces/login-interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  
  public isLoggedIn :boolean = false;

  private httpClient = inject(HttpClient);
  private baseURL : string = "http://localhost:8080/api/login";

  public login (credentials:{email: string, contrasena : string}) : Observable<LoginInterface>{

    return this.httpClient.post<LoginInterface>(this.baseURL, credentials)
    .pipe(
      tap( response =>{

      localStorage.setItem('token', response.token)

    })
  )

  }

}
