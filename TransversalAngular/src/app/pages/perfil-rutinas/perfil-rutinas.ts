import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { CatalogoRutinasService, RutinaCatalogoInterface } from '../../service/catalogo-rutinas-service';
import { FavoritosService, RutinaPersonalizada } from '../../service/favoritos-service';
import { RutinasService } from '../../service/rutinas-service';
import { RutinaInterface } from '../../interfaces/rutina-interface';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-perfil-rutinas',
  imports: [RouterLink, TextoEnumPipe],
  templateUrl: './perfil-rutinas.html',
  styleUrl: './perfil-rutinas.css',
})
export class PerfilRutinasComponent implements OnInit, OnDestroy {
  private catalogoService = inject(CatalogoRutinasService);
  private favoritos = inject(FavoritosService);
  private rutinasService = inject(RutinasService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private sub?: Subscription;

  cargando = true;
  error = '';

  rutinasCatalogo: RutinaCatalogoInterface[] = [];
  rutinasPersonalizadas: RutinaPersonalizada[] = [];
  rutinasAsignadas: RutinaInterface[] = [];

  // Mapa normalizado(nombre) -> id de catálogo
  private catalogoPorNombre = new Map<string, string>();

  async ngOnInit(): Promise<void> {
    await this.cargarTodo();

    // Si vuelves desde /rutinas/crear o desde detalles, recargamos la parte local
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        // refrescar siempre que estemos dentro de /perfil/rutinas
        if (this.router.url.includes('/perfil/rutinas')) {
          this.rutinasPersonalizadas = this.favoritos.obtenerRutinasPersonalizadas();
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async cargarTodo(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const [catalogo, asignadas] = await Promise.all([
        this.catalogoService.getCatalogoRutinas(),
        this.rutinasService.getMisRutinas(),
      ]);

      // Construir mapa de nombres del catálogo para reutilizar el mismo detalle
      this.catalogoPorNombre.clear();
      for (const r of catalogo) {
        this.catalogoPorNombre.set(this.normalizar(r.nombre), r.id);
      }

      const idsGuardados = new Set(this.favoritos.obtenerRutinasCatalogoIds());
      this.rutinasCatalogo = catalogo.filter((r) => idsGuardados.has(r.id));
      this.rutinasPersonalizadas = this.favoritos.obtenerRutinasPersonalizadas();
      this.rutinasAsignadas = asignadas;
    } catch (error: any) {
      this.error = error?.message ?? 'No se pudo cargar Mis rutinas.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  quitarCatalogo(id: string): void {
    this.favoritos.quitarRutinaCatalogo(id);
    this.rutinasCatalogo = this.rutinasCatalogo.filter((r) => r.id !== id);
    this.cdr.detectChanges();
  }

  eliminarPersonalizada(id: string): void {
    this.favoritos.eliminarRutinaPersonalizada(id);
    this.rutinasPersonalizadas = this.rutinasPersonalizadas.filter((r) => r.id !== id);
    this.cdr.detectChanges();
  }

  /**
   * En "Rutinas asignadas por el entrenador" queremos abrir el MISMO detalle
   * que en la pestaña "Rutinas" (catálogo). Como los IDs de BD no coinciden
   * con los IDs del catálogo (assets), intentamos mapear por nombre.
   */
  linkDetalleAsignada(rutina: RutinaInterface): any[] {
    const idCatalogo = this.catalogoPorNombre.get(this.normalizar(rutina.nombre));
    if (idCatalogo) return ['/rutinas/catalogo', idCatalogo];
    // Fallback: si no existe en catálogo, mostramos detalle real (BD)
    return ['/rutinas/detalle', rutina.id];
  }

  private normalizar(txt: string): string {
    return (txt || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
