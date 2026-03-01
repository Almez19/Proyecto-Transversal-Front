import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasCard } from '../../components/cards/reservas-card/reservas-card';
import { ReservaInterface } from '../../interfaces/reserva-interface';

@Component({
  selector: 'app-reservas-list',
  imports: [CommonModule, ReservasCard],
  templateUrl: './reservas-list.html',
  styleUrl: './reservas-list.css',
})
export class ReservasList {

  @Input() reservas: ReservaInterface[] = [];
  @Output() cancelar = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  onCancelar(id: string): void {
    this.cancelar.emit(id);
  }

  onEliminar(id: string): void {
    this.eliminar.emit(id);
  }

}
