import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FavoritosService, RutinaPersonalizada } from '../../service/favoritos-service';
import { GimnasioService } from '../../service/gimnasio-service';
import { Igimnasio } from '../../interfaces/igimnasio';
import { MaquinasInterface } from '../../interfaces/maquinas-interface';
// TextoEnumPipe no se usa en el template de este componente.

type EjercicioForm = RutinaPersonalizada['ejercicios'][number];

@Component({
  selector: 'app-rutina-crear',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './rutina-crear.html',
  styleUrl: './rutina-crear.css',
})
export class RutinaCrearComponent implements OnInit {
  private favoritos = inject(FavoritosService);
  private gimnasioService = inject(GimnasioService);
  private router = inject(Router);

  cargando = true;
  error = '';
  mensaje = '';

  gimnasios: Igimnasio[] = [];
  gimnasioSeleccionadoId = '';
  maquinas: MaquinasInterface[] = [];

  nombre = '';
  objetivo = 'salud';
  nivel = 'principiante';
  diasPorSemana = 3;
  notas = '';

  ejercicios: EjercicioForm[] = [this.nuevoEjercicio()];

  async ngOnInit(): Promise<void> {
    await this.cargarGimnasios();
  }

  async cargarGimnasios(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      this.gimnasios = await this.gimnasioService.getAllGimnasios();
    } catch (error: any) {
      this.error = error?.message ?? 'No se pudieron cargar los gimnasios.';
    } finally {
      this.cargando = false;
    }
  }

  async onCambioGimnasio(): Promise<void> {
    this.maquinas = [];
    if (!this.gimnasioSeleccionadoId) return;
    try {
      this.maquinas = await this.gimnasioService.getMaquinasDeGimnasio(this.gimnasioSeleccionadoId);
    } catch (error: any) {
      // Si falla, no bloqueamos la creación de rutina (las máquinas son ayuda opcional)
      console.warn('No se pudieron cargar máquinas del gimnasio:', error);
      this.maquinas = [];
    }
  }

  nuevoEjercicio(): EjercicioForm {
    return {
      nombre: '',
      grupoMuscular: 'cuerpo_completo',
      maquinaId: null,
      series: 3,
      repeticiones: 10,
      peso: null,
      descansoSegundos: 60,
      notas: '',
    };
  }

  agregarEjercicio(): void {
    this.ejercicios.push(this.nuevoEjercicio());
  }

  eliminarEjercicio(indice: number): void {
    if (this.ejercicios.length === 1) return;
    this.ejercicios.splice(indice, 1);
  }

  onSeleccionMaquina(indice: number): void {
    const ejercicio = this.ejercicios[indice];
    if (!ejercicio.maquinaId) return;
    const maquina = this.maquinas.find((m) => m.id === ejercicio.maquinaId);
    if (!maquina) return;
    if (!ejercicio.nombre.trim()) ejercicio.nombre = maquina.nombre;
    if (maquina.grupoMuscular) ejercicio.grupoMuscular = maquina.grupoMuscular;
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.nombre.trim()) {
      this.error = 'El nombre de la rutina es obligatorio.';
      return;
    }

    const ejerciciosValidos = this.ejercicios.filter((e) => e.nombre.trim().length > 0);
    if (ejerciciosValidos.length === 0) {
      this.error = 'Añade al menos un ejercicio con nombre.';
      return;
    }

    const rutina: RutinaPersonalizada = {
      id: this.generarIdRutina(),
      nombre: this.nombre.trim(),
      objetivo: this.objetivo,
      nivel: this.nivel,
      diasPorSemana: this.diasPorSemana,
      notas: this.notas?.trim() || undefined,
      ejercicios: ejerciciosValidos.map((e) => ({
        ...e,
        nombre: e.nombre.trim(),
        notas: e.notas?.trim() || undefined,
      })),
      fechaCreacionIso: new Date().toISOString(),
    };

    this.favoritos.guardarRutinaPersonalizada(rutina);
    this.mensaje = 'Rutina guardada en Mis rutinas.';
    this.router.navigate(['/perfil/rutinas']);
  }

  private generarIdRutina(): string {
    const cryptoAny = crypto as any;
    if (cryptoAny?.randomUUID) return cryptoAny.randomUUID();
    return `rut_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  }
}
