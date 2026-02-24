import { inject, Injectable } from '@angular/core';
import { ReservaInterface } from '../interfaces/reserva-interface';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  
  httpClient = inject(HttpClient);
  baseURL = "http://localhost:8080/api/reservas";


  private reservasPromise!: Promise<ReservaInterface[]>;

  constructor(){

    this.cargarReservas();

  }

  private cargarReservas(){

    this.reservasPromise = lastValueFrom(
          this.httpClient.get<ReservaInterface[]>(this.baseURL + "?clienteId="+ "b1b1b1b1-bbbb-bbbb-bbbb-bbbbbbbbbbb1")
        );
        //id de un cliente de prueba
    
  }

  public getAllReservasById () : Promise<ReservaInterface[]>{


    return this.reservasPromise;

  }

  public NuevaReserva (reserva : ReservaInterface){

    

  }



}
