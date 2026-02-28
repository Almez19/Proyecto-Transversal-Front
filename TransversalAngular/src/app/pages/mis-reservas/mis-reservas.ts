import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasService } from '../../service/reservas-service';
import { ClasesService } from '../../service/clases-service';
import { ReservaInterface } from '../../interfaces/reserva-interface';
import { ClaseInterface } from '../../interfaces/clase-interface';

@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css',
})
export class MisReservasComponent implements OnInit {
  private reservasService = inject(ReservasService);
  private clasesService = inject(ClasesService);

  cargando = true;
  error = '';
  reservas: ReservaInterface[] = [];
  clasesMap = new Map<string, ClaseInterface>();

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      this.reservas = await this.reservasService.getMisReservas();
      const ids = Array.from(new Set(this.reservas.map((r) => r.claseId)));
      const clases = await Promise.all(ids.map((id) => this.clasesService.getClaseById(id).catch(() => null)));
      clases.filter(Boolean).forEach((c) => this.clasesMap.set((c as ClaseInterface).id, c as ClaseInterface));
    } catch (error: any) {
      this.error = error?.message ?? 'No se pudieron cargar tus reservas.';
      this.reservas = [];
      this.clasesMap.clear();
    } finally {
      this.cargando = false;
    }
  }

  claseDe(reserva: ReservaInterface): ClaseInterface | null {
    return this.clasesMap.get(reserva.claseId) ?? null;
  }

  formatearHora(hora: string): string {
    return (hora ?? '').slice(0, 5);
  }

  async cancelar(id: string): Promise<void> {
    try {
      await this.reservasService.cancelarReserva(id);
      await this.cargar();
    } catch (error: any) {
      alert(error?.message ?? 'No se pudo cancelar la reserva.');
    }
  }
}
