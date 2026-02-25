import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../service/reservas-service';
import { ReservaInterface } from '../../interfaces/reserva-interface';
import { ReservasList } from '../../lists/reservas-list/reservas-list';

@Component({
  selector: 'app-reservas-component',
  imports: [CommonModule, FormsModule, ReservasList],
  templateUrl: './reservas-component.html',
  styleUrl: './reservas-component.css',
})
export class ReservasComponent {

  private reservasService = inject(ReservasService);

  reservas: ReservaInterface[] = [];

  // filtros
  filtroClienteId: string = '';
  filtroClaseId: string = '';
  soloActivas: boolean = true;

  // crear
  nuevoClienteId: string = '';
  nuevaClaseId: string = '';

  // buscar por id
  buscarId: string = '';

  mensaje: string = '';
  error: string = '';

  ngOnInit(): void {
    this.cargarReservas();
  }

  async cargarReservas(): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      this.reservas = await this.reservasService.getAllReservas({
        clienteId: this.filtroClienteId || undefined,
        claseId: this.filtroClaseId || undefined,
        soloActivas: this.soloActivas,
      });
    } catch (error: any) {
      this.error = 'No se han podido cargar las reservas.';
      console.error(error);
    }
  }

  async crearReserva(): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      if (!this.nuevoClienteId || !this.nuevaClaseId) {
        this.error = 'Rellena los campos obligatorios';
        return;
      }

      await this.reservasService.createReserva({
        clienteId: this.nuevoClienteId as any,
        claseId: this.nuevaClaseId as any,
        estado: true,
      });

      this.mensaje = 'Reserva creada correctamente.';
      this.nuevoClienteId = '';
      this.nuevaClaseId = '';
      await this.cargarReservas();
    } catch (error: any) {
      this.error = 'No se pudo crear la reserva.';
      console.error(error);
    }
  }

  async buscarReservaPorId(): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      if (!this.buscarId) {
        this.error = 'Introduce una reserva.';
        return;
      }

      const reserva = await this.reservasService.getReservaById(this.buscarId);
      this.reservas = [reserva];
      this.mensaje = 'Mostrando resultado';
    } catch (error: any) {
      this.error = 'No se encuentra la reserva';
      console.error(error);
    }
  }

  async cancelarReserva(id: string): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      await this.reservasService.cancelarReserva(id);
      this.mensaje = 'Reserva cancelada.';
      await this.cargarReservas();
    } catch (error: any) {
      this.error = 'No se puede cancelar la reserva.';
      console.error(error);
    }
  }

  async eliminarReserva(id: string): Promise<void> {
    this.mensaje = '';
    this.error = '';
    try {
      await this.reservasService.deleteReserva(id);
      this.mensaje = 'Reserva eliminada.';
      await this.cargarReservas();
    } catch (error: any) {
      this.error = 'No se puede eliminar la reserva.';
      console.error(error);
    }
  }

}
