import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Respuesta } from 'src/app/core/models/api-response.model';
import { DatosTipoIdentificacion } from './catalog.models';

@Injectable({
    providedIn: 'root',
})
export class CatalogoServicio {
    constructor(private http: HttpClient) { }

    obtenerCatalogoTipoIdentificacion(): Observable<DatosTipoIdentificacion[] | null> {
        return this.http.get<Respuesta<any>>(`Catalogo/tipoIdentificacion`).pipe(
            map((response) => {
                if (!response.exito) {
                    throw new Error(
                        response.mensaje ||
                        'Error al obtener catálogo de tipo de identificación'
                    );
                }

                return response?.datos;

            }),
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }
}