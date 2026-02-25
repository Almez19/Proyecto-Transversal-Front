import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { UsuarioInterface } from '../interfaces/usuario-interface';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private httpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:8080/api/usuarios';

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }


  async getUsuarioById(id: UUIDTypes | string): Promise<UsuarioInterface> {
    return lastValueFrom(this.httpClient.get<UsuarioInterface>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() }));
  }
}
