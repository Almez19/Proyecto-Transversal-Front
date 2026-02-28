import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { ClaseInterface, CatalogoClaseInterface } from '../interfaces/clase-interface';

@Injectable({ providedIn: 'root' })
export class ClasesService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/clases`;
  private gimnasiosUrl = `${API_URL}/gimnasios`;

  // Público (sin horarios)
  getCatalogoPublico(): Promise<CatalogoClaseInterface[]> {
    return lastValueFrom(this.http.get<CatalogoClaseInterface[]>(`${this.baseUrl}/catalogo`));
  }

  // Privado (con horarios)
  getClasesHorario(filtros?: { salaId?: string; gimnasioId?: string; entrenadorId?: string; fecha?: string }): Promise<ClaseInterface[]> {
    let params = new HttpParams();
    if (filtros?.salaId) params = params.set('salaId', filtros.salaId);
    if (filtros?.gimnasioId) params = params.set('gimnasioId', filtros.gimnasioId);
    if (filtros?.entrenadorId) params = params.set('entrenadorId', filtros.entrenadorId);
    if (filtros?.fecha) params = params.set('fecha', filtros.fecha);

    // Algunos backends no exponen /clases (solo /gimnasios/{id}/clases). Intentamos primero /clases y si falla,
    // hacemos fallback de forma transparente.
    return lastValueFrom(this.http.get<ClaseInterface[]>(this.baseUrl, { params })).catch(async (e) => {
      // Si hay gimnasioId, podemos ir directos al endpoint del gimnasio.
      if (filtros?.gimnasioId) {
        let gymParams = new HttpParams();
        if (filtros?.fecha) gymParams = gymParams.set('fecha', filtros.fecha);
        return await lastValueFrom(
          this.http.get<ClaseInterface[]>(`${this.gimnasiosUrl}/${filtros.gimnasioId}/clases`, { params: gymParams })
        );
      }

      // Si no hay gimnasioId, listamos gimnasios y agregamos sus clases.
      try {
        const gyms = await lastValueFrom(this.http.get<Array<{ id: string }>>(this.gimnasiosUrl));
        const todas = await Promise.all(
          (gyms || []).map((g) => {
            let gymParams = new HttpParams();
            if (filtros?.fecha) gymParams = gymParams.set('fecha', filtros.fecha);
            return lastValueFrom(this.http.get<ClaseInterface[]>(`${this.gimnasiosUrl}/${g.id}/clases`, { params: gymParams })).catch(
              () => [] as ClaseInterface[]
            );
          })
        );
        return todas.flat();
      } catch {
        throw e;
      }
    });
  }

  /** Atajo para listar por gimnasio */
  getClasesPorGimnasio(gimnasioId: string): Promise<ClaseInterface[]> {
    return this.getClasesHorario({ gimnasioId });
  }

  getClaseById(id: string): Promise<ClaseInterface> {
    // Igual que arriba: si /clases/{id} no existe en el back, buscamos el id dentro del agregado de gimnasios.
    return lastValueFrom(this.http.get<ClaseInterface>(`${this.baseUrl}/${id}`)).catch(async (e) => {
      try {
        const gyms = await lastValueFrom(this.http.get<Array<{ id: string }>>(this.gimnasiosUrl));
        for (const g of gyms || []) {
          const clases = await lastValueFrom(this.http.get<ClaseInterface[]>(`${this.gimnasiosUrl}/${g.id}/clases`)).catch(() => []);
          const encontrada = (clases || []).find((c) => c.id === id);
          if (encontrada) return encontrada;
        }
      } catch {
        // ignoramos y devolvemos el error original
      }
      throw e;
    });
  }

  reservarClase(claseId: string): Promise<any> {
    return lastValueFrom(this.http.post(`${this.baseUrl}/${claseId}/reservas`, {}));
  }
}
