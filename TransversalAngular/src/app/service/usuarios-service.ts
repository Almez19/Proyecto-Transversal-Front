import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { UsuarioInterface } from '../interfaces/usuario-interface';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/usuarios`;

  getUsuarioById(id: string): Promise<UsuarioInterface> {
    return lastValueFrom(this.http.get<UsuarioInterface>(`${this.baseUrl}/${id}`));
  }
}
