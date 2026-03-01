import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutinaInterface } from '../../../interfaces/rutina-interface';

@Component({
  selector: 'app-rutinas-card-component',
  imports: [CommonModule],
  templateUrl: './rutinas-card-component.html',
  styleUrl: './rutinas-card-component.css',
})
export class RutinasCardComponent {

  @Input() rutina!: RutinaInterface;
  @Output() ver = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  onVer(): void {
    this.ver.emit(String(this.rutina.id));
  }

  onEliminar(): void {
    this.eliminar.emit(String(this.rutina.id));
  }

}
