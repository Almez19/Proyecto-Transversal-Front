import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RutinasService } from '../../service/rutinas-service';
import { EjercicioInterface } from '../../interfaces/ejercicio-interface';

@Component({
  selector: 'app-rutina-ejercicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rutina-ejercicios.html',
  styleUrl: './rutina-ejercicios.css',
})
export class RutinaEjerciciosComponent {
  private route = inject(ActivatedRoute);
  private rutinasService = inject(RutinasService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';

  rutinaId = '';
  ejercicios: EjercicioInterface[] = [];

  async ngOnInit(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) throw new Error('Rutina no válida');
      this.rutinaId = id;
      this.ejercicios = await this.rutinasService.getEjerciciosDeMiRutina(id);
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'No se pudieron cargar los ejercicios.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
