import { Component, inject } from '@angular/core';
import { Igimnasio } from '../../interfaces/igimnasio';
import { GimnasioService } from '../../service/gimnasio-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GimnasioViewComponent } from '../../components/gimnasio-view-component/gimnasio-view-component';

@Component({
  selector: 'app-gimnasios-list',
  imports: [FormsModule, CommonModule, GimnasioViewComponent],
  templateUrl: './gimnasios-list.html',
  styleUrl: './gimnasios-list.css',
})
export class GimnasiosList {

  gimnasioArr: Igimnasio[];
  gimnasioService = inject(GimnasioService);

  constructor(){
    this.gimnasioArr = [];
  }


  async cargarGimnasios(): Promise<any> {

    try {
      const response = await this.gimnasioService.getAllGimnasios();

      return response;
    }catch (error){

      alert("error al cargar los gimnasios")

    }

  }


}
