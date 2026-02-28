import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth-service';
import { MembresiasService } from '../../service/membresias-service';

interface Plan {
  tipo: 'COMFORT' | 'PREMIUM' | 'ULTIMATE';
  nombre: string;
  precioMensual: number;
  descripcion: string;
  ventajas: string[];
}

@Component({
  selector: 'app-membresias',
  imports: [RouterLink, FormsModule],
  templateUrl: './membresias.html',
  styleUrl: './membresias.css',
})
export class MembresiasComponent {
  private auth = inject(AuthService);
  private membresias = inject(MembresiasService);
  private router = inject(Router);

  procesando = false;
  mensaje = '';
  error = '';

  get estaLogueado(): boolean {
    return this.auth.estaLogueado();
  }

  get esCliente(): boolean {
    return this.auth.esCliente();
  }

  /** Duración por defecto (puedes ampliarlo a un selector si quieres). */
  duracionSeleccionada: 'mensual' | 'trimestral' | 'anual' = 'mensual';

  planes: Plan[] = [
    {
      tipo: 'COMFORT',
      nombre: 'Comfort',
      precioMensual: 24.99,
      descripcion: 'Plan cómodo para entrenar a tu ritmo en tu club y mantener la constancia.',
      ventajas: [
        'Acceso ilimitado al club',
        'Entrena en España',
        'App con entrenamiento y progreso'
      ],
    },
    {
      tipo: 'PREMIUM',
      nombre: 'Premium',
      precioMensual: 29.99,
      descripcion: 'Para quienes viajan o quieren más flexibilidad: entrena en más clubes.',
      ventajas: [
        'Acceso ilimitado',
        'Entrena en Europa',
        'Más libertad para cambiar de gimnasio'
      ],
    },
    {
      tipo: 'ULTIMATE',
      nombre: 'Ultimate',
      precioMensual: 34.99,
      descripcion: 'El plan más completo: máxima flexibilidad y extras para exprimir tu entrenamiento.',
      ventajas: [
        'Entrena en Europa',
        'Invita a un amigo',
        'Extras (según club): masaje, Yanga, congelación'
      ],
    },
  ];

  precioPrincipal(plan: Plan): string {
    const total = this.precioTotal(plan);
    if (this.duracionSeleccionada === 'mensual') {
      return `${this.formatoEuros(plan.precioMensual)} / mes`;
    }
    if (this.duracionSeleccionada === 'trimestral') {
      return `${this.formatoEuros(total)} / trimestre`;
    }
    return `${this.formatoEuros(total)} / año`;
  }

  textoEquivalencia(plan: Plan): string {
    if (this.duracionSeleccionada === 'mensual') return 'Facturación mensual. Cancela cuando quieras.';
    const mensualEq = this.precioMensualEquivalente(plan);
    return `Equivale a ${this.formatoEuros(mensualEq)} / mes`;
  }

  private precioTotal(plan: Plan): number {
    const base = plan.precioMensual;
    if (this.duracionSeleccionada === 'mensual') return base;
    if (this.duracionSeleccionada === 'trimestral') return base * 3;
    return base * 12;
  }

  private precioMensualEquivalente(plan: Plan): number {
    // Sin descuentos: el equivalente es el mismo.
    return plan.precioMensual;
  }

  private formatoEuros(valor: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(valor);
  }

  async contratar(plan: Plan): Promise<void> {
    this.mensaje = '';
    this.error = '';
    if (!this.estaLogueado) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.esCliente) {
      this.error = 'Solo los clientes pueden contratar una membresía.';
      return;
    }

    const calidad = plan.tipo.toLowerCase(); // comfort/premium/ultimate
    const duracion = this.duracionSeleccionada;

    this.procesando = true;
    try {
      await this.membresias.contratar(duracion, calidad);
      this.mensaje = 'Membresía contratada correctamente.';
      // Llevar al perfil para ver la suscripción activa
      this.router.navigate(['/perfil/suscripcion']);
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'No se pudo contratar la membresía.';
    } finally {
      this.procesando = false;
    }
  }
}
