import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { API_URL } from '../config/api';
import { MaquinasInterface } from '../interfaces/maquinas-interface';

@Injectable({ providedIn: 'root' })
export class MaquinasService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/maquinas`;

  getMaquinaById(id: string): Promise<MaquinasInterface> {
    return lastValueFrom(this.http.get<MaquinasInterface>(`${this.baseUrl}/${id}`));
  }
}
