import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RutinasService } from '../../service/rutinas-service';
import { RutinaInterface } from '../../interfaces/rutina-interface';
import { EjercicioInterface } from '../../interfaces/ejercicio-interface';
import { RutinasListComponent } from '../../components/rutinas-list-component/rutinas-list-component';
import { RutinasViewComponent } from '../rutinas-view-component/rutinas-view-component';

@Component({
  selector: 'app-rutinas-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RutinasListComponent, RutinasViewComponent],
  templateUrl: './rutinas-component.html',
  styleUrl: './rutinas-component.css',
})
export class RutinasComponent {

  private rutinasService = inject(RutinasService);

  // Datos
  public rutinas: RutinaInterface[] = [];
  public rutinasFiltradas: RutinaInterface[] = [];

  public ejercicios: EjercicioInterface[] = [];
  public rutinaSeleccionadaId: string | null = null;

  // filtros por back
  public filtroClienteId: string = '';

  // filtro por nombre
  public filtroNombreRutina: string = '';

  // crear
  public nuevoNombre: string = '';
  public nuevoClienteId: string = '';

  // buscar por id
  public buscarId: string = '';

  public mensaje: string = '';
  public error: string = '';

  ngOnInit(): void {
    this.cargarRutinas();
  }

  async cargarRutinas(): Promise<void> {
    this.mensaje = '';
    this.error = '';
    this.rutinaSeleccionadaId = null;
    this.ejercicios = [];
    try {
      this.rutinas = await this.rutinasService.getAllRutinas(this.filtroClienteId || undefined);
      this.aplicarFiltroNombreRutina();
    } catch (error: any) {
      this.error = 'No se pueden cargar las rutinas.';
      this.rutinas = [];
      this.rutinasFiltradas = [];
      console.error(error);
    }
  }

  public aplicarFiltroNombreRutina(): void {
    const texto = (this.filtroNombreRutina || '').toLowerCase().trim();

    if (!texto) {
      this.rutinasFiltradas = [...this.rutinas];
      return;
    }

    this.rutinasFiltradas = this.rutinas.filter((rutina) =>
      (rutina.nombre || '').toLowerCase().includes(texto)
    );
  }

  async crearRutina(): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      if (!this.nuevoNombre || !this.nuevoClienteId) {
        this.error = 'Campo obligatorio.';
        return;
      }
      await this.rutinasService.createRutina({
        nombre: this.nuevoNombre,
        clienteId: this.nuevoClienteId as any,
      });
      this.mensaje = 'Rutina creada';
      this.nuevoNombre = '';
      this.nuevoClienteId = '';
      await this.cargarRutinas();
    } catch (error: any) {
      this.error = 'No se puede crear la rutina.';
      console.error(error);
    }
  }

  async buscarRutinaPorId(): Promise<void> {
    this.mensaje = '';
    this.error = '';
    this.rutinaSeleccionadaId = null;
    this.ejercicios = [];
    try {
      if (!this.buscarId) {
        this.error = 'Introduce la rutina.';
        return;
      }
      const rutina = await this.rutinasService.getRutinaById(this.buscarId);
      this.rutinas = [rutina];
      this.aplicarFiltroNombreRutina();
      this.mensaje = 'Mostrando resultado.';
    } catch (error: any) {
      this.error = 'No se ha encontrado la rutina.';
      console.error(error);
    }
  }

  async verEjercicios(rutinaId: string): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      this.rutinaSeleccionadaId = rutinaId;
      this.ejercicios = await this.rutinasService.getEjerciciosDeRutina(rutinaId);
    } catch (error: any) {
      this.error = 'No se pudieron cargar los ejercicios de la rutina.';
      console.error(error);
    }
  }

  async eliminarRutina(id: string): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      await this.rutinasService.deleteRutina(id);
      this.mensaje = 'Rutina eliminada.';

      if (this.rutinaSeleccionadaId === id) {
        this.rutinaSeleccionadaId = null;
        this.ejercicios = [];
      }

      await this.cargarRutinas();
    } catch (error: any) {
      this.error = 'No se pudo eliminar la rutina.';
      console.error(error);
    }
  }
}
