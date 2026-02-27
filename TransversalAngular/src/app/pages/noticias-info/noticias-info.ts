import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NoticiasInterface } from '../../interfaces/noticias-interface';
import { NoticiasService } from '../../service/noticias-service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@Component({
  selector: 'app-noticias-info',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './noticias-info.html',
  styleUrl: './noticias-info.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class NoticiasInfo implements OnInit {

  noticia!: NoticiasInterface;

  noticiasService = inject(NoticiasService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {
      const id: string = params['id'];

      if (id) {
        const response = await this.noticiasService.getNoticiasById(id);
        if (response) {
          this.noticia = response;
          this.cdr.detectChanges();
        }
      }
    });
  }

}