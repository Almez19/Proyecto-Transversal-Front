import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { ClienteInterface } from '../interfaces/cliente-interface';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private httpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:8080/api/clientes';

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }


  async getClienteById(id: UUIDTypes | string): Promise<ClienteInterface> {
    return lastValueFrom(this.httpClient.get<ClienteInterface>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() }));
  }
}
