import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { ClienteInterface } from '../interfaces/cliente-interface';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/clientes`;

  private miCuentaUrl = `${API_URL}/mi-cuenta`;

  getMiPerfil(): Promise<ClienteInterface> {
    return lastValueFrom(this.http.get<ClienteInterface>(`${this.miCuentaUrl}/perfil`));
  }

  actualizarMiPerfil(payload: Partial<ClienteInterface> & { dniNie?: string; dni_nie?: string }): Promise<ClienteInterface> {
    return lastValueFrom(this.http.put<ClienteInterface>(`${this.miCuentaUrl}/perfil`, payload));
  }

  cambiarContrasena(actual: string, nueva: string): Promise<void> {
    return lastValueFrom(this.http.put<void>(`${this.miCuentaUrl}/perfil/password`, { actual, nueva }));
  }


  getClienteById(id: string): Promise<ClienteInterface> {
    return lastValueFrom(this.http.get<ClienteInterface>(`${this.baseUrl}/${id}`));
  }
}
