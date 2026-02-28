import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textoEnum',
  standalone: true,
})
export class TextoEnumPipe implements PipeTransform {
  transform(valor: unknown): string {
    if (typeof valor !== 'string') return '';
    const normalizado = valor.trim();
    if (!normalizado) return '';

    const mapa: Record<string, string> = {
      // Objetivo rutinas
      perder_grasa: 'Pérdida de grasa',
      ganar_masa: 'Ganar masa muscular',
      ganar_musculo: 'Ganar músculo',
      mantenimiento: 'Mantenimiento',
      salud: 'Salud',

      // Niveles
      principiante: 'Principiante',
      intermedio: 'Intermedio',
      avanzado: 'Avanzado',

      // Grupo muscular
      pecho: 'Pecho',
      espalda: 'Espalda',
      pierna: 'Pierna',
      hombro: 'Hombro',
      brazo: 'Brazo',
      core: 'Core',
      cardio: 'Cardio',
      cuerpo_completo: 'Cuerpo completo',

      // Estado reserva
      activa: 'Activa',
      cancelada: 'Cancelada',

      // Estado clase
      programada: 'Programada',
      finalizada: 'Finalizada',
      cancelada_clase: 'Cancelada',
    };

    if (mapa[normalizado]) return mapa[normalizado];

    // Fallback: "ganar_masa" -> "Ganar masa"
    return normalizado
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  }
}
