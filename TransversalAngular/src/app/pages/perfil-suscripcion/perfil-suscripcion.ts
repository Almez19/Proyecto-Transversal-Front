import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MembresiasService } from '../../service/membresias-service';
import { MembresiaInterface } from '../../interfaces/membresia-interface';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';

@Component({
  selector: 'app-perfil-suscripcion',
  imports: [CommonModule, RouterLink, TextoEnumPipe],
  templateUrl: './perfil-suscripcion.html',
  styleUrl: './perfil-suscripcion.css',
})
export class PerfilSuscripcionComponent implements OnInit {
  private membresiasService = inject(MembresiasService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  procesando = false;
  error = '';
  mensaje = '';

  membresias: MembresiaInterface[] = [];

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';
    try {
      this.membresias = await this.membresiasService.getMisMembresias();
    } catch (error: any) {
      this.error = error?.message ?? 'No se pudo cargar tu suscripción.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  get membresiaActiva(): MembresiaInterface | null {
    const hoy = new Date();
    const activas = this.membresias.filter((m) => m.estado === true);
    const noCaducadas = activas.filter((m) => {
      const fechaFin = (m.fechaFinal ?? m.fechaFin) as any;
      if (!fechaFin) return true;
      const fin = new Date(fechaFin);
      return fin >= hoy;
    });
    return noCaducadas.length > 0 ? noCaducadas[0] : null;
  }

  async cancelar(): Promise<void> {
    if (!this.membresiaActiva) return;
    this.procesando = true;
    this.error = '';
    this.mensaje = '';
    try {
      await this.membresiasService.cancelarMiMembresia(this.membresiaActiva.id);
      this.mensaje = 'Suscripción cancelada.';
      await this.cargar();
    } catch (error: any) {
      this.error =
        error?.message ??
        'No se pudo cancelar la suscripción. Revisa el endpoint de cancelación en el backend.';
    } finally {
      this.procesando = false;
      this.cdr.detectChanges();
    }
  }
}
