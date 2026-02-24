import { UUIDTypes } from "uuid";

export interface ReservaInterface {

    id : UUIDTypes;
    cliente_id : UUIDTypes;
    clase_id : UUIDTypes;
    estado : boolean;

    /**
     * Tabla como referencia
     *   id CHAR(36) PRIMARY KEY, -- UUID
        cliente_id CHAR(36) NOT NULL, -- UUID
        clase_id CHAR(36) NOT NULL, -- UUID
        estado BOOLEAN NOT NULL DEFAULT TRUE,

     */
}
