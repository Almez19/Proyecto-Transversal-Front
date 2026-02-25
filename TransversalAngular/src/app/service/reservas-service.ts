import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { ReservaInterface } from '../interfaces/reserva-interface';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {

  private httpClient = inject(HttpClient);

  baseUrl: string = 'http://localhost:8080/api/reservas';

  constructor() {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }

  async getAllReservas(filtros?: { clienteId?: string; claseId?: string; soloActivas?: boolean }): Promise<ReservaInterface[]> {
    let params = new HttpParams();

    if (filtros?.clienteId) params = params.set('clienteId', filtros.clienteId);
    if (filtros?.claseId) params = params.set('claseId', filtros.claseId);
    if (typeof filtros?.soloActivas === 'boolean') params = params.set('soloActivas', String(filtros.soloActivas));

    return lastValueFrom(this.httpClient.get<ReservaInterface[]>(this.baseUrl, { headers: this.authHeaders(), params }));
  }

  async getReservaById(id: UUIDTypes | string): Promise<ReservaInterface> {

    return lastValueFrom(this.httpClient.get<ReservaInterface>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() }));
  }

  async createReserva(reserva: Partial<ReservaInterface>): Promise<ReservaInterface> {

    return lastValueFrom(this.httpClient.post<ReservaInterface>(this.baseUrl, reserva, { headers: this.authHeaders() }));
  }

  async cancelarReserva(id: UUIDTypes | string): Promise<ReservaInterface> {

    return lastValueFrom(this.httpClient.put<ReservaInterface>(`${this.baseUrl}/${id}/cancelar`, {}, { headers: this.authHeaders() }));
  }

  async deleteReserva(id: UUIDTypes | string): Promise<void> {

    await lastValueFrom(this.httpClient.delete<void>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() }));
  }
}
