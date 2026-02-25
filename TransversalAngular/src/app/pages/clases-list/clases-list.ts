import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClaseInterface } from '../../interfaces/clase-interface';
import { ClasesService } from '../../service/clases-service';
import { ClasesCard } from '../../cards/clases-card/clases-card';

@Component({
  selector: 'app-clases-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ClasesCard],
  templateUrl: './clases-list.html',
  styleUrl: './clases-list.css',
})
export class ClasesList {

  private clasesService = inject(ClasesService);

  public clases: ClaseInterface[] = [];
  public clasesFiltradas: ClaseInterface[] = [];
  public textoBusqueda: string = '';
  public filtroFecha: string = '';
  public soloFuturas: boolean = true;

  public cargando: boolean = false;
  public error: string = '';

  async ngOnInit(): Promise<void> {
    await this.cargarClases();
  }

  public async cargarClases(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      this.clases = await this.clasesService.getAllClases();
      this.aplicarFiltros();
    } catch (error) {
      this.error = 'No se cargan las clases.';
      this.clases = [];
      this.clasesFiltradas = [];
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  public aplicarFiltros(): void {
    const texto = (this.textoBusqueda || '').toLowerCase().trim();
    const fecha = (this.filtroFecha || '').trim();
    const ahora = new Date();

    this.clasesFiltradas = (this.clases || []).filter((clase) => {
      const deporte = ((clase as any).deporte || '').toLowerCase();

      // filtro por nombre/deporte (ej: "cardio", "spinning", "yoga"...)
      const coincideTexto = !texto || deporte.includes(texto);

      // filtro por fecha exacta (YYYY-MM-DD)
      const fechaClase = ((clase as any).fecha || '').slice(0, 10);
      const coincideFecha = !fecha || fechaClase === fecha;

      // filtro futuras: usando fecha + hora_inicio si existe
      const horaInicio = (clase as any).hora_inicio ?? (clase as any).horaInicio ?? '';
      let fechaHoraInicio: Date | null = null;

      if (fechaClase) {
        if (horaInicio && typeof horaInicio === 'string') {
          // "YYYY-MM-DD HH:MM:SS"
          if (horaInicio.includes(' ')) {
            fechaHoraInicio = new Date(horaInicio.replace(' ', 'T'));
          } else if (horaInicio.includes('T')) {
            fechaHoraInicio = new Date(horaInicio);
          } else {
            // si solo viene "HH:MM:SS" o "HH:MM"
            fechaHoraInicio = new Date(`${fechaClase}T${horaInicio}`);
          }
        } else {
          fechaHoraInicio = new Date(`${fechaClase}T00:00:00`);
        }
      }

      const esFutura = !fechaHoraInicio || fechaHoraInicio.getTime() >= ahora.getTime();

      return coincideTexto && coincideFecha && (!this.soloFuturas || esFutura);
    });
  }

}

