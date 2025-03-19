import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Respuesta } from 'src/app/core/models/api-response.model';
import { DatosUsuario } from './user.models';
import { Peticion } from 'src/app/core/models/peticion.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  constructor(private http: HttpClient) { }

  guardarUsuario(modelo: any): Observable<string | null> {
    return this.http.post<Respuesta<any>>(`Usuario/nuevo`, modelo).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al guardar usuario');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  modificarUsuario(id: number, modelo: any): Observable<string | null> {
    return this.http.put<Respuesta<any>>(`Usuario/modificar/${id}`, modelo).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al actualizar usuario');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  eliminarUsuario(id: number): Observable<string | null> {

    return this.http.delete<Respuesta<any>>(`Usuario/eliminar/${id}`).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al eliminar usuario');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  obtenerUsuarioPorId(id: number): Observable<DatosUsuario | null> {
    return this.http.get<Respuesta<DatosUsuario>>(`Usuario/obtener/${id}`).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(
            response.mensaje ||
            'Error al obtener usuario'
          );
        }

        return response?.datos;

      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  obtenerUsuarios(peticion: Peticion): Observable<DatosUsuario[] | null> {
    return this.http.post<Respuesta<any>>(`Usuario`, peticion).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(
            response.errores && response.errores[0]
              ? response.errores[0]
              : response.mensaje ||
              'Error al obtener usuarios'
          );
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
