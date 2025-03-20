import { Component, ViewChild, inject } from '@angular/core';
import { PageButtonsComponent } from 'src/app/components/page-buttons/page-buttons.component';
import { PageButton } from 'src/app/components/page-buttons/pagebutton.model';
import { DatatableComponent } from 'src/app/components';
import { Router } from '@angular/router';
import { ServicioMensaje } from 'src/app/core/services/message.service';
import { ProductoServicio } from 'src/app/api/product/product.service';
import { Peticion } from 'src/app/core/models/peticion.model';
import { DatosProducto } from 'src/app/api/product/product.models';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioAutenticacion } from 'src/app/account/services/auth.service';

@Component({
    selector: 'app-productos',
    standalone: true,
    imports: [
        PageButtonsComponent,
        DatatableComponent,
        ModalComponent,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.scss'
})

export class ProductoComponent {
    titulo: string = 'Productos';
    botones: PageButton[];

    readonly router = inject(Router);
    readonly apiProducto = inject(ProductoServicio);
    camposParaBuscar = ["Nombre", "Código"]
    columnas = [
        { clave: 'codigo', titulo: 'Código' },
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'descripcion', titulo: 'Descripción' },
        { clave: 'precio', titulo: 'Precio' }
    ];
    botonesAcciones = [
        { etiqueta: 'Editar', icono: 'fas fa-pencil-alt', clase: 'boton-editar', accion: 'editar' },
        { etiqueta: 'Eliminar', icono: 'fas fa-trash', clase: 'boton-eliminar', accion: 'eliminar' },
    ];

    productos: DatosProducto[] = [];
    totalRegistros: number = 0;
    modalVisible = false;
    productoForm: FormGroup;
    loading: boolean = true;
    isSubmitted: boolean = false;
    isEditando: boolean = false;
    tituloModal: string = !this.isEditando ? 'Nuevo Producto' : 'Editar Producto';
    codigo: string = "";
    productoId: number;
    modalConfirmacion = false;

    constructor(private fb: FormBuilder, private msg: ServicioMensaje, private autenticacion: ServicioAutenticacion) {
        this.productoForm = this.fb.group({
            codigo: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            descripcion: ['', []],
            precio: ['', [Validators.required, Validators.pattern(/^(\d+(\.\d{1,2})?)$/)]],
        });
    }

    ngOnInit(): void {
        this._initBotones();
        this.obtenerProductos();
    }

    private _initBotones() {
        this.botones = [
            {
                etiqueta: 'NUEVO',
                icono: 'fas fa-plus',
                clasesCss: 'btn-success',
                tipoAccion: () => this.agregar(),
            },
        ];
    }

    obtenerProductos(peticion: Peticion = { pagina: 1, tamanoPagina: 5 }): void {
        this.apiProducto.obtenerProductos(peticion).subscribe({
            next: (data) => {
                this.productos = data || [];
                this.totalRegistros = data?.length || 0;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al obtener productos', err);
                this.loading = false;
            }
        });
    }

    obtenerErrores() {
        const errors: { [key: string]: any } = {};
        Object.keys(this.productoForm.controls).forEach(controlName => {
            const control = this.productoForm.get(controlName);
            if (control && control.errors) {
                errors[controlName] = control.errors;
            }
        });
        return errors;
    }

    manejarAccion(evento: { accion: string, fila: any }) {
        switch (evento.accion) {
            case 'editar':
                this.isEditando = true;
                this.tituloModal = 'Editar Producto';
                this.mostrarModalEditar(evento.fila);
                break;
            case 'eliminar':
                this.mostrarModalEliminar(evento.fila);
                break;
        }
    }

    onBuscar(peticion: Peticion) {
        this.obtenerProductos(peticion);
    }

    onOrdenar(peticion: Peticion) {
        this.obtenerProductos(peticion);
    }

    onCambiarPagina(peticion: Peticion) {
        this.obtenerProductos(peticion);
    }

    agregar() {
        this.isEditando = false;
        this.modalVisible = true;
        this.tituloModal = 'Nuevo Producto';
    }

    guardarProducto() {
        if (this.productoForm.valid) {
            const { codigo, nombre, descripcion, precio } = this.productoForm.value;
            const model: any = {
                Codigo: codigo,
                Nombre: nombre,
                Descripcion: descripcion,
                Precio: precio,
                Activo: true,
                FechaCreacion: new Date().toISOString(),
                UsuarioCreacion: this.autenticacion.usuarioActual()?.id
            };

            this.apiProducto.guardarProducto(model).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalVisible = false;
                        this.cerrarModal();
                        this.msg.growl.success(
                            `Producto ${model.Codigo} registrado con éxito`
                        );
                        this.obtenerProductos();
                    }
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.msg.error(error.message);
                },
            });
        }
    }

    modificarProducto() {
        if (this.productoForm.valid) {
            const { codigo, nombre, descripcion, precio } = this.productoForm.value;
            const model: any = {
                Id: this.productoId,
                Codigo: codigo,
                Nombre: nombre,
                Descripcion: descripcion,
                Precio: precio,
                FechaActualizacion: new Date().toISOString(),
                UsuarioActualizacion: this.autenticacion.usuarioActual()?.id
            };

            this.apiProducto.modificarProducto(this.productoId, model).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalVisible = false;
                        this.cerrarModal();
                        this.msg.growl.success(
                            `Producto ${model.Codigo} actualizado con éxito`
                        );

                        this.productoId = 0;
                        this.obtenerProductos();
                    }
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.msg.error(error.message);
                },
            });
        }
    }

    eliminarProducto() {
        if (this.productoId != null) {
            this.apiProducto.eliminarProducto(this.productoId).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalConfirmacion = false;
                        this.cerrarModalConfirmacion();
                        this.msg.growl.success(
                            `Producto ${this.codigo} eliminado con éxito`
                        );

                        this.productoId = 0;
                        this.codigo = "";
                        this.obtenerProductos();
                    }
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.msg.error(error.message);
                },
            });
        }
    }

    confirmarAccion() {
        this.loading = true;
        this.isSubmitted = true;
        this.productoForm.markAllAsTouched();

        if (this.productoForm.invalid) {
            this.loading = false;
            this.msg.growl.error(
                `Complete los campos requeridos`
            );
            return;
        }

        if (this.isEditando) {
            this.modificarProducto();
        } else {
            this.guardarProducto();
        }
    }

    cerrarModal() {
        this.productoForm.reset();
        this.isSubmitted = false;
        this.modalVisible = false;
    }

    mostrarModalEditar(producto: DatosProducto) {
        this.productoId = producto.id;

        this.productoForm.setValue({
            codigo: producto.codigo,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
        });

        this.modalVisible = true;
    }

    cerrarModalConfirmacion() {
        this.modalConfirmacion = false;
    }

    mostrarModalEliminar(producto: DatosProducto) {
        this.productoId = producto.id;
        this.codigo = producto.codigo;
        this.modalConfirmacion = true;
    }

    confirmarEliminacion() {
        this.eliminarProducto();
    }
}
