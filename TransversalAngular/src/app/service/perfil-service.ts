import { inject, Injectable } from '@angular/core';
import { ClientesInterface } from '../interfaces/clientes-interface';
import { EmpleadoInterface } from '../interfaces/empleado-interface';
import { RolInterface } from '../interfaces/rol-interface';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login-service';



@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  
  //Servicios
  httpClient = inject(HttpClient);
  loginService = inject(LoginService);

  //Promise
  Cliente! : ClientesInterface;

  Empleado! : EmpleadoInterface;
  

  //Rol y token
  rol : RolInterface = this.loginService.rol;
  token! : string;

  //Url base de la api
  private baseURL : string = "http://localhost:8080/api/";

   

  //Guarda el token y obtiene el rol
  public constructor (){

    this.token = localStorage.getItem("token") ?? "" ;

  }



 
  public getPerfilPorToken () : Observable<any>{

    

    if (this.rol.rol === "CLIENTE"){

      return this.httpClient.post<ClientesInterface>(this.baseURL + "clientes/getportoken", this.token)
            .pipe(
              tap( response =>{
        
             this.Cliente = response;
        
            })
          )

    }else {

            return this.httpClient.post<EmpleadoInterface>(this.baseURL + "usuarios/getportoken", this.token)
            .pipe(
              tap( response =>{
        
                this.Empleado = response;
        
            })
          )

    }

  }



}
