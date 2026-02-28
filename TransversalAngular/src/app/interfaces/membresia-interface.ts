export interface MembresiaInterface {
  id: string;
  // En BD/back: duracion, calidad, precio, fechas
  duracion?: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual' | string;
  calidad?: 'comfort' | 'premium' | 'ultimate' | string;
  precio?: number;
  fechaInicio?: string;
  fechaFinal?: string;

  // Compatibilidad con nombres antiguos usados en partes del front
  tipo?: string;
  fechaFin?: string | null;
  precioMensual?: number | null;

  estado: boolean;
  clienteId?: string;
}
