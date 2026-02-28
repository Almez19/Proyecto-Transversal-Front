import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CatalogoRutinasService, RutinaCatalogoInterface } from '../../service/catalogo-rutinas-service';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-rutina-catalogo-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, TextoEnumPipe],
  templateUrl: './rutina-catalogo-detalle.html',
  styleUrl: './rutina-catalogo-detalle.css',
})
export class RutinaCatalogoDetalleComponent {
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoRutinasService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';
  rutina: RutinaCatalogoInterface | null = null;

  async ngOnInit(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) throw new Error('Rutina no válida');

      const catalogo = await this.catalogoService.getCatalogoRutinas();
      this.rutina = catalogo.find((r) => r.id === id) ?? null;
      if (!this.rutina) throw new Error('Rutina no encontrada');

      // Refresco forzado tras carga async (igual que en Gimnasios/Noticias)
      this.cdr.detectChanges();
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'No se pudo cargar la rutina.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
