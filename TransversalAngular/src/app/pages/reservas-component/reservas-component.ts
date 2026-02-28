import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth-service';
import { ReservasService } from '../../service/reservas-service';
import { ClasesService } from '../../service/clases-service';
import { GimnasioService } from '../../service/gimnasio-service';
import { ReservaInterface, EstadoReserva } from '../../interfaces/reserva-interface';
import { ClaseInterface } from '../../interfaces/clase-interface';

type ReservaDetalle = {
  reserva: ReservaInterface;
  clase?: ClaseInterface;
  nombreGimnasio?: string;
};

@Component({
  selector: 'app-reservas-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas-component.html',
  styleUrl: './reservas-component.css',
})
export class ReservasComponent {
  private auth = inject(AuthService);
  private reservasService = inject(ReservasService);
  private clasesService = inject(ClasesService);
  private gimnasioService = inject(GimnasioService);
  private cdr = inject(ChangeDetectorRef);

  // Vista
  get esCliente(): boolean {
    return this.auth.esCliente();
  }

  // Cliente
  cargandoMis = false;
  errorMis = '';
  misReservas: ReservaDetalle[] = [];
  filtroTexto = '';

  cancelandoId: string | null = null;
  motivoCancelacion = '';
  procesandoCancelacion = false;

  // Staff
  cargandoStaff = false;
  errorStaff = '';
  reservasStaff: ReservaInterface[] = [];

  filtroClienteDniNie = '';
  filtroClaseId = '';
  filtroEstado: '' | EstadoReserva = '';

  nuevaClienteDniNie = '';
  nuevaClaseId = '';
  creando = false;

  async ngOnInit(): Promise<void> {
    if (this.esCliente) {
      await this.cargarMisReservas();
    } else {
      await this.cargarReservasStaff();
    }
  }

  // -----------------
  // CLIENTE
  // -----------------
  get misReservasFiltradas(): ReservaDetalle[] {
    const textoFiltro = this.filtroTexto.trim().toLowerCase();
    if (!textoFiltro) return this.misReservas;

    return this.misReservas.filter((r) => {
      const texto = [
        r.clase?.nombre,
        r.nombreGimnasio,
        r.clase?.fecha,
        r.clase?.horaInicio,
        r.reserva.estado,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return texto.includes(textoFiltro);
    });
  }

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

  async cargarMisReservas(): Promise<void> {
    this.cargandoMis = true;
    this.errorMis = '';

    try {
      const [reservas, gimnasios] = await Promise.all([
        this.reservasService.getMisReservas(),
        this.gimnasioService.getAllGimnasios(),
      ]);

      const mapaGimnasios = new Map(gimnasios.map((g) => [g.id, g.nombre] as const));

      // cargar clases de manera "lazy" por ids únicos
      const ids = Array.from(new Set(reservas.map((r) => r.claseId)));
      const clases = await Promise.all(
        ids.map((id) => this.clasesService.getClaseById(id).catch(() => null))
      );
      const mapaClases = new Map<string, ClaseInterface>();
      for (const c of clases) {
        if (c) mapaClases.set(c.id, c);
      }

      this.misReservas = reservas
        .map((r) => {
          const clase = mapaClases.get(r.claseId);
          return {
            reserva: r,
            clase,
            nombreGimnasio: clase ? (mapaGimnasios.get(clase.gimnasioId) ?? 'Gimnasio') : undefined,
          };
        })
        // ordena: activas primero y por fecha
        .sort((a, b) => {
          if (a.reserva.estado !== b.reserva.estado) {
            return a.reserva.estado === 'activa' ? -1 : 1;
          }
          const fa = a.clase?.fecha ?? '';
          const fb = b.clase?.fecha ?? '';
          return fa.localeCompare(fb);
        });
    } catch (error: unknown) {
      this.errorMis = this.obtenerMensajeDeError(error, 'No se pudieron cargar tus reservas.');
      this.misReservas = [];
    } finally {
      this.cargandoMis = false;
      this.cdr.detectChanges();
    }
  }

  abrirCancelacion(id: string): void {
    this.cancelandoId = id;
    this.motivoCancelacion = '';
  }

  cerrarCancelacion(): void {
    this.cancelandoId = null;
    this.motivoCancelacion = '';
  }

  async confirmarCancelacion(reservaId: string): Promise<void> {
    this.procesandoCancelacion = true;
    this.errorMis = '';

    try {
      await this.reservasService.cancelarReserva(reservaId, this.motivoCancelacion || undefined);
      await this.cargarMisReservas();
      this.cerrarCancelacion();
    } catch (error: unknown) {
      this.errorMis = this.obtenerMensajeDeError(error, 'No se pudo cancelar la reserva.');
    } finally {
      this.procesandoCancelacion = false;
      this.cdr.detectChanges();
    }
  }

  // -----------------
  // STAFF
  // -----------------
  async cargarReservasStaff(): Promise<void> {
    this.cargandoStaff = true;
    this.errorStaff = '';

    try {
      const filtros: { dniNie?: string; claseId?: string; estado?: EstadoReserva } = {};
      if (this.filtroClienteDniNie.trim()) filtros.dniNie = this.filtroClienteDniNie.trim();
      if (this.filtroClaseId.trim()) filtros.claseId = this.filtroClaseId.trim();
      if (this.filtroEstado) filtros.estado = this.filtroEstado;

      this.reservasStaff = await this.reservasService.getReservas(filtros);
    } catch (error: unknown) {
      this.errorStaff = this.obtenerMensajeDeError(error, 'No se pudieron cargar las reservas.');
      this.reservasStaff = [];
    } finally {
      this.cargandoStaff = false;
      this.cdr.detectChanges();
    }
  }

  async crearReserva(): Promise<void> {
    if (!this.nuevaClienteDniNie.trim() || !this.nuevaClaseId.trim()) {
      this.errorStaff = 'DNI/NIE y ClaseId son obligatorios.';
      return;
    }

    this.creando = true;
    this.errorStaff = '';

    try {
      await this.reservasService.createReserva({
        dniNie: this.nuevaClienteDniNie.trim(),
        claseId: this.nuevaClaseId.trim(),
      });
      this.nuevaClienteDniNie = '';
      this.nuevaClaseId = '';
      await this.cargarReservasStaff();
    } catch (error: unknown) {
      this.errorStaff = this.obtenerMensajeDeError(error, 'No se pudo crear la reserva.');
    } finally {
      this.creando = false;
      this.cdr.detectChanges();
    }
  }

  async eliminarReserva(id: string): Promise<void> {
    const ok = confirm('¿Eliminar esta reserva?');
    if (!ok) return;

    this.errorStaff = '';
    try {
      await this.reservasService.deleteReserva(id);
      await this.cargarReservasStaff();
    } catch (error: unknown) {
      this.errorStaff = this.obtenerMensajeDeError(error, 'No se pudo eliminar la reserva.');
    } finally {
      this.cdr.detectChanges();
    }
  }
}
