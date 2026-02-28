import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { NoticiasInterface } from '../interfaces/noticias-interface';
import { API_URL } from '../config/api';

@Injectable({
  providedIn: 'root',
})
export class NoticiasService {

  private httpClient = inject(HttpClient);

  baseURL: string = `${API_URL}/noticias`;

  constructor() {}

  async getAllNoticias(): Promise<NoticiasInterface[]>{
    const resp = await lastValueFrom(
      this.httpClient.get<NoticiasInterface[]>(this.baseURL)
    );
    return resp;
  }

  async getNoticiasById(id: string): Promise<NoticiasInterface>{
    return lastValueFrom(this.httpClient.get<NoticiasInterface>(`${this.baseURL}/${id}`))
  }

	/**
	 * Detalle público: en el back, /noticias/{id} requiere login.
	 * Para mantener la página de detalle pública, usamos el listado y filtramos.
	 */
	async getNoticiaByIdPublic(id: string): Promise<NoticiasInterface | null> {
		const all = await this.getAllNoticias();
		return all.find((n) => n.id === id) ?? null;
	}

  async getUltimasNoticias(): Promise<NoticiasInterface[]>{
    const resp = await lastValueFrom(
      this.httpClient.get<NoticiasInterface[]>(`${this.baseURL}/ultimas`)
    );
    return resp;
  }


}
