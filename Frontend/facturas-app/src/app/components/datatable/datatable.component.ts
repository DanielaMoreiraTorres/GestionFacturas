import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicioMensaje } from 'src/app/core/services/message.service';
import { Peticion } from 'src/app/core/models/peticion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss',
})
export class DatatableComponent implements OnInit {
  Math = Math;
  readonly msg = inject(ServicioMensaje);
  readonly http = inject(HttpClient);
  readonly renderer = inject(Renderer2);

  @Input() columnas: { clave: string; titulo: string }[] = [];
  @Input() datos: any[] = [];
  @Input() totalRegistros: number = 0;
  @Output() cambiarPagina = new EventEmitter<Peticion>();
  @Output() cambiarOrden = new EventEmitter<Peticion>();
  @Output() cambiarBusqueda = new EventEmitter<Peticion>();

  @Input() botonesAcciones: { etiqueta: string, icono?: string, clase?: string, accion: string }[] = [];
  @Output() clicAccion = new EventEmitter<{ accion: string, fila: any }>();
  @Input() camposParaBuscar: string[] = [];

  peticion: Peticion = {
    pagina: 1,
    tamanoPagina: 5,
    campoBuscar: '',
    campoOrdenar: '',
    direccionOrdenar: 'asc',
    campoFiltro: ''
  };

  placeholderBuscar: string = '';

  ngOnInit() {
    this.placeholderBuscar = `Buscar por ${this.camposParaBuscar.join(', ')}`;
  }

  // Método para manejar el cambio de búsqueda
  buscar() {
    this.cambiarBusqueda.emit(this.peticion);
  }

  // Método para manejar el cambio de página
  cambiarPaginaActual(pagina: number) {
    if (pagina < 1 || pagina > Math.ceil(this.totalRegistros / this.peticion.tamanoPagina)) return;
    this.peticion.pagina = pagina;
    this.cambiarPagina.emit(this.peticion);
  }

  // Método para manejar el cambio de ordenación
  ordenar(campo: string) {
    if (this.peticion.campoOrdenar === campo) {
      this.peticion.direccionOrdenar = this.peticion.direccionOrdenar === 'asc' ? 'desc' : 'asc';
    } else {
      this.peticion.campoOrdenar = campo;
      this.peticion.direccionOrdenar = 'asc';
    }
    this.cambiarOrden.emit(this.peticion);
  }

  //Método para obtener el total de páginas
  obtenerTotalPaginas(): number {
    return Math.ceil(this.totalRegistros / this.peticion.tamanoPagina);
  }
}
