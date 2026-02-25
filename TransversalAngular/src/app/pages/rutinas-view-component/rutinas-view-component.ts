import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EjercicioInterface } from '../../interfaces/ejercicio-interface';

@Component({
  selector: 'app-rutinas-view-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutinas-view-component.html',
  styleUrl: './rutinas-view-component.css',
})
export class RutinasViewComponent {
  @Input() rutinaId: string | null = null;
  @Input() ejercicios: EjercicioInterface[] = [];
}
