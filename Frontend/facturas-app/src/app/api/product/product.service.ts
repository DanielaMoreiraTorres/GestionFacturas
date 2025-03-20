import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Respuesta } from 'src/app/core/models/api-response.model';
import { DatosProducto } from './product.models';
import { Peticion } from 'src/app/core/models/peticion.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoServicio {
  constructor(private http: HttpClient) { }

  guardarProducto(modelo: any): Observable<string | null> {
    return this.http.post<Respuesta<any>>(`Producto/nuevo`, modelo).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al guardar producto');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  modificarProducto(id: number, modelo: any): Observable<string | null> {
    return this.http.put<Respuesta<any>>(`Producto/modificar/${id}`, modelo).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al actualizar producto');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  eliminarProducto(id: number): Observable<string | null> {
    return this.http.delete<Respuesta<any>>(`Producto/eliminar/${id}`).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(response.mensaje || 'Error al eliminar producto');
        }

        return response?.datos || null;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  obtenerProductoPorId(id: number): Observable<DatosProducto | null> {
    return this.http.get<Respuesta<DatosProducto>>(`Producto/obtener/${id}`).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(
            response.mensaje ||
            'Error al obtener producto'
          );
        }

        return response?.datos;

      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  obtenerProductos(peticion: Peticion): Observable<DatosProducto[] | null> {
    return this.http.post<Respuesta<any>>(`Producto`, peticion).pipe(
      map((response) => {
        if (!response.exito) {
          throw new Error(
            response.errores && response.errores[0]
              ? response.errores[0]
              : response.mensaje ||
              'Error al obtener productos'
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
