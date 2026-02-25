  //Definición del enum rol
  export enum Rol {
    ADMIN = 'ADMIN',
    EMPLEADO = 'EMPLEADO',
    ENTRENADOR = 'ENTRENADOR',
    CLIENTE = 'CLIENTE'

}

export interface RolInterface {

    rol : Rol;
}
