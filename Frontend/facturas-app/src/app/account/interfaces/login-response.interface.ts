import { Usuario } from "./user-login.interface";

export interface InicioSesion {
    exito: boolean,
    mensaje: string,
    errores?: any[],
    datos: DatosUsuario
}

export interface DatosUsuario {
    usuario: Usuario,
    token: string,
    refreshToken: string,
    expiracionToken: string
}
