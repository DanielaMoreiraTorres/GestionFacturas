export interface Peticion {
    pagina: number;
    tamanoPagina: number;
    campoBuscar?: string,
    campoOrdenar?: string,
    direccionOrdenar?: string,
    campoFiltro?: string
}