import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginInterface } from '../interfaces/login-interface';
import { RolInterface } from '../interfaces/rol-interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  
  public isLoggedIn :boolean = false;
  public rol! : RolInterface;


  private httpClient = inject(HttpClient);
  private baseURL : string = "http://localhost:8080/api/login";

  public login (credentials:{email: string, contrasena : string}) : Observable<LoginInterface>{

    console.log("EStoy aqui 3")

    return this.httpClient.post<LoginInterface>(this.baseURL, credentials)
    .pipe(
      tap( response =>{

      localStorage.setItem('token', response.token)
      this.obtenerRol();

    })
  )

  }

    private obtenerRol (){

    this.httpClient.post<RolInterface>(this.baseURL + "/rol", localStorage.getItem("token"))
    .pipe(
      tap(response => {

       this.rol.rol= response.rol;


      })
    );

  }



  
  



}
