import { Component, inject, OnInit } from '@angular/core';
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
export class GimnasiosList implements OnInit {

  gimnasioArr: Igimnasio[];
  gimnasioFiltradoArr: Igimnasio[];

  gimnasioService = inject(GimnasioService);

  searchText: string = '';
  soloAbiertos: boolean = false;
  soloCerrados: boolean = false;

  constructor(){
    this.gimnasioArr = [];
    this.gimnasioFiltradoArr = [];
  }

  async cargarGimnasios(): Promise<any> {

    try {
      const response = await this.gimnasioService.getAllGimnasios();
      this.gimnasioArr = response;
      this.gimnasioFiltradoArr = response;
      return response;
    } catch (error) {
      alert("error al cargar los gimnasios");
    }
  }

  //MÉTODO FILTRO
  async filtrarGimnasios(): Promise<void> {

    this.gimnasioFiltradoArr = this.gimnasioArr.filter(g => {

      const coincideTexto =
        g.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        g.ciudad.toLowerCase().includes(this.searchText.toLowerCase());

      let coincideEstado = true;

      if (this.soloAbiertos) {
        coincideEstado = g.estado === true;
      }

      if (this.soloCerrados) {
        coincideEstado = g.estado === false;
      }

      return coincideTexto && coincideEstado;

    });

  }

  async ngOnInit(): Promise<void>{
    await this.cargarGimnasios();
  }

}


