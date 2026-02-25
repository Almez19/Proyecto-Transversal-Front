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
  gimnasioService = inject(GimnasioService);

  constructor(){
    this.gimnasioArr = [];
  }


async cargarGimnasios(): Promise<any> {

  try {
    const response = await this.gimnasioService.getAllGimnasios();
    this.gimnasioArr = response;
    return response;
    console.log(this.gimnasioArr);
  } catch (error) {
    alert("error al cargar los gimnasios");
  }
}

  async ngOnInit(): Promise<void>{
    await this.cargarGimnasios();
  }


}
