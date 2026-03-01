import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ClaseInterface } from '../../../interfaces/clase-interface';
import { SalasService } from '../../../service/salas-service';
import { UsuariosService } from '../../../service/usuarios-service';

@Component({
  selector: 'app-clases-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clases-card.html',
  styleUrls: ['./clases-card.css']
})
export class ClasesCard {
  @Input() clase!: ClaseInterface;

  private salasService = inject(SalasService);
  private usuariosService = inject(UsuariosService);

  public textoSala: string = '';
  public textoEntrenador: string = '';

  async ngOnInit(): Promise<void> {
    await this.resolverNombresRelacionados();
  }

  private async resolverNombresRelacionados(): Promise<void> {
    // Sala
    const salaId = this.obtenerSalaId();
    if (salaId) {
      try {
        const sala = await this.salasService.getSalaById(salaId);
        const numeroSala = (sala as any).numero_sala ?? (sala as any).numeroSala;
        this.textoSala = numeroSala != null ? `Sala ${numeroSala}` : `Sala (${salaId})`;
      } catch {
        this.textoSala = `Sala (${salaId})`;
      }
    }

    // Entrenador
    const entrenadorId = this.obtenerEntrenadorId();
    if (entrenadorId) {
      try {
        const usuario = await this.usuariosService.getUsuarioById(entrenadorId);
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2}`.trim();
        this.textoEntrenador = nombreCompleto || `Entrenador (${entrenadorId})`;
      } catch {
        this.textoEntrenador = `Entrenador (${entrenadorId})`;
      }
    }
  }

  obtenerDeporte(): string {
    return (this.clase as any).deporte ?? 'Clase';
  }

  obtenerFecha(): string {
    return (this.clase as any).fecha ?? '';
  }

  obtenerHoraInicio(): string {
    return (this.clase as any).hora_inicio ?? (this.clase as any).horaInicio ?? '';
  }

  obtenerHoraFinal(): string {
    return (this.clase as any).hora_final ?? (this.clase as any).horaFinal ?? '';
  }

  obtenerSalaId(): string {
    return (this.clase as any).sala_id ?? (this.clase as any).salaId ?? '';
  }

  obtenerEntrenadorId(): string {
    return (this.clase as any).id_usuarios_c ?? (this.clase as any).idUsuariosC ?? '';
  }

  formatearFecha(valorFecha: string): string {
    if (!valorFecha) return '';
    const partes = valorFecha.split('-');
    if (partes.length === 3) {const [yyyy, mm, dd] = partes;
      return `${dd}/${mm}/${yyyy}`;
    }
    return valorFecha;
  }

  formatearHora(valorHora: string): string {
    if (!valorHora) return '';
    if (valorHora.includes(' ')) {const hora = valorHora.split(' ')[1] ?? '';
      return hora.substring(0, 5);
    }
    if (valorHora.includes('T')) {const hora = valorHora.split('T')[1] ?? '';
      return hora.substring(0, 5);
    }
    return valorHora.substring(0, 5);
  }
}
