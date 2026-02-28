import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { MembresiaInterface } from '../interfaces/membresia-interface';

@Injectable({ providedIn: 'root' })
export class MembresiasService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/mi-cuenta/membresias`;

  getMisMembresias(): Promise<MembresiaInterface[]> {
    return lastValueFrom(this.http.get<MembresiaInterface[]>(this.baseUrl));
  }

  /**
   * Endpoint sugerido: si en tu back lo has llamado diferente, ajusta la URL.
   */
  cancelarMiMembresia(id: string): Promise<MembresiaInterface> {
    return lastValueFrom(this.http.put<MembresiaInterface>(`${this.baseUrl}/${id}/cancelar`, {}));
  }

  /**
   * Contratar una membresía como cliente autenticado.
   * Requiere endpoint en el backend: POST /api/mi-cuenta/membresias/contratar
   */
  contratar(duracion: string, calidad: string): Promise<MembresiaInterface> {
    return lastValueFrom(
      this.http.post<MembresiaInterface>(`${this.baseUrl}/contratar`, {
        duracion,
        calidad,
      })
    );
  }
}
