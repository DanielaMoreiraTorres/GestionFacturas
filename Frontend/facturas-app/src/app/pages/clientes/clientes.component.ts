import { Component, ViewChild, inject } from '@angular/core';
import { PageButtonsComponent } from 'src/app/components/page-buttons/page-buttons.component';
import { PageButton } from 'src/app/components/page-buttons/pagebutton.model';
import { DatatableComponent } from 'src/app/components';
import { Router } from '@angular/router';
import { ServicioMensaje } from 'src/app/core/services/message.service';
import { ClienteServicio } from 'src/app/api/client/client.service';
import { Peticion } from 'src/app/core/models/peticion.model';
import { DatosCliente } from 'src/app/api/client/client.models';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioAutenticacion } from 'src/app/account/services/auth.service';
import { CatalogoServicio } from 'src/app/api/catalog/catalog.service';
import { DatosTipoIdentificacion } from 'src/app/api/catalog/catalog.models';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [
        PageButtonsComponent,
        DatatableComponent,
        ModalComponent,
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule
    ],
    templateUrl: './clientes.component.html',
    styleUrl: './clientes.component.scss'
})
export class ClienteComponent {
    titulo: string = 'Clientes';
    botones: PageButton[];

    readonly router = inject(Router);
    readonly apiCliente = inject(ClienteServicio);
    readonly apiCatalogo = inject(CatalogoServicio);

    camposParaBuscar = ["Nombre", "Identificación"]
    columnas = [
        { clave: 'identificacion', titulo: 'Identificación' },
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'telefono', titulo: 'Teléfono' },
        { clave: 'correo', titulo: 'Correo' },
        { clave: 'direccion', titulo: 'Dirección' },
    ];
    botonesAcciones = [
        { etiqueta: 'Editar', icono: 'fas fa-pencil-alt', clase: 'boton-editar', accion: 'editar' },
        { etiqueta: 'Eliminar', icono: 'fas fa-trash', clase: 'boton-eliminar', accion: 'eliminar' },
    ];

    tiposIdentificacion: DatosTipoIdentificacion[] = [];
    clientes: DatosCliente[] = [];
    totalRegistros: number = 0;
    modalVisible = false;
    clienteForm: FormGroup;
    loading: boolean = true;
    isSubmitted: boolean = false;
    isEditando: boolean = false;
    tituloModal: string = !this.isEditando ? 'Nuevo Cliente' : 'Editar Cliente';
    identificacion: string = "";
    clienteId: number;
    modalConfirmacion = false;

    constructor(private fb: FormBuilder, private msg: ServicioMensaje, private autenticacion: ServicioAutenticacion) {
        this.clienteForm = this.fb.group({
            tipoIdentificacion: [null, Validators.required],
            identificacion: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            telefono: ['', []],
            correo: ['', [Validators.email]],
            direccion: ['', []],
        });
    }

    ngOnInit(): void {
        this._initBotones();
        this.obtenerClientes();
        this.obtenerCatalogoTipoIdentificacion();
        this.clienteForm.get('tipoIdentificacion')?.valueChanges.subscribe((tipo) => {
            this.validacionIdentificacion(tipo?.nombre, this.clienteForm.get('identificacion'));
        });
    }

    validacionIdentificacion(tipo: string, identificacionControl: any) {
        let length = 0;
        if (tipo === 'RUC') {
            length = 13;
        } else if (tipo === 'CEDULA') {
            length = 10;
        }

        const validators = [Validators.required];
        if (length > 0) {
            validators.push(Validators.minLength(length));
            validators.push(Validators.maxLength(length));
        }

        identificacionControl?.setValidators(validators);
        identificacionControl?.updateValueAndValidity();
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

    obtenerClientes(peticion: Peticion = { pagina: 1, tamanoPagina: 5 }): void {
        this.apiCliente.obtenerClientes(peticion).subscribe({
            next: (data) => {
                this.clientes = data || [];
                this.totalRegistros = data?.length || 0;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al obtener clientes', err);
                this.loading = false;
            }
        });
    }

    obtenerCatalogoTipoIdentificacion() {
        this.apiCatalogo.obtenerCatalogoTipoIdentificacion().subscribe({
            next: (data) => {
                console.log("tipoIdentificacion", data);
                this.tiposIdentificacion = data || [];
            },
            error: (err) => {
                console.error('Error al obtener catálogo tipo de identificación', err);
            }
        });
    }

    obtenerErrores() {
        const errors: { [key: string]: any } = {};
        Object.keys(this.clienteForm.controls).forEach(controlName => {
            const control = this.clienteForm.get(controlName);
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
                this.tituloModal = 'Editar Cliente';
                this.mostrarModalEditar(evento.fila);
                break;
            case 'eliminar':
                this.mostrarModalEliminar(evento.fila);
                break;
        }
    }

    onBuscar(peticion: Peticion) {
        this.obtenerClientes(peticion);
    }

    onOrdenar(peticion: Peticion) {
        this.obtenerClientes(peticion);
    }

    onCambiarPagina(peticion: Peticion) {
        this.obtenerClientes(peticion);
    }

    agregar() {
        this.isEditando = false;
        this.modalVisible = true;
        this.tituloModal = 'Nuevo Cliente';
    }

    guardarCliente() {
        if (this.clienteForm.valid) {
            const { tipoIdentificacion, identificacion, nombre, telefono, correo, direccion } = this.clienteForm.value;
            const model: any = {
                TipoIdentificacion: tipoIdentificacion?.id,
                Identificacion: identificacion,
                Nombre: nombre,
                Telefono: telefono,
                Correo: correo,
                Direccion: direccion,
                Activo: true,
                FechaCreacion: new Date().toISOString(),
                UsuarioCreacion: this.autenticacion.usuarioActual()?.id
            };

            this.apiCliente.guardarCliente(model).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalVisible = false;
                        this.cerrarModal();
                        this.msg.growl.success(
                            `Cliente ${model.Identificacion} registrado con éxito`
                        );
                        this.obtenerClientes();
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

    modificarCliente() {
        if (this.clienteForm.valid) {
            const { tipoIdentificacion, identificacion, nombre, telefono, correo, direccion } = this.clienteForm.value;
            const model: any = {
                Id: this.clienteId,
                TipoIdentificacion: tipoIdentificacion,
                Identificacion: identificacion,
                Nombre: nombre,
                Telefono: telefono,
                Correo: correo,
                Direccion: direccion,
                Activo: true,
                FechaActualizacion: new Date().toISOString(),
                UsuarioActualizacion: this.autenticacion.usuarioActual()?.id
            };

            this.apiCliente.modificarCliente(this.clienteId, model).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalVisible = false;
                        this.cerrarModal();
                        this.msg.growl.success(
                            `Cliente ${model.Identificacion} actualizado con éxito`
                        );

                        this.clienteId = 0;
                        this.obtenerClientes();
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

    eliminarCliente() {
        if (this.clienteId != null) {
            this.apiCliente.eliminarCliente(this.clienteId).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalConfirmacion = false;
                        this.cerrarModalConfirmacion();
                        this.msg.growl.success(
                            `Cliente ${this.identificacion} eliminado con éxito`
                        );

                        this.clienteId = 0;
                        this.identificacion = "";
                        this.obtenerClientes();
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
        this.clienteForm.markAllAsTouched();

        if (this.clienteForm.invalid) {
            this.loading = false;
            this.msg.growl.error(
                `Complete los campos requeridos`
            );
            return;
        }

        if (this.isEditando) {
            this.modificarCliente();
        } else {
            this.guardarCliente();
        }
    }

    cerrarModal() {
        this.clienteForm.reset();
        this.isSubmitted = false;
        this.modalVisible = false;
    }

    mostrarModalEditar(cliente: DatosCliente) {
        this.clienteId = cliente.id;

        this.clienteForm.setValue({
            tipoIdentificacion: cliente.tipoIdentificacion,
            identificacion: cliente.identificacion,
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            correo: cliente.correo,
            direccion: cliente.direccion,
        });

        this.modalVisible = true;
    }

    cerrarModalConfirmacion() {
        this.modalConfirmacion = false;
    }

    mostrarModalEliminar(cliente: DatosCliente) {
        this.clienteId = cliente.id;
        this.identificacion = cliente.identificacion;
        this.modalConfirmacion = true;
    }

    confirmarEliminacion() {
        this.eliminarCliente();
    }
}
