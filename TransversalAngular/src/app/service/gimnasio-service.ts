import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Igimnasio } from '../interfaces/igimnasio';
import { last, lastValueFrom } from 'rxjs';
import { UUIDTypes } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class GimnasioService {
  
  private httpCient = inject(HttpClient);

  baseUrl: string = 'http://localhost:8080/api/gimnasios';

  constructor(){}

  async getAllGimnasios(): Promise<Igimnasio[]>{
  const resp = await lastValueFrom(
    this.httpCient.get<Igimnasio[]>(this.baseUrl)
  );
  console.log("RESPUESTA:", resp);
  return resp;
  }

  async eliminarGimnasioId(id: UUIDTypes): Promise<Igimnasio>{
    return lastValueFrom(this.httpCient.delete<Igimnasio>(`${this.baseUrl}/${id}`));
  }

  async getGimnasioById(id: UUIDTypes): Promise <Igimnasio>{
    return lastValueFrom(this.httpCient.get<Igimnasio>(`${this.baseUrl}/${id}`));
  }

  async updateGimnasios(gimnasio: Igimnasio): Promise<Igimnasio>{
    return lastValueFrom(this.httpCient.put<Igimnasio>(`${this.baseUrl}${gimnasio.id}`, gimnasio));
  }

  async createGimnasio(gimnasio: Igimnasio): Promise<Igimnasio>{
    return lastValueFrom(this.httpCient.post<Igimnasio>(`${this.baseUrl}`, gimnasio));
  }

  async deleteGimnasio(id: UUIDTypes): Promise<Igimnasio>{
    return lastValueFrom(this.httpCient.delete<Igimnasio>(`${this.baseUrl}/${id}`));
  }


}
