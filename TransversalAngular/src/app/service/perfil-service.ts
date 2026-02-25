import { inject, Injectable } from '@angular/core';
import { ClientesInterface } from '../interfaces/clientes-interface';
import { EmpleadoInterface } from '../interfaces/empleado-interface';
import { RolInterface } from '../interfaces/rol-interface';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  
  //Httpclient
  httpClient = inject(HttpClient);

  //Promise
  ClientePromise! : Promise <ClientesInterface>;

  EmpleadoPromise! : Promise <EmpleadoInterface>;
  

  //Rol y token
  rol! : RolInterface;
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



}
