import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { NoticiasInterface } from '../interfaces/noticias-interface';

@Injectable({
  providedIn: 'root',
})
export class NoticiasService {

  private httpClient = inject(HttpClient);

  baseURL: string = 'http://localhost:8080/api/noticias';

  constructor() {}

  async getAllNoticias(): Promise<NoticiasInterface[]>{
    const resp = await lastValueFrom(
      this.httpClient.get<NoticiasInterface[]>(this.baseURL)
    );
    console.log("Respuesta", resp);
    return resp;
  }

  async getNoticiasById(id: string): Promise<NoticiasInterface>{
    return lastValueFrom(this.httpClient.get<NoticiasInterface>(`${this.baseURL}/${id}`))
  }

  async getUltimasNoticias(): Promise<NoticiasInterface[]>{
    const resp = await lastValueFrom(
      this.httpClient.get<NoticiasInterface[]>(`${this.baseURL}/ultimas`)
    );
    return resp;
  }


}
