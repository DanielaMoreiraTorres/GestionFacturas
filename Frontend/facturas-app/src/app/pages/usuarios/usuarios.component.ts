import { Component, ViewChild, inject } from '@angular/core';
import { PageButtonsComponent } from 'src/app/components/page-buttons/page-buttons.component';
import { PageButton } from 'src/app/components/page-buttons/pagebutton.model';
import { DatatableComponent } from 'src/app/components';
import { Router } from '@angular/router';
import { ServicioMensaje } from 'src/app/core/services/message.service';
import { UsuarioServicio } from 'src/app/api/user/user.service';
import { Peticion } from 'src/app/core/models/peticion.model';
import { DatosUsuario } from 'src/app/api/user/user.models';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioAutenticacion } from 'src/app/account/services/auth.service';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [
        PageButtonsComponent,
        DatatableComponent,
        ModalComponent,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss'
})

export class UsuarioComponent {
    titulo: string = 'Usuarios';
    botones: PageButton[];

    readonly router = inject(Router);
    //readonly msg = inject(ServicioMensaje);
    readonly apiUsuario = inject(UsuarioServicio);
    camposParaBuscar = ["Nombres", "Apellidos"]
    columnas = [
        { clave: 'nombres', titulo: 'Nombres' },
        { clave: 'apellidos', titulo: 'Apellidos' },
        { clave: 'nombreUsuario', titulo: 'Usuario' },
        { clave: 'correo', titulo: 'Correo' }
    ];
    botonesAcciones = [
        { etiqueta: 'Editar', icono: 'fas fa-pencil-alt', clase: 'boton-editar', accion: 'editar' },
        { etiqueta: 'Eliminar', icono: 'fas fa-trash', clase: 'boton-eliminar', accion: 'eliminar' },
    ];

    usuarios: DatosUsuario[] = [];
    totalRegistros: number = 0;
    modalVisible = false;
    usuarioForm: FormGroup;
    loading: boolean = true;
    isSubmitted: boolean = false;
    isEditando: boolean = false;
    tituloModal: string = !this.isEditando ? 'Nuevo Usuario' : 'Editar Usuario';
    nombreUsuario: string = "";
    usuarioId: number;
    modalConfirmacion = false;

    constructor(private fb: FormBuilder, private msg: ServicioMensaje, private autenticacion: ServicioAutenticacion) {
        this.usuarioForm = this.fb.group({
            nombres: ['', [Validators.required]],
            apellidos: ['', [Validators.required]],
            nombreUsuario: ['', [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            contrasena: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    ngOnInit(): void {
        this._initBotones();
        this.obtenerUsuarios();
    }

    private _initBotones() {
        this.botones = [
            {
                label: 'NUEVO',
                icon: 'fas fa-plus',
                cssClass: 'btn-success',
                actionType: () => this.agregar(),
            },
        ];
    }

    obtenerUsuarios(peticion: Peticion = { pagina: 1, tamanoPagina: 5 }): void {
        this.apiUsuario.obtenerUsuarios(peticion).subscribe({
            next: (data) => {
                console.log("data", data)
                this.usuarios = data || [];
                this.totalRegistros = data?.length || 0;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al obtener usuarios:', err);
                this.loading = false;
            }
        });
    }

    getErrors() {
        const errors: { [key: string]: any } = {};
        Object.keys(this.usuarioForm.controls).forEach(controlName => {
            const control = this.usuarioForm.get(controlName);
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
                this.tituloModal = 'Editar Usuario';
                this.mostrarModalEditar(evento.fila);
                break;
            case 'eliminar':
                this.mostrarModalEliminar(evento.fila);
                break;
        }
    }

    onBuscar(peticion: Peticion) {
        this.obtenerUsuarios(peticion);
    }

    onOrdenar(peticion: Peticion) {
        this.obtenerUsuarios(peticion);
    }

    onCambiarPagina(peticion: Peticion) {
        this.obtenerUsuarios(peticion);
    }

    agregar() {
        this.isEditando = false;
        this.modalVisible = true;
        this.tituloModal = 'Nuevo Usuario';
    }

    guardarUsuario() {
        if (this.usuarioForm.valid) {
            const { nombres, apellidos, nombreUsuario, correo, contrasena } = this.usuarioForm.value;
            const model: any = {
                Nombres: nombres,
                Apellidos: apellidos,
                NombreUsuario: nombreUsuario,
                Correo: correo,
                Contrasena: contrasena,
                Activo: true,
                FechaCreacion: new Date().toISOString(),
            };

            this.apiUsuario.guardarUsuario(model).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalVisible = false;
                        this.cerrarModal();
                        this.msg.growl.success(
                            `Usuario ${model.NombreUsuario} registrado con éxito`
                        );
                        this.obtenerUsuarios();
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

    modificarUsuario() {
        if (this.usuarioForm.valid) {
            const { nombres, apellidos, nombreUsuario, correo, contrasena } = this.usuarioForm.value;
            const model: any = {
                Id: this.usuarioId,
                Nombres: nombres,
                Apellidos: apellidos,
                NombreUsuario: nombreUsuario,
                Correo: correo,
                Contrasena: contrasena,
                Activo: true,
                FechaActualizacion: new Date().toISOString(),
            };

            this.apiUsuario.modificarUsuario(this.usuarioId, model).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalVisible = false;
                        this.cerrarModal();
                        this.msg.growl.success(
                            `Usuario ${model.NombreUsuario} actualizado con éxito`
                        );

                        if (this.autenticacion.usuarioActual()?.id == this.usuarioId) {
                            this.cerrarSesion();
                        }
                        else {
                            this.usuarioId = 0;
                            this.obtenerUsuarios();
                        }
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

    eliminarUsuario() {
        if (this.usuarioId != null) {
            this.apiUsuario.eliminarUsuario(this.usuarioId).subscribe({
                next: (data: any) => {
                    if (data) {
                        this.modalConfirmacion = false;
                        this.cerrarModalConfirmacion();
                        this.msg.growl.success(
                            `Usuario ${this.nombreUsuario} eliminado con éxito`
                        );

                        if (this.autenticacion.usuarioActual()?.id == this.usuarioId) {
                            this.cerrarSesion();
                        }
                        else {
                            this.usuarioId = 0;
                            this.nombreUsuario = "";
                            this.obtenerUsuarios();
                        }
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
        this.usuarioForm.markAllAsTouched();

        if (this.usuarioForm.invalid) {
            this.loading = false;
            this.msg.growl.error(
                `Complete los campos requeridos`
            );
            console.log('Formulario no válido');
            return;
        }

        if (this.isEditando) {
            this.modificarUsuario();
        } else {
            this.guardarUsuario();
        }
    }

    cerrarModal() {
        this.usuarioForm.reset();
        this.isSubmitted = false;
        this.modalVisible = false;
    }

    mostrarModalEditar(usuario: DatosUsuario) {
        this.usuarioId = usuario.id;

        this.usuarioForm.setValue({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            nombreUsuario: usuario.nombreUsuario,
            correo: usuario.correo,
            contrasena: '',
        });

        this.modalVisible = true;
    }

    cerrarModalConfirmacion() {
        this.modalConfirmacion = false;
    }

    mostrarModalEliminar(usuario: DatosUsuario) {
        this.usuarioId = usuario.id;
        this.nombreUsuario = usuario.nombreUsuario;
        this.modalConfirmacion = true;
    }

    confirmarEliminacion() {
        this.eliminarUsuario();
    }

    cerrarSesion() {
        this.autenticacion.cerrarSesion();
        this.router.navigate(['/auth/login']);
    }
}
