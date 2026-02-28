import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RutinaInterface } from '../../interfaces/rutina-interface';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-rutina-card',
  imports: [CommonModule, TextoEnumPipe],
  templateUrl: './rutina-card.html',
  styleUrl: './rutina-card.css',
})
export class RutinaCardComponent {
  @Input() rutina!: RutinaInterface;
  @Input() guardada = false;
  @Input() puedeGuardar = false;

  @Output() guardar = new EventEmitter<string>();

  onGuardar(): void {
    this.guardar.emit(String(this.rutina.id));
  }
}
