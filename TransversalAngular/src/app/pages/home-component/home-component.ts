import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NoticiasService } from '../../service/noticias-service';
import { NoticiasInterface } from '../../interfaces/noticias-interface';


@Component({
  selector: 'app-home-component',
  standalone: true,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLink],
})
export class HomeComponent {

  noticiasService = inject(NoticiasService);
  router = inject(Router);

  Noticias: NoticiasInterface[] = [];

  onActivate(component: any) {
  
    this.cargarNoticias();
  
  }


  ngOnInit(): void {

    this.cargarNoticias();


  }

  cargarNoticias() {
    console.log('Cargando noticias...');
    this.noticiasService.getUltimasNoticias().then(noticias => {
      this.Noticias = noticias;
    });
  }
}

