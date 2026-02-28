import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClaseInterface } from '../../interfaces/clase-interface';
import { ClasesService } from '../../service/clases-service';
import { ClasesCard } from '../../cards/clases-card/clases-card';
import { GimnasioService } from '../../service/gimnasio-service';
import { Igimnasio } from '../../interfaces/igimnasio';

@Component({
  selector: 'app-clases-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ClasesCard],
  templateUrl: './clases-list.html',
  styleUrl: './clases-list.css',
})
export class ClasesList {

  private clasesService = inject(ClasesService);
  private gimnasioService = inject(GimnasioService);
  private cdr = inject(ChangeDetectorRef);

  public clases: ClaseInterface[] = [];
  public clasesFiltradas: ClaseInterface[] = [];
  public textoBusqueda: string = '';
  public filtroFecha: string = '';
  public soloFuturas: boolean = false;
  public filtroGimnasioId: string = '';
  public filtroNivel: '' | 'principiante' | 'intermedio' | 'avanzado' = '';

  public gimnasios: Igimnasio[] = [];
  private mapaGimnasios = new Map<string, string>();

  // Al entrar en la página queremos mostrar loader y después todas las clases sin
  // que el usuario tenga que tocar ningún filtro.
  public cargando: boolean = true;
  public error: string = '';

  async ngOnInit(): Promise<void> {
    // Asegura valores por defecto estables (evita estados "undefined" en ngModel)
    this.filtroNivel = this.filtroNivel ?? '';
    this.filtroGimnasioId = this.filtroGimnasioId ?? '';
    this.textoBusqueda = this.textoBusqueda ?? '';
    this.filtroFecha = this.filtroFecha ?? '';

    await Promise.all([this.cargarGimnasios(), this.cargarClases()]);

    // En algunos entornos el primer render puede ocurrir antes de que ngModel dispare
    // cambios; forzamos un filtrado final para que se vean todas.
    this.aplicarFiltros();
  }

  private async cargarGimnasios(): Promise<void> {
    try {
      this.gimnasios = await this.gimnasioService.getAllGimnasios();
      this.mapaGimnasios = new Map(this.gimnasios.map((g) => [g.id, g.nombre]));
    } catch (error) {
      console.warn('No se pudieron cargar los gimnasios para los filtros.', error);
      this.gimnasios = [];
      this.mapaGimnasios = new Map();
    }
  }

  public nombreGimnasio(id: string): string {
    return this.mapaGimnasios.get(id) ?? 'Gimnasio';
  }

  public formatearHora(hora: string): string {
    return (hora ?? '').slice(0, 5);
  }

  public async cargarClases(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      this.clases = await this.clasesService.getClasesHorario();
      // Filtrado inmediato + microtarea para asegurar refresco de vista.
      this.aplicarFiltros();
      queueMicrotask(() => this.aplicarFiltros());
      // En algunos casos (AOT / control-flow) Angular no refresca hasta que cambia un ngModel.
      // Forzamos refresh como hace la pantalla de Gimnasios.
      this.cdr.detectChanges();
    } catch (error) {
      this.error = 'No se cargan las clases.';
      this.clases = [];
      this.clasesFiltradas = [];
      console.error(error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  public aplicarFiltros(): void {
    const texto = (this.textoBusqueda || '').toLowerCase().trim();
    const fecha = (this.filtroFecha || '').trim();
    const ahora = new Date();
    const gimnasioId = (this.filtroGimnasioId || '').trim();
    const nivel = (this.filtroNivel || '').trim();

    this.clasesFiltradas = (this.clases || []).filter((clase) => {
      const deporte = (clase.nombre || '').toLowerCase();

      // filtro por nombre/deporte (ej: "cardio", "spinning", "yoga"...)
      const coincideTexto = !texto || deporte.includes(texto);

      // filtro por fecha exacta (YYYY-MM-DD)
      const fechaClase = (clase.fecha || '').slice(0, 10);
      const coincideFecha = !fecha || fechaClase === fecha;

      // filtro por gimnasio
      const coincideGimnasio = !gimnasioId || clase.gimnasioId === gimnasioId;

      // filtro por nivel
      const coincideNivel = !nivel || (clase.nivel || '').toLowerCase() === nivel;

      // filtro futuras: usando fecha + hora_inicio si existe
      const horaInicio = clase.horaInicio ?? '';
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

      return coincideTexto && coincideFecha && coincideGimnasio && coincideNivel && (!this.soloFuturas || esFutura);
    });

    // Refresco inmediato tras recalcular filtros
    this.cdr.detectChanges();
  }

}

