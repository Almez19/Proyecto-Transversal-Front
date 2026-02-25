import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { RutinaInterface } from '../interfaces/rutina-interface';
import { EjercicioInterface } from '../interfaces/ejercicio-interface';

@Injectable({
  providedIn: 'root',
})
export class RutinasService {

  private httpClient = inject(HttpClient);

  baseUrl: string = 'http://localhost:8080/api/rutinas';

  constructor() {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Content-Type': 'application/json',});

    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }

  async getAllRutinas(clienteId?: string): Promise<RutinaInterface[]> {
    let params = new HttpParams();
    if (clienteId) params = params.set('clienteId', clienteId);

    return lastValueFrom(this.httpClient.get<RutinaInterface[]>(this.baseUrl, { headers: this.authHeaders(), params }));
  }

  async getRutinaById(id: UUIDTypes | string): Promise<RutinaInterface> {

    return lastValueFrom(this.httpClient.get<RutinaInterface>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() }));
  }

  async createRutina(rutina: Partial<RutinaInterface>): Promise<RutinaInterface> {

    return lastValueFrom(this.httpClient.post<RutinaInterface>(this.baseUrl, rutina, { headers: this.authHeaders() }));
  }

  async deleteRutina(id: UUIDTypes | string): Promise<void> {

    await lastValueFrom(this.httpClient.delete<void>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() }));
  }

  async getEjerciciosDeRutina(rutinaId: UUIDTypes | string): Promise<EjercicioInterface[]> {

    return lastValueFrom(this.httpClient.get<EjercicioInterface[]>(`${this.baseUrl}/${rutinaId}/ejercicios`, { headers: this.authHeaders() }));
  }
}
