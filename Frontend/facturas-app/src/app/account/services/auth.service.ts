import { HttpClient } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { ServicioUtilidadesAutenticacion } from './auth-util.service';
import { catchError, Observable, switchMap, throwError, of } from 'rxjs';
import { InicioSesion } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class ServicioAutenticacion {

  constructor(private http: HttpClient, private utilidadesAutenticacion: ServicioUtilidadesAutenticacion) {
    this.utilidadesAutenticacion.verificarEstadoAutenticacion().subscribe();
  }

  public usuarioActual = computed(() => this.utilidadesAutenticacion.usuarioActual);
  public estadoAutenticacion = computed(() => this.utilidadesAutenticacion.estadoDeAutenticacion);

  inicioSesion(usuario: string, contrasena: string): Observable<boolean> {
    return this.http
      .post<InicioSesion>('Seguridad/inicioSesion', {
        usuario,
        contrasena,
      })
      .pipe(
        switchMap(({ exito, mensaje, datos }) => {
          if (!exito) return throwError(() => mensaje);

          const { usuario, token } = datos;
          this.utilidadesAutenticacion.cookie.establecerToken(token);
          return of(this.utilidadesAutenticacion.establecerAutenticacion(usuario, token));
        }),
        catchError((err) => {
          this.utilidadesAutenticacion.cerrarSesion();
          return throwError(() => err);
        })
      );
  }

  estabecerUrlActual(url: string): void {
    this.utilidadesAutenticacion.cookie.estabecerUrlActual(url);
  }

  obtnerUrlActual(): string {
    return this.utilidadesAutenticacion.cookie.obtnerUrlActual() || '/';
  }

  cerrarSesion() {
    this.utilidadesAutenticacion.cerrarSesion();
  }
}
