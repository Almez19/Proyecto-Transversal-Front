import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface RutinaCatalogoInterface {
  id: string;
  nombre: string;
  objetivo: string;
  nivel: string;
  diasPorSemana: number;
  duracionMinutos: number;
  descripcion: string;
  puntosClave: string[];
  ejerciciosEjemplo: string[];
  imagenUrl?: string | null;
  plan?: Array<{
    orden: number;
    nombre: string;
    tipo: string;
    maquinaSugerida: string;
    series: number;
    repeticiones: number;
    pesoSugerido?: string | null;
    descansoSegundos: number;
    explicacion: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class CatalogoRutinasService {
  private http = inject(HttpClient);
  private cache: RutinaCatalogoInterface[] | null = null;

  async getCatalogoRutinas(): Promise<RutinaCatalogoInterface[]> {
    if (this.cache) return this.cache;
    const catalogo = await lastValueFrom(
      this.http.get<RutinaCatalogoInterface[]>('/assets/catalogo-rutinas.json')
    );
    this.cache = catalogo;
    return catalogo;
  }
}
