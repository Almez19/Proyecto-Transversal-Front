import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth-service';
import { RutinasService } from '../../service/rutinas-service';
import { RutinaInterface } from '../../interfaces/rutina-interface';
import { EjercicioInterface } from '../../interfaces/ejercicio-interface';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-rutinas-component',
  standalone: true,
  imports: [CommonModule, FormsModule, TextoEnumPipe],
  templateUrl: './rutinas-component.html',
  styleUrl: './rutinas-component.css',
})
export class RutinasComponent {
  private auth = inject(AuthService);
  private rutinasService = inject(RutinasService);

  get esCliente(): boolean {
    return this.auth.esCliente();
  }

  // Cliente
  cargandoMis = false;
  errorMis = '';
  misRutinas: RutinaInterface[] = [];

  ejercicios = new Map<string, EjercicioInterface[]>();
  cargandoEjercicios = new Set<string>();
  rutinaAbiertaId: string | null = null;

  // Staff
  cargandoStaff = false;
  errorStaff = '';
  rutinasStaff: RutinaInterface[] = [];

  filtroClienteDniNie = '';

  // Crear rutina (staff)
  nuevaRutina: Partial<RutinaInterface> = {
    nombre: '',
    objetivo: 'salud',
    nivel: 'principiante',
    diasPorSemana: 3,
    notas: '',
  };
  creando = false;

  private obtenerMensajeDeError(error: unknown, mensajePorDefecto: string): string {
    if (typeof error === 'object' && error !== null) {
      const registro = error as Record<string, unknown>;

      const mensajeDirecto = registro['message'];
      if (typeof mensajeDirecto === 'string' && mensajeDirecto.trim()) {
        return mensajeDirecto;
      }

      const errorInterno = registro['error'];
      if (typeof errorInterno === 'object' && errorInterno !== null) {
        const registroInterno = errorInterno as Record<string, unknown>;
        const mensajeInterno = registroInterno['message'];
        if (typeof mensajeInterno === 'string' && mensajeInterno.trim()) {
          return mensajeInterno;
        }
      }
    }

    return mensajePorDefecto;
  }

  async ngOnInit(): Promise<void> {
    if (this.esCliente) {
      await this.cargarMisRutinas();
    } else {
      await this.cargarRutinasStaff();
    }
  }

  // -----------------
  // CLIENTE
  // -----------------
  async cargarMisRutinas(): Promise<void> {
    this.cargandoMis = true;
    this.errorMis = '';
    try {
      this.misRutinas = await this.rutinasService.getMisRutinas();
    } catch (error: unknown) {
      this.errorMis = this.obtenerMensajeDeError(error, 'No se pudieron cargar tus rutinas.');
      this.misRutinas = [];
    } finally {
      this.cargandoMis = false;
    }
  }

  async abrirRutina(rutinaId: string): Promise<void> {
    if (this.rutinaAbiertaId === rutinaId) {
      this.rutinaAbiertaId = null;
      return;
    }

    this.rutinaAbiertaId = rutinaId;

    if (this.ejercicios.has(rutinaId) || this.cargandoEjercicios.has(rutinaId)) return;

    this.cargandoEjercicios.add(rutinaId);
    try {
      const lista = await this.rutinasService.getEjerciciosDeMiRutina(rutinaId);
      // orden por "orden"
      lista.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
      this.ejercicios.set(rutinaId, lista);
    } catch (error: unknown) {
      console.warn('No se pudieron cargar los ejercicios de la rutina.', error);
      this.ejercicios.set(rutinaId, []);
    } finally {
      this.cargandoEjercicios.delete(rutinaId);
    }
  }

  // -----------------
  // STAFF
  // -----------------
  async cargarRutinasStaff(): Promise<void> {
    this.cargandoStaff = true;
    this.errorStaff = '';

    try {
      const dniNie = this.filtroClienteDniNie.trim() || undefined;
      this.rutinasStaff = await this.rutinasService.getRutinas(dniNie);
    } catch (error: unknown) {
      this.errorStaff = this.obtenerMensajeDeError(error, 'No se pudieron cargar las rutinas.');
      this.rutinasStaff = [];
    } finally {
      this.cargandoStaff = false;
    }
  }

  async crearRutina(): Promise<void> {
    if (!this.filtroClienteDniNie.trim()) {
      this.errorStaff = 'Para crear una rutina necesitas indicar el DNI/NIE del cliente.';
      return;
    }

    if (!this.nuevaRutina.nombre?.trim()) {
      this.errorStaff = 'El nombre de la rutina es obligatorio.';
      return;
    }

    this.creando = true;
    this.errorStaff = '';

    try {
      await this.rutinasService.createRutina({
        ...this.nuevaRutina,
        clienteDniNie: this.filtroClienteDniNie.trim(),
      } as RutinaInterface);

      this.nuevaRutina = {
        nombre: '',
        objetivo: 'salud',
        nivel: 'principiante',
        diasPorSemana: 3,
        notas: '',
      };

      await this.cargarRutinasStaff();
    } catch (error: unknown) {
      this.errorStaff = this.obtenerMensajeDeError(error, 'No se pudo crear la rutina.');
    } finally {
      this.creando = false;
    }
  }

  async eliminarRutina(id: string): Promise<void> {
    const ok = confirm('¿Eliminar esta rutina?');
    if (!ok) return;

    this.errorStaff = '';
    try {
      await this.rutinasService.deleteRutina(id);
      await this.cargarRutinasStaff();
    } catch (error: unknown) {
      this.errorStaff = this.obtenerMensajeDeError(error, 'No se pudo eliminar la rutina.');
    }
  }
}
