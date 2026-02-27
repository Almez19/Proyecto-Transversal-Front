import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Igimnasio } from '../../interfaces/igimnasio';
import { GimnasioService } from '../../service/gimnasio-service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gimnasio-info',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './gimnasio-info.html',
  styleUrl: './gimnasio-info.css',
})
export class GimnasioInfo implements OnInit {

  gimnasio!: Igimnasio;

  gimnasioService = inject(GimnasioService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {
      const id: string = params['id'];

      if (id) {
        const response = await this.gimnasioService.getGimnasioById(id);
        if (response) {
          this.gimnasio = response;
          this.cdr.detectChanges(); 
        }
      }
    });
  }

}