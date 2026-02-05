import { UUIDTypes } from "uuid";


export interface NoticiasInterface {

    id: UUIDTypes;
    titulo: string;
    cuerpo : string;
    urlImagen: string;
    fecha: Date;
    gimnasioId: UUIDTypes;
    
    /**
     * Estructura para referencia
     * create table noticias(
     *   id CHAR(36) PRIMARY KEY, -- UUID
     *   titulo varchar(50) NOT NULL,
     *   cuerpo TEXT NOT NULL,
     *   urlImagen TEXT NOT NULL,
     *   fecha DATETIME NOT NULL,
     *   gimnasio_id CHAR(36), -- UUID
     *   constraint gimnasio_id foreign key (gimnasio_id) References Gimnasios(id)
            );
     * 
     */

}
