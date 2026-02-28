import { Nivel } from './clase-interface';

export type ObjetivoRutina = 'perder_grasa' | 'ganar_masa' | 'mantenimiento' | 'salud';

export interface RutinaInterface {
  id: string;
  nombre: string;
  objetivo: ObjetivoRutina;
  nivel: Nivel;
  diasPorSemana: number;
  notas?: string | null;
  clienteId?: string;
  clienteDniNie?: string;
  entrenadorId?: string | null;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
