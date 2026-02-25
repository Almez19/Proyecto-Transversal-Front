import { UUIDTypes } from "uuid";

export interface ReservaInterface {
  id: UUIDTypes;
  clienteId: UUIDTypes;
  claseId: UUIDTypes;
  estado: boolean;
}
