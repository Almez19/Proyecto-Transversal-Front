export interface ClienteInterface {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;

   dniNie?: string;
   dni_nie?: string;
   telefono?: string | null;
   fechaNacimiento?: string | null;
   fecha_nacimiento?: string | null;
   ciudad?: string | null;
   estado?: boolean;
   fechaCreacion?: string;
   fecha_creacion?: string;
}
