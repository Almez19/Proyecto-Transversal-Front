import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CatalogoRutinasService, RutinaCatalogoInterface } from '../../service/catalogo-rutinas-service';
import { AuthService } from '../../service/auth-service';
import { FavoritosService } from '../../service/favoritos-service';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-rutinas-catalogo',
  standalone: true,
  imports: [FormsModule, RouterLink, TextoEnumPipe],
  templateUrl: './rutinas-catalogo.html',
  styleUrl: './rutinas-catalogo.css',
})
export class RutinasCatalogoComponent implements OnInit {
  private catalogoService = inject(CatalogoRutinasService);
  private auth = inject(AuthService);
  private favoritos = inject(FavoritosService);
  private router = inject(Router);

  cargando = true;
  error = '';

  catalogo: RutinaCatalogoInterface[] = [];

  filtroTexto = '';
  filtroObjetivo = '';
  filtroNivel = '';

  get estaLogueado(): boolean {
    return this.auth.estaLogueado();
  }

  async ngOnInit(): Promise<void> {
    await this.cargarCatalogo();
  }

  async cargarCatalogo(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      this.catalogo = await this.catalogoService.getCatalogoRutinas();
    } catch (error: any) {
      this.error = error?.message ?? 'No se pudo cargar el catálogo de rutinas.';
    } finally {
      this.cargando = false;
    }
  }

  get rutinasFiltradas(): RutinaCatalogoInterface[] {
    const texto = this.filtroTexto.trim().toLowerCase();
    return this.catalogo
      .filter((rutina) => {
        if (!this.filtroObjetivo) return true;
        return rutina.objetivo === this.filtroObjetivo;
      })
      .filter((rutina) => {
        if (!this.filtroNivel) return true;
        return rutina.nivel === this.filtroNivel;
      })
      .filter((rutina) => {
        if (!texto) return true;
        return (
          rutina.nombre.toLowerCase().includes(texto) ||
          rutina.descripcion.toLowerCase().includes(texto)
        );
      });
  }

  esRutinaGuardada(id: string): boolean {
    return this.favoritos.esRutinaCatalogoGuardada(id);
  }

  guardarRutina(id: string): void {
    if (!this.estaLogueado) {
      this.router.navigate(['/login']);
      return;
    }
    this.favoritos.guardarRutinaCatalogo(id);
  }

  quitarRutina(id: string): void {
    this.favoritos.quitarRutinaCatalogo(id);
  }
}
