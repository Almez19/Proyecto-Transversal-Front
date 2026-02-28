import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Igimnasio } from '../../interfaces/igimnasio';
import { GimnasioService } from '../../service/gimnasio-service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TextoEnumPipe } from '../../pipes/texto-enum.pipe';
import { MaquinasInterface } from '../../interfaces/maquinas-interface';
import { FavoritosService } from '../../service/favoritos-service';
import { AuthService } from '../../service/auth-service';
import { ClasesService } from '../../service/clases-service';
import { ClaseInterface } from '../../interfaces/clase-interface';

@Component({
  selector: 'app-gimnasio-info',
  imports: [RouterLink, RouterModule, CommonModule, FormsModule, TextoEnumPipe],
  templateUrl: './gimnasio-info.html',
  styleUrl: './gimnasio-info.css',
})
export class GimnasioInfo implements OnInit {

  gimnasio!: Igimnasio;

  maquinas: MaquinasInterface[] = [];
  filtroMaquinaTexto = '';
  filtroGrupoMuscular = '';

  clases: ClaseInterface[] = [];
  cargandoClases = false;
  errorClases: string | null = null;

  gimnasioService = inject(GimnasioService);
  clasesService = inject(ClasesService);
  favoritosService = inject(FavoritosService);
  authService = inject(AuthService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {
      const id: string = params['id'];

      if (!id) return;

      const response = await this.gimnasioService.getGimnasioById(id);
      if (!response) return;

      this.gimnasio = response;
      await this.cargarMaquinas();

      await this.cargarClases();

      this.cdr.detectChanges();
    });
  }

  get estaLogueado(): boolean {
    return this.authService.estaLogueado();
  }

  get esCliente(): boolean {
    return this.authService.esCliente();
  }

  get guardado(): boolean {
    if (!this.gimnasio) return false;
    return this.favoritosService.esGimnasioGuardado(this.gimnasio.id);
  }

  alternarGuardar(): void {
    if (!this.estaLogueado) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.guardado) this.favoritosService.quitarGimnasio(this.gimnasio.id);
    else this.favoritosService.guardarGimnasio(this.gimnasio.id);
  }

  async cargarMaquinas(): Promise<void> {
    try {
      this.maquinas = await this.gimnasioService.getMaquinasDeGimnasio(this.gimnasio.id);
    } catch (error: any) {
      console.warn('No se pudieron cargar máquinas:', error);
      this.maquinas = [];
    }
  }

  get maquinasFiltradas(): MaquinasInterface[] {
    const texto = this.filtroMaquinaTexto.trim().toLowerCase();
    return this.maquinas
      .filter((m) => {
        if (!this.filtroGrupoMuscular) return true;
        return (m.grupoMuscular ?? '').toLowerCase() === this.filtroGrupoMuscular;
      })
      .filter((m) => {
        if (!texto) return true;
        return m.nombre.toLowerCase().includes(texto) || m.descripcion.toLowerCase().includes(texto);
      });
  }

  async cargarClases(): Promise<void> {
    this.cargandoClases = true;
    this.errorClases = null;
    try {
      this.clases = await this.clasesService.getClasesPorGimnasio(this.gimnasio.id);
    } catch (error: any) {
      this.errorClases = error?.message ?? 'No se pudieron cargar las clases del gimnasio.';
      this.clases = [];
    } finally {
      this.cargandoClases = false;
    }
  }

  formatearHora(hora: string): string {
    return hora?.slice(0, 5) ?? '';
  }

  esClaseFutura(clase: ClaseInterface): boolean {
    const fecha = (clase.fecha || '').slice(0, 10);
    if (!fecha) return true;
    const hora = (clase.horaInicio || '00:00:00').toString();
    const dt = new Date(`${fecha}T${hora}`);
    return dt.getTime() >= Date.now();
  }

  async reservar(claseId: string): Promise<void> {
    if (!this.estaLogueado) {
      this.router.navigate(['/login']);
      return;
    }

    // Evita llamadas al backend con cuentas de staff (provocan 500 por "cliente no existe").
    if (!this.esCliente) {
      alert('Solo los clientes pueden reservar clases. Inicia sesión con una cuenta de cliente.');
      return;
    }

    const clase = this.clases.find((c) => c.id === claseId);
    if (clase && !this.esClaseFutura(clase)) {
      alert('Esta clase ya ha pasado. Elige una clase futura.');
      return;
    }
    try {
      await this.clasesService.reservarClase(claseId);
      await this.cargarClases();
    } catch (error: any) {
      const msg = error?.error?.message || error?.message || 'No se pudo reservar la clase.';
      alert(msg);
    }
  }

}
