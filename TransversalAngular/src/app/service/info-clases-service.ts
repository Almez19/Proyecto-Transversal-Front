import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface InfoClase {
  queTrabajas: string[];
  beneficios: string[];
  recomendaciones: string[];
}

@Injectable({ providedIn: 'root' })
export class InfoClasesService {
  private http = inject(HttpClient);
  private cache: Record<string, InfoClase> | null = null;

  async getInfoClases(): Promise<Record<string, InfoClase>> {
    if (this.cache) return this.cache;
    const data = await lastValueFrom(
      this.http.get<Record<string, InfoClase>>('/assets/info-clases.json')
    );
    this.cache = data;
    return data;
  }
}
