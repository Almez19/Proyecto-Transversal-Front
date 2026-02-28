import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Igimnasio } from '../../interfaces/igimnasio';
import { CommonModule } from '@angular/common';
import { FavoritosService } from '../../service/favoritos-service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-gimnasio-view-component',
  imports: [RouterModule, CommonModule],
  templateUrl: './gimnasio-view-component.html',
  styleUrl: './gimnasio-view-component.css',
})
export class GimnasioViewComponent {

  private favoritosService = inject(FavoritosService);
  private authService = inject(AuthService);
  router = inject(Router);
  @Input() gimnasio!: Igimnasio;

  get estaLogueado(): boolean {
    return this.authService.estaLogueado();
  }

  get guardado(): boolean {
    return this.favoritosService.esGimnasioGuardado(this.gimnasio.id);
  }

  alternarGuardar(evento: MouseEvent): void {
    evento.preventDefault();
    evento.stopPropagation();

    if (!this.estaLogueado) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.guardado) this.favoritosService.quitarGimnasio(this.gimnasio.id);
    else this.favoritosService.guardarGimnasio(this.gimnasio.id);
  }


}
