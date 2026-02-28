export type Nivel = 'principiante' | 'intermedio' | 'avanzado';
export type EstadoClase = 'programada' | 'cancelada' | 'finalizada';

export interface ClaseInterface {
  id: string;
  nombre: string;
  descripcion?: string | null;
  nivel: Nivel;
  fecha: string;
  horaInicio: string;
  horaFinal: string;
  duracionMinutos: number;
  capacidad: number;
  estado: EstadoClase;
  salaId: string;
  entrenadorId: string;
  gimnasioId: string;
  fechaCreacion?: string;
}

export interface CatalogoClaseInterface {
  id: string;
  nombre: string;
  descripcion: string;
  nivelRecomendado: Nivel;
  urlImagen?: string | null;
  estado: boolean;
}
