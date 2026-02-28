import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RutinasService } from '../../service/rutinas-service';
import { RutinaInterface } from '../../interfaces/rutina-interface';
import { EjercicioInterface } from '../../interfaces/ejercicio-interface';
import { MaquinasInterface } from '../../interfaces/maquinas-interface';
import { MaquinasService } from '../../service/maquinas-service';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-rutina-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, TextoEnumPipe],
  templateUrl: './rutina-detalle.html',
  styleUrl: './rutina-detalle.css',
})
export class RutinaDetalleComponent {
  private route = inject(ActivatedRoute);
  private rutinasService = inject(RutinasService);
  private maquinasService = inject(MaquinasService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';

  rutina: RutinaInterface | null = null;
  ejercicios: EjercicioInterface[] = [];
  maquinas: Record<string, MaquinasInterface> = {};

  async ngOnInit(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) throw new Error('Rutina no válida');

      const rutinas = await this.rutinasService.getMisRutinas();
      this.rutina = rutinas.find((r) => r.id === id) ?? null;
      if (!this.rutina) throw new Error('Rutina no encontrada');

      this.ejercicios = await this.rutinasService.getEjerciciosDeMiRutina(id);

      const maquinaIds = Array.from(new Set(this.ejercicios.map((e) => e.maquinaId).filter(Boolean) as string[]));
      const maquinas = await Promise.all(
        maquinaIds.map(async (mid) => {
          try {
            return await this.maquinasService.getMaquinaById(mid);
          } catch {
            return null;
          }
        })
      );
      this.maquinas = Object.fromEntries(
        maquinas.filter(Boolean).map((m) => [m!.id, m!])
      );
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'No se pudo cargar la rutina.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  maquinaNombre(id?: string | null): string {
    if (!id) return 'Sin máquina';
    return this.maquinas[id]?.nombre ?? 'Máquina';
  }

  maquinaDescripcion(id?: string | null): string {
    if (!id) return '';
    return this.maquinas[id]?.descripcion ?? '';
  }
}
