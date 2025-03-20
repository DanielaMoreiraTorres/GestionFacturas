import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Respuesta } from 'src/app/core/models/api-response.model';
import { DatosCliente } from './client.models';
import { Peticion } from 'src/app/core/models/peticion.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteServicio {
  constructor(private http: HttpClient) { }

  guardarCliente(modelo: any): Observable<string | null> {
    return this.http.post<Respuesta<any>>(`Cliente/nuevo`, modelo).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al guardar cliente');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  modificarCliente(id: number, modelo: any): Observable<string | null> {
    return this.http.put<Respuesta<any>>(`Cliente/modificar/${id}`, modelo).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al actualizar cliente');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  eliminarCliente(id: number): Observable<string | null> {
    return this.http.delete<Respuesta<any>>(`Cliente/eliminar/${id}`).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al eliminar cliente');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  obtenerClientePorId(id: number): Observable<DatosCliente | null> {
    return this.http.get<Respuesta<DatosCliente>>(`Cliente/obtener/${id}`).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(
            response.mensaje ||
            'Error al obtener ciente'
          );
        }

        return response?.datos;

      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  obtenerClientes(peticion: Peticion): Observable<DatosCliente[] | null> {
    return this.http.post<Respuesta<any>>(`Cliente`, peticion).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(
            response.errores && response.errores[0]
              ? response.errores[0]
              : response.mensaje ||
              'Error al obtener clientes'
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
