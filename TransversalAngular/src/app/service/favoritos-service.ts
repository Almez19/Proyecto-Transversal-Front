import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth-service';

export interface RutinaPersonalizada {
  id: string;
  nombre: string;
  objetivo: string;
  nivel: string;
  diasPorSemana: number;
  notas?: string;
  ejercicios: Array<{
    nombre: string;
    grupoMuscular?: string;
    maquinaId?: string | null;
    series: number;
    repeticiones: number;
    peso?: number | null;
    descansoSegundos: number;
    notas?: string;
  }>;
  fechaCreacionIso: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private auth = inject(AuthService);

  private claveUsuario(sufijo: string): string {
    const identificador = this.auth.getIdentificadorUsuario();
    return `basifit_${identificador}_${sufijo}`;
  }

  // -----------------
  // Gimnasios
  // -----------------
  obtenerMisGimnasiosIds(): string[] {
    return this.leerArray(this.claveUsuario('mis_gimnasios'));
  }

  guardarGimnasio(id: string): void {
    const ids = new Set(this.obtenerMisGimnasiosIds());
    ids.add(id);
    this.guardarArray(this.claveUsuario('mis_gimnasios'), Array.from(ids));
  }

  quitarGimnasio(id: string): void {
    const ids = new Set(this.obtenerMisGimnasiosIds());
    ids.delete(id);
    this.guardarArray(this.claveUsuario('mis_gimnasios'), Array.from(ids));
  }

  esGimnasioGuardado(id: string): boolean {
    return this.obtenerMisGimnasiosIds().includes(id);
  }

  // -----------------
  // Rutinas de catálogo
  // -----------------
  obtenerRutinasCatalogoIds(): string[] {
    return this.leerArray(this.claveUsuario('rutinas_catalogo'));
  }

  guardarRutinaCatalogo(id: string): void {
    const ids = new Set(this.obtenerRutinasCatalogoIds());
    ids.add(id);
    this.guardarArray(this.claveUsuario('rutinas_catalogo'), Array.from(ids));
  }

  quitarRutinaCatalogo(id: string): void {
    const ids = new Set(this.obtenerRutinasCatalogoIds());
    ids.delete(id);
    this.guardarArray(this.claveUsuario('rutinas_catalogo'), Array.from(ids));
  }

  esRutinaCatalogoGuardada(id: string): boolean {
    return this.obtenerRutinasCatalogoIds().includes(id);
  }

  // -----------------
  // Rutinas personalizadas
  // -----------------
  obtenerRutinasPersonalizadas(): RutinaPersonalizada[] {
    const clave = this.claveUsuario('rutinas_personalizadas');
    try {
      const raw = localStorage.getItem(clave);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as RutinaPersonalizada[]) : [];
    } catch {
      return [];
    }
  }

  guardarRutinaPersonalizada(rutina: RutinaPersonalizada): void {
    const rutinas = this.obtenerRutinasPersonalizadas();
    const index = rutinas.findIndex((r) => r.id === rutina.id);
    if (index >= 0) rutinas[index] = rutina;
    else rutinas.unshift(rutina);

    localStorage.setItem(this.claveUsuario('rutinas_personalizadas'), JSON.stringify(rutinas));
  }

  eliminarRutinaPersonalizada(id: string): void {
    const rutinas = this.obtenerRutinasPersonalizadas().filter((r) => r.id !== id);
    localStorage.setItem(this.claveUsuario('rutinas_personalizadas'), JSON.stringify(rutinas));
  }

  
  /**
   * Si el usuario guardó cosas sin estar logueado, las guardamos bajo 'anonimo'.
   * Al iniciar sesión, migramos esos datos al usuario real.
   */
  migrarDesdeAnonimo(): void {
    const identificador = this.auth.getIdentificadorUsuario();
    if (!identificador || identificador === 'anonimo') return;

    const claves = ['mis_gimnasios', 'rutinas_catalogo', 'rutinas_personalizadas'];

    for (const sufijo of claves) {
      const claveAnon = `basifit_anonimo_${sufijo}`;
      const claveUser = this.claveUsuario(sufijo);

      const rawAnon = localStorage.getItem(claveAnon);
      if (!rawAnon) continue;

      try {
        const anonParsed = JSON.parse(rawAnon);

        // Arrays de strings
        if (sufijo !== 'rutinas_personalizadas') {
          const anonArr = Array.isArray(anonParsed) ? anonParsed : [];
          const userArr = this.leerArray(claveUser);
          const merged = Array.from(new Set([...(userArr || []), ...(anonArr || [])]));
          this.guardarArray(claveUser, merged);
        } else {
          // Rutinas personalizadas: array de objetos
          const anonArr = Array.isArray(anonParsed) ? anonParsed : [];
          const userArr = this.obtenerRutinasPersonalizadas();
          const mapa = new Map<string, any>();
          for (const r of userArr) mapa.set(r.id, r);
          for (const r of anonArr) {
            if (r && typeof r.id === 'string') mapa.set(r.id, r);
          }
          localStorage.setItem(claveUser, JSON.stringify(Array.from(mapa.values())));
        }

        localStorage.removeItem(claveAnon);
      } catch {
        // si está corrupto, lo ignoramos
        localStorage.removeItem(claveAnon);
      }
    }
  }

  // -----------------
  // Helpers
  // -----------------
  private leerArray(clave: string): string[] {
    try {
      const raw = localStorage.getItem(clave);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  }

  private guardarArray(clave: string, valores: string[]): void {
    localStorage.setItem(clave, JSON.stringify(valores));
  }
}
