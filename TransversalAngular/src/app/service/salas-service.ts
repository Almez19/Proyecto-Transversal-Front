import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { SalaInterface } from '../interfaces/sala-interface';

@Injectable({ providedIn: 'root' })
export class SalasService {
  private httpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:8080/api/salas';

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }


  async getSalaById(id: UUIDTypes | string): Promise<SalaInterface> {
    return lastValueFrom(this.httpClient.get<SalaInterface>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() }));
  }
}
