import { Injectable } from '@angular/core';
import { ClientesInterface } from '../interfaces/clientes-interface';
import { EmpleadoInterface } from '../interfaces/empleado-interface';


@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  
  ClientePromise! : Promise <ClientesInterface>;

  EmpleadoPromise! : Promise <EmpleadoInterface>;
  


}
