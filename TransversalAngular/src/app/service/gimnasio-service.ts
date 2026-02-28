import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { Igimnasio } from '../interfaces/igimnasio';
import { MaquinasInterface } from '../interfaces/maquinas-interface';
import { ClaseInterface } from '../interfaces/clase-interface';
import { NoticiasInterface } from '../interfaces/noticias-interface';

@Injectable({ providedIn: 'root' })
export class GimnasioService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/gimnasios`;

  getAllGimnasios(): Promise<Igimnasio[]> {
    return lastValueFrom(this.http.get<Igimnasio[]>(this.baseUrl));
  }

  getGimnasioById(id: string): Promise<Igimnasio> {
    return lastValueFrom(this.http.get<Igimnasio>(`${this.baseUrl}/${id}`));
  }

  getMaquinasDeGimnasio(id: string): Promise<MaquinasInterface[]> {
    return lastValueFrom(this.http.get<MaquinasInterface[]>(`${this.baseUrl}/${id}/maquinas`));
  }

  getNoticiasDeGimnasio(id: string): Promise<NoticiasInterface[]> {
    return lastValueFrom(this.http.get<NoticiasInterface[]>(`${this.baseUrl}/${id}/noticias`));
  }

  getCatalogoClasesDeGimnasio(id: string): Promise<string[]> {
    return lastValueFrom(this.http.get<string[]>(`${this.baseUrl}/${id}/catalogo-clases`));
  }

  getClasesConHorariosDeGimnasio(id: string, fecha?: string): Promise<ClaseInterface[]> {
    let params = new HttpParams();
    if (fecha) params = params.set('fecha', fecha);
    return lastValueFrom(this.http.get<ClaseInterface[]>(`${this.baseUrl}/${id}/clases`, { params }));
  }
}
