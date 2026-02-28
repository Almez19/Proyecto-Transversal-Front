import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { ReservaInterface } from '../interfaces/reserva-interface';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private http = inject(HttpClient);

  private baseUrl = `${API_URL}/reservas`;
  private miCuentaUrl = `${API_URL}/mi-cuenta`;

  getMisReservas(): Promise<ReservaInterface[]> {
    return lastValueFrom(this.http.get<ReservaInterface[]>(`${this.miCuentaUrl}/reservas`));
  }

  cancelarReserva(id: string, motivo: string = ''): Promise<ReservaInterface> {
    // Por defecto cancelamos como cliente (mi cuenta). Si el backend expone cancelación staff,
    // se puede añadir otro método específico.
    return lastValueFrom(this.http.put<ReservaInterface>(`${this.baseUrl}/${id}/cancelar`, { motivo }));
  }

  // staff
  getReservas(filtros?: { dniNie?: string; claseId?: string; estado?: 'activa' | 'cancelada' }): Promise<ReservaInterface[]> {
    let parametros = new HttpParams();
    if (filtros?.dniNie) parametros = parametros.set('dniNie', filtros.dniNie);
    if (filtros?.claseId) parametros = parametros.set('claseId', filtros.claseId);
    if (filtros?.estado) parametros = parametros.set('estado', filtros.estado);
    return lastValueFrom(this.http.get<ReservaInterface[]>(this.baseUrl, { params: parametros }));
  }

  // Alias (compatibilidad) por si hay código antiguo
  getAllReservas(filtros?: { dniNie?: string; claseId?: string; soloActivas?: boolean }): Promise<ReservaInterface[]> {
    const estado = filtros?.soloActivas ? 'activa' : undefined;
    return this.getReservas({ dniNie: filtros?.dniNie, claseId: filtros?.claseId, estado });
  }

  async getReservaById(id: string): Promise<ReservaInterface> {
    // Si el endpoint existe, perfecto. Si no, hacemos fallback buscando en la lista.
    try {
      return await lastValueFrom(this.http.get<ReservaInterface>(`${this.baseUrl}/${id}`));
    } catch (error) {
      const reservas = await this.getReservas();
      const encontrada = reservas.find((r) => r.id === id);
      if (!encontrada) throw error;
      return encontrada;
    }
  }

  createReserva(reserva: Partial<ReservaInterface>): Promise<ReservaInterface> {
    return lastValueFrom(this.http.post<ReservaInterface>(this.baseUrl, reserva));
  }

  deleteReserva(id: string): Promise<void> {
    return lastValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
