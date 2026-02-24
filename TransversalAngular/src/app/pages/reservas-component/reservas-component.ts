import { Component, inject } from '@angular/core';
import { ReservaInterface } from '../../interfaces/reserva-interface';
import { ReservasService } from '../../service/reservas-service';

@Component({
  selector: 'app-reservas-component',
  imports: [],
  templateUrl: './reservas-component.html',
  styleUrl: './reservas-component.css',
})
export class ReservasComponent {

  reservasService = inject (ReservasService);


  ngOnInit(): void {

   
    console.log(this.reservasService.getAllReservasById() );


  }
  

}
