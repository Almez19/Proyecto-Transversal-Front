import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritosService } from '../../service/favoritos-service';
import { GimnasioService } from '../../service/gimnasio-service';
import { Igimnasio } from '../../interfaces/igimnasio';

@Component({
  selector: 'app-perfil-gimnasios',
  imports: [RouterLink],
  templateUrl: './perfil-gimnasios.html',
  styleUrl: './perfil-gimnasios.css',
})
export class PerfilGimnasiosComponent implements OnInit {
  private favoritos = inject(FavoritosService);
  private gimnasioService = inject(GimnasioService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';
  gimnasios: Igimnasio[] = [];

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const ids = this.favoritos.obtenerMisGimnasiosIds();
      if (ids.length === 0) {
        this.gimnasios = [];
        return;
      }
      const gyms = await Promise.all(ids.map((id) => this.gimnasioService.getGimnasioById(id)));
      this.gimnasios = gyms.filter(Boolean) as Igimnasio[];
    } catch (error: any) {
      this.error = error?.message ?? 'No se pudieron cargar tus gimnasios guardados.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  quitar(id: string): void {
    this.favoritos.quitarGimnasio(id);
    this.gimnasios = this.gimnasios.filter((g) => g.id !== id);
  }
}
