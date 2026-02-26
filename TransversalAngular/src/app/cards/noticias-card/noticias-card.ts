import { Component, inject, Input } from '@angular/core';
import { NoticiasService } from '../../service/noticias-service';
import { Router, RouterModule } from '@angular/router';
import { Igimnasio } from '../../interfaces/igimnasio';
import { CommonModule } from '@angular/common';
import { NoticiasInterface } from '../../interfaces/noticias-interface';

@Component({
  selector: 'app-noticias-card',
  imports: [RouterModule, CommonModule],
  templateUrl: './noticias-card.html',
  styleUrl: './noticias-card.css',
})
export class NoticiasCard {

  sNoticias = inject(NoticiasService);
  router = inject(Router);
  @Input() noticias !: NoticiasInterface;

}
