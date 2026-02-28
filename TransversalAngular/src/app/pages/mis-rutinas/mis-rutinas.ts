import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FavoritosService, RutinaPersonalizada } from '../../service/favoritos-service';
import { CatalogoRutinasService, RutinaCatalogoInterface } from '../../service/catalogo-rutinas-service';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-mis-rutinas',
  imports: [CommonModule, RouterLink, TextoEnumPipe],
  templateUrl: './mis-rutinas.html',
  styleUrl: './mis-rutinas.css',
})
export class MisRutinasComponent implements OnInit {
  private favoritos = inject(FavoritosService);
  private catalogoService = inject(CatalogoRutinasService);

  cargando = true;
  error = '';

  rutinasCatalogo: RutinaCatalogoInterface[] = [];
  rutinasPersonalizadas: RutinaPersonalizada[] = [];

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const [catalogo, personalizadas] = await Promise.all([
        this.catalogoService.getCatalogoRutinas(),
        Promise.resolve(this.favoritos.obtenerRutinasPersonalizadas()),
      ]);

      const ids = this.favoritos.obtenerRutinasCatalogoIds();
      this.rutinasCatalogo = catalogo.filter((r: RutinaCatalogoInterface) => ids.includes(r.id));
      this.rutinasPersonalizadas = personalizadas;
    } catch (e: any) {
      this.error = e?.message ?? 'No se pudieron cargar tus rutinas.';
      this.rutinasCatalogo = [];
      this.rutinasPersonalizadas = [];
    } finally {
      this.cargando = false;
    }
  }

  quitarCatalogo(id: string): void {
    this.favoritos.quitarRutinaCatalogo(id);
    this.rutinasCatalogo = this.rutinasCatalogo.filter((r) => r.id !== id);
  }

  borrarPersonalizada(id: string): void {
    this.favoritos.eliminarRutinaPersonalizada(id);
    this.rutinasPersonalizadas = this.rutinasPersonalizadas.filter((r) => r.id !== id);
  }
}
