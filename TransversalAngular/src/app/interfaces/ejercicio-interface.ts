export interface EjercicioInterface {
  id: string;
  nombre: string;
  orden: number;
  series: number;
  repeticiones: number;
  peso?: number | null;
  descansoSegundos: number;
  notas?: string | null;
  rutinaId: string;
  maquinaId?: string | null;
}
