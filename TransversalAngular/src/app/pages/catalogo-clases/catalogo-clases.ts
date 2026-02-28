import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClasesService } from '../../service/clases-service';
import { CatalogoClaseInterface } from '../../interfaces/clase-interface';

@Component({
  selector: 'app-catalogo-clases',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo-clases.html',
  styleUrl: './catalogo-clases.css',
})
export class CatalogoClases {
  private clasesService = inject(ClasesService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';
  catalogo: CatalogoClaseInterface[] = [];

  filtroTexto = '';
  filtroNivel: '' | 'principiante' | 'intermedio' | 'avanzado' = '';

  get catalogoFiltrado(): CatalogoClaseInterface[] {
    const texto = this.filtroTexto.trim().toLowerCase();

    return this.catalogo
      .filter((c) => (this.filtroNivel ? c.nivelRecomendado === this.filtroNivel : true))
      .filter((c) => (texto ? (c.nombre + ' ' + c.descripcion).toLowerCase().includes(texto) : true));
  }

  async ngOnInit(): Promise<void> {
    try {
      this.catalogo = await this.clasesService.getCatalogoPublico();
      // Forzamos refresco tras carga async (igual que en Gimnasios/Noticias)
      // para evitar que la vista se quede vacía hasta el primer cambio de filtro.
      this.cdr.detectChanges();
    } catch (error) {
      console.error(error);
      this.error = 'No se pudo cargar el catálogo.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  imagenClase(c: CatalogoClaseInterface): string {
    if (c.urlImagen) return c.urlImagen;
    const slug = (c.nombre || '').toLowerCase().replace(/\s+/g, '-');
    return `/assets/clases/${slug}.svg`;
  }
}
