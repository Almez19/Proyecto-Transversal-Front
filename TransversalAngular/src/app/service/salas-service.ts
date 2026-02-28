import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { SalaInterface } from '../interfaces/sala-interface';

@Injectable({ providedIn: 'root' })
export class SalasService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/salas`;

  getSalaById(id: string): Promise<SalaInterface> {
    return lastValueFrom(this.http.get<SalaInterface>(`${this.baseUrl}/${id}`));
  }
}
