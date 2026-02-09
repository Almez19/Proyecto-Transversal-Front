import { Component, inject } from '@angular/core';
import { NoticiasService } from '../../service/noticias-service';
import { NoticiasInterface } from '../../interfaces/noticias-interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-component',
  imports: [RouterLink],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {

  noticiasService = inject(NoticiasService);

  Noticias : NoticiasInterface[] = [];

  ngOnInit(): void {

    this.noticiasService.getUltimasNoticias().then(noticias => {

      this.Noticias = noticias;

      console.log(this.Noticias);

    });

    

  }
 

}
