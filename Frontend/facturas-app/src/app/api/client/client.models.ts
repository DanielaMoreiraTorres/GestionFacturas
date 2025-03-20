export interface DatosCliente {
    id: number;
    nombre: string;
    tipoIdentificacion: number;
    identificacion: string;
    telefono: string;
    correo: string;
    direccion: string;
    usuarioCreacion: number;
    usuarioActualizacion?: number;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
    //activo: boolean;
  }