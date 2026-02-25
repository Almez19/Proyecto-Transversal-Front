import { UUIDTypes } from "uuid";

export interface EjercicioInterface {
  id: UUIDTypes;
  nombre: string;
  rutinaId: UUIDTypes | null;
  maquinaId: UUIDTypes | null;
}
