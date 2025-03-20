export interface PageButton{
    etiqueta:string,
    icono?: String | undefined;
    tipoAccion?: Function | undefined;
    clasesCss?: String | undefined;
    visible?:boolean | undefined;
    deshabilitado?:boolean | undefined;
    soloIcono?:boolean | undefined;
  }
  