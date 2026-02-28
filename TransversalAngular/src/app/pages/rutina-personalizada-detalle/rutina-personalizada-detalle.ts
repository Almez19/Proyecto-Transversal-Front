import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FavoritosService, RutinaPersonalizada } from '../../service/favoritos-service';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-rutina-personalizada-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, TextoEnumPipe],
  templateUrl: './rutina-personalizada-detalle.html',
  styleUrl: './rutina-personalizada-detalle.css',
})
export class RutinaPersonalizadaDetalleComponent {
  private route = inject(ActivatedRoute);
  private favoritos = inject(FavoritosService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';

  rutina: RutinaPersonalizada | null = null;

  async ngOnInit(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) throw new Error('Rutina no válida');

      const rutinas = this.favoritos.obtenerRutinasPersonalizadas();
      this.rutina = rutinas.find((r) => r.id === id) ?? null;
      if (!this.rutina) throw new Error('Rutina no encontrada');
    } catch (e: any) {
      this.error = e?.message ?? 'No se pudo cargar la rutina.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
