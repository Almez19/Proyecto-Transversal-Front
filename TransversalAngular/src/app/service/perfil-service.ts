<<<<<<< HEAD
import { inject, Injectable } from '@angular/core';
import { ClientesInterface } from '../interfaces/clientes-interface';
import { EmpleadoInterface } from '../interfaces/empleado-interface';
import { RolInterface } from '../interfaces/rol-interface';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login-service';

=======
import { Injectable } from '@angular/core';
import { ClientesInterface } from '../interfaces/clientes-interface';
import { EmpleadoInterface } from '../interfaces/empleado-interface';
>>>>>>> e461b7fde3e29b222bbc8a558fcc3366eba219d8


@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  
<<<<<<< HEAD
  //Servicios
  httpClient = inject(HttpClient);
  loginService = inject(LoginService);

  //Promise
=======
>>>>>>> e461b7fde3e29b222bbc8a558fcc3366eba219d8
  ClientePromise! : Promise <ClientesInterface>;

  EmpleadoPromise! : Promise <EmpleadoInterface>;
  

<<<<<<< HEAD
  //Rol y token
  rol : RolInterface = ;
  token! : string;

  //Url base de la api
  private baseURL : string = "http://localhost:8080/api/";

   

  //Guarda el token y obtiene el rol
  public constructor (){

    this.token = localStorage.getItem("token") ?? "" ;
    
    this.rol.rol = localStorage.getItem("rol");

  }



 /*
  public getPerfilPorToken () : Observable<any>{

    

    //if (){}

    return this.httpClient.post<LoginInterface>(this.baseURL, credentials)
        .pipe(
          tap( response =>{
    
          localStorage.setItem('token', response.token)
            console.log("EStoy aqui 2")
    
        })
      )

  }*/


=======
>>>>>>> e461b7fde3e29b222bbc8a558fcc3366eba219d8

}
