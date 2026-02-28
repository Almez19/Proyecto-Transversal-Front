import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { RutinaInterface } from '../interfaces/rutina-interface';
import { EjercicioInterface } from '../interfaces/ejercicio-interface';

@Injectable({ providedIn: 'root' })
export class RutinasService {
  private http = inject(HttpClient);

  private baseUrl = `${API_URL}/rutinas`;
  private ejerciciosUrl = `${API_URL}/ejercicios`;
  private miCuentaUrl = `${API_URL}/mi-cuenta`;

  // cliente
  getMisRutinas(): Promise<RutinaInterface[]> {
    return lastValueFrom(this.http.get<RutinaInterface[]>(`${this.miCuentaUrl}/rutinas`));
  }

  getEjerciciosDeMiRutina(rutinaId: string): Promise<EjercicioInterface[]> {
    return lastValueFrom(this.http.get<EjercicioInterface[]>(`${this.miCuentaUrl}/rutinas/${rutinaId}/ejercicios`));
  }

  // staff
  /**
   * Filtra por DNI/NIE del cliente (evita usar UID en el front).
   * Si tu backend usa otro nombre de parámetro, cámbialo aquí.
   */
  getRutinas(dniNie?: string): Promise<RutinaInterface[]> {
    let params = new HttpParams();
    if (dniNie) params = params.set('dniNie', dniNie);
    return lastValueFrom(this.http.get<RutinaInterface[]>(this.baseUrl, { params }));
  }

  createRutina(rutina: Partial<RutinaInterface>): Promise<RutinaInterface> {
    return lastValueFrom(this.http.post<RutinaInterface>(this.baseUrl, rutina));
  }

  deleteRutina(id: string): Promise<void> {
    return lastValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }

  getEjerciciosDeRutinaStaff(rutinaId: string): Promise<EjercicioInterface[]> {
    const params = new HttpParams().set('rutinaId', rutinaId);
    return lastValueFrom(this.http.get<EjercicioInterface[]>(this.ejerciciosUrl, { params }));
  }

  // --- Compatibilidad con nombres usados por el front antiguo ---
  getAllRutinas(dniNie?: string): Promise<RutinaInterface[]> {
    return this.getRutinas(dniNie);
  }

  async getRutinaById(id: string): Promise<RutinaInterface> {
    try {
      return await lastValueFrom(this.http.get<RutinaInterface>(`${this.baseUrl}/${id}`));
    } catch (error) {
      const rutinas = await this.getRutinas();
      const encontrada = rutinas.find((r) => r.id === id);
      if (!encontrada) throw error;
      return encontrada;
    }
  }

  getEjerciciosDeRutina(rutinaId: string): Promise<EjercicioInterface[]> {
    return this.getEjerciciosDeRutinaStaff(rutinaId);
  }
}
