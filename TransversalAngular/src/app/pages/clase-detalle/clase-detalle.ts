import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CatalogoClaseInterface } from '../../interfaces/clase-interface';
import { ClasesService } from '../../service/clases-service';
import { InfoClasesService, InfoClase } from '../../service/info-clases-service';

@Component({
  selector: 'app-clase-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clase-detalle.html',
  styleUrl: './clase-detalle.css',
})
export class ClaseDetalleComponent {
  private route = inject(ActivatedRoute);
  private clasesService = inject(ClasesService);
  private infoService = inject(InfoClasesService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';

  clase: CatalogoClaseInterface | null = null;
  info: InfoClase | null = null;

  async ngOnInit(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) throw new Error('Clase no válida');

      const [catalogo, infoMap] = await Promise.all([
        this.clasesService.getCatalogoPublico(),
        this.infoService.getInfoClases(),
      ]);

      // Forzamos refresco tras carga async (igual que en Gimnasios/Noticias)
      // para evitar que la vista se quede en "Cargando" hasta el primer evento de UI.
      this.cdr.detectChanges();

      this.clase = catalogo.find((c) => c.id === id) ?? null;
      if (!this.clase) throw new Error('Clase no encontrada');

      this.info = infoMap[this.clase.nombre] ?? null;
    } catch (e: any) {
      this.error = e?.message ?? 'No se pudo cargar la clase.';
      this.clase = null;
      this.info = null;
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  imagen(): string {
    if (!this.clase) return '';
    if (this.clase.urlImagen) return this.clase.urlImagen;
    const slug = (this.clase.nombre || '').toLowerCase().replace(/\s+/g, '-');
    return `/assets/clases/${slug}.svg`;
  }
}
