import { Injectable } from '@angular/core';

type RolApp = 'CLIENTE' | 'ADMIN' | 'EMPLEADO' | 'ENTRENADOR' | 'DESCONOCIDO';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Alias en español para mantener consistencia con el proyecto
  cerrarSesion(): void {
    this.logout();
  }

  estaLogueado(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.leerPayload(token);
    const exp = payload?.exp;
    if (typeof exp === 'number') {
      const ahoraSeg = Math.floor(Date.now() / 1000);
      return exp > ahoraSeg;
    }
    return true;
  }

  getRol(): RolApp {
    const token = this.getToken();
    if (!token) return 'DESCONOCIDO';
    const payload = this.leerPayload(token);
    const rolesRaw = payload?.roles;
    const rolesStr = typeof rolesRaw === 'string' ? rolesRaw : String(rolesRaw ?? '');

    if (rolesStr.includes('ROLE_CLIENTE')) return 'CLIENTE';
    if (rolesStr.includes('ROLE_ADMIN')) return 'ADMIN';
    if (rolesStr.includes('ROLE_EMPLEADO')) return 'EMPLEADO';
    if (rolesStr.includes('ROLE_ENTRENADOR')) return 'ENTRENADOR';
    return 'DESCONOCIDO';
  }

  esCliente(): boolean {
    return this.getRol() === 'CLIENTE';
  }

  esStaff(): boolean {
    const rol = this.getRol();
    return rol === 'ADMIN' || rol === 'EMPLEADO' || rol === 'ENTRENADOR';
  }

  /**
   * Identificador estable para guardar preferencias del usuario (favoritos, etc.) en localStorage.
   * Intenta obtenerlo del token (sub/email/id). Si no existe, devuelve 'anonimo'.
   */
  getIdentificadorUsuario(): string {
    const token = this.getToken();
    if (!token) return 'anonimo';
    const payload = this.leerPayload(token);
    const id = payload?.id ?? payload?.sub ?? payload?.email;
    return typeof id === 'string' && id.trim().length > 0 ? id : 'anonimo';
  }

  private leerPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
