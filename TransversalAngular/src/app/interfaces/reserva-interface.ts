export type EstadoReserva = 'activa' | 'cancelada';

export interface ReservaInterface {
  id: string;
  clienteId?: string;
  dniNie?: string;
  claseId: string;
  estado: EstadoReserva;
  fechaCreacion?: string;
  fechaCancelacion?: string | null;
  motivoCancelacion?: string | null;
}
