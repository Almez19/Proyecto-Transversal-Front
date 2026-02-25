import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaInterface } from '../../interfaces/reserva-interface';
import { ClientesService } from '../../service/clientes-service';
import { ClasesService } from '../../service/clases-service';

@Component({
  selector: 'app-reservas-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-card.html',
  styleUrl: './reservas-card.css',
})
export class ReservasCard {

  private clientesService = inject(ClientesService);
  private clasesService = inject(ClasesService);

  @Input() reserva!: ReservaInterface;

  @Output() cancelar = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  public nombreCliente: string = '';
  public nombreClase: string = '';
  public fechaClase: string = '';
  public horaInicio: string = '';
  public horaFinal: string = '';

  async ngOnInit(): Promise<void> {
    await this.resolverNombres();
  }

  private async resolverNombres(): Promise<void> {
    // Cliente
    const clienteId = (this.reserva as any).clienteId ?? (this.reserva as any).cliente_id ?? '';
    if (clienteId) {
      try {
        const cliente = await this.clientesService.getClienteById(clienteId);
        this.nombreCliente = `${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`.trim();
      } catch {
        this.nombreCliente = '';
      }
    }

    // Clase
    const claseId = (this.reserva as any).claseId ?? (this.reserva as any).clase_id ?? '';
    if (claseId) {
      try {
        const clase = await this.clasesService.getClaseById(claseId);
        const deporte = (clase as any).deporte ?? 'Clase';
        const fecha = (clase as any).fecha ?? '';
        const horaInicioRaw = (clase as any).hora_inicio ?? (clase as any).horaInicio ?? '';
        const horaFinalRaw = (clase as any).hora_final ?? (clase as any).horaFinal ?? '';

        this.nombreClase = deporte;
        this.fechaClase = this.formatearFecha(fecha);
        this.horaInicio = this.formatearHora(horaInicioRaw);
        this.horaFinal = this.formatearHora(horaFinalRaw);
      } catch {
        this.nombreClase = '';
      }
    }
  }

  public onCancelar(): void {
    this.cancelar.emit((this.reserva as any).id);
  }

  public onEliminar(): void {
    this.eliminar.emit((this.reserva as any).id);
  }

  public formatearFecha(valorFecha: string): string {
    if (!valorFecha) return '';
    const partes = valorFecha.split('-');
    if (partes.length === 3) {
      const [yyyy, mm, dd] = partes;
      return `${dd}/${mm}/${yyyy}`;
    }
    return valorFecha;
  }

  public formatearHora(valorHora: string): string {
    if (!valorHora) return '';
    if (valorHora.includes(' ')) {
      const hora = valorHora.split(' ')[1] ?? '';
      return hora.substring(0, 5);
    }
    if (valorHora.includes('T')) {
      const hora = valorHora.split('T')[1] ?? '';
      return hora.substring(0, 5);
    }
    return valorHora.substring(0, 5);
  }
}
