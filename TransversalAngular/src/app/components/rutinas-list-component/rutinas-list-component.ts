import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutinaInterface } from '../../interfaces/rutina-interface';
import { RutinasCardComponent } from '../cards/rutinas-card-component/rutinas-card-component';

@Component({
  selector: 'app-rutinas-list-component',
  imports: [CommonModule, RutinasCardComponent],
  templateUrl: './rutinas-list-component.html',
  styleUrl: './rutinas-list-component.css',
})
export class RutinasListComponent {

  @Input() rutinas: RutinaInterface[] = [];
  @Output() ver = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  onVer(id: string): void {
    this.ver.emit(id);
  }

  onEliminar(id: string): void {
    this.eliminar.emit(id);
  }

}
