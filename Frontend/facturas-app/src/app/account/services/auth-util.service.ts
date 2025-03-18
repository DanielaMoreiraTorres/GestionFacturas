import { Injectable, signal } from '@angular/core';
import { ServicioDeCookiesSeguras } from './secure-cookie.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { EstadoAutenticacion, InicioSesion, Usuario } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class ServicioUtilidadesAutenticacion {
  private _usuarioActual = signal<Usuario | null>(null);
  private _estadoAutenticacion = signal<EstadoAutenticacion>(EstadoAutenticacion.comprobando);

  constructor(
    private servicioDeCookies: ServicioDeCookiesSeguras,
    private http: HttpClient
  ) { }

  public establecerAutenticacion(
    usuario: Usuario,
    token: string | null = null
  ): boolean {
    //console.log('user',user);
    this._usuarioActual.set(usuario);
    this._estadoAutenticacion.set(EstadoAutenticacion.autenticado);
    if (token) this.servicioDeCookies.establecerToken(token);
    return true;
  }

  public get usuarioActual() {
    return this._usuarioActual();
  }

  public get estadoDeAutenticacion() {
    return this._estadoAutenticacion();
  }

  public get cookie() {
    return this.servicioDeCookies;
  }

  public verificarEstadoAutenticacion(): Observable<boolean> {
    const url = 'Seguridad/verficarToken';
    const token = this.servicioDeCookies.obtenerToken();

    if (!token) {
      this.cerrarSesion();
      return of(false);
    }

    return this.http.get<InicioSesion>(url).pipe(
      map(({ datos, exito }) => {
        if (exito) {
          const { usuario, token } = datos;
          return this.establecerAutenticacion(usuario, token);
        }

        this._estadoAutenticacion.set(EstadoAutenticacion.noAutenticado);
        return false;
      }),
      catchError((err) => {
        console.error(err);
        this._estadoAutenticacion.set(EstadoAutenticacion.noAutenticado);
        return of(false);
      })
    );
  }

  public cerrarSesion() {
    this.servicioDeCookies.cerrarSesion();
    this._usuarioActual.set(null);
    this._estadoAutenticacion.set(EstadoAutenticacion.noAutenticado);
  }
}
