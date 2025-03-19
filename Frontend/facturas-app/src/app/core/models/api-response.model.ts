export interface Respuesta<T> {
  exito: boolean;
  mensaje: string;
  errores?: string[];
  datos: T | null;
}
