import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ClaseInterface } from '../../interfaces/clase-interface';
import { AuthService } from '../../service/auth-service';
import { ClasesService } from '../../service/clases-service';
import { InfoClasesService, InfoClase } from '../../service/info-clases-service';

@Component({
  selector: 'app-clases-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clases-card.html',
  styleUrl: './clases-card.css',
})
export class ClasesCard {
  private auth = inject(AuthService);
  private clasesService = inject(ClasesService);
  private infoService = inject(InfoClasesService);

  @Input({ required: true }) clase!: ClaseInterface;
  @Input() nombreGimnasio: string | null = null;

  reservando = false;
  mensaje = '';
  error = '';

  detallesAbiertos = false;
  info: InfoClase | null = null;

  async ngOnInit(): Promise<void> {
    try {
      const mapa = await this.infoService.getInfoClases();
      this.info = mapa[this.clase.nombre] ?? null;
    } catch {
      this.info = null;
    }
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

  get esCliente(): boolean {
    return this.auth.esCliente();
  }

  get esFutura(): boolean {
    const fecha = (this.clase.fecha || '').slice(0, 10);
    if (!fecha) return false;
    const dt = new Date(`${fecha}T${this.clase.horaInicio || '00:00:00'}`);
    return dt.getTime() >= Date.now();
  }

  formatearHora(hora: string): string {
    return (hora ?? '').slice(0, 5);
  }

  alternarDetalles(): void {
    this.detallesAbiertos = !this.detallesAbiertos;
  }

  async reservar(): Promise<void> {
    if (!this.esCliente) return;
    this.mensaje = '';
    this.error = '';
    this.reservando = true;
    try {
      await this.clasesService.reservarClase(this.clase.id);
      this.mensaje = 'Reserva creada. Puedes verla en “Reservas”.';
    } catch (error: unknown) {
      this.error = this.obtenerMensajeDeError(
        error,
        'No se pudo reservar (puede que ya estés apuntado o no haya plazas).'
      );
    } finally {
      this.reservando = false;
    }
  }
}
