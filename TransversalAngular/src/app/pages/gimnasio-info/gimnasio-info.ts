import { Component, inject } from '@angular/core';
import { Igimnasio } from '../../interfaces/igimnasio';
import { GimnasioService } from '../../service/gimnasio-service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gimnasio-info',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './gimnasio-info.html',
  styleUrl: './gimnasio-info.css',
})
export class GimnasioInfo {

  gimnasio !: Igimnasio;
  gimnasioService = inject(GimnasioService);
  activatedRoute = inject(ActivatedRoute);

  constructor(){}

  ngOnInit(): void{
    this.activatedRoute.params.subscribe(async (params: any) =>{
      let id: string = params.id;

      if(id != undefined){
        let response = await this.gimnasioService.getGimnasioById(id);
        if(response != undefined){
          this.gimnasio = response;
        }
      }
    })
  }

}
