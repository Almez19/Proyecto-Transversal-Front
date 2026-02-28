import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';

export interface RegistroRequest {
  nombre: string;
  apellidos: string;
  email: string;
  dniNie: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthPublicService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/auth`;

  registrarCliente(body: RegistroRequest): Promise<void> {
    return lastValueFrom(this.http.post<void>(`${this.baseUrl}/registro`, body));
  }

  solicitarResetPassword(email: string): Promise<void> {
    return lastValueFrom(this.http.post<void>(`${this.baseUrl}/recuperar-contrasena`, { email }));
  }
}
