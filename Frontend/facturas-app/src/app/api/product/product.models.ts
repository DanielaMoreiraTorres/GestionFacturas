export interface DatosProducto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    usuarioCreacion: number;
    usuarioActualizacion?: number;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
    //activo: boolean;
  }