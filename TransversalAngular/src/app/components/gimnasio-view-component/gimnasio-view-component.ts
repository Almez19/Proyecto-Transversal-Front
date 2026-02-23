import { Component, inject, Input} from '@angular/core';
import { Router, RouterModule,} from '@angular/router';
import {GimnasioService} from '../../service/gimnasio-service'
import { Igimnasio } from '../../interfaces/igimnasio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gimnasio-view-component',
  imports: [RouterModule, CommonModule],
  templateUrl: './gimnasio-view-component.html',
  styleUrl: './gimnasio-view-component.css',
})
export class GimnasioViewComponent {

  sGimnasio = inject(GimnasioService);
  router = inject(Router);
  @Input() gimnasio !: Igimnasio;


}
