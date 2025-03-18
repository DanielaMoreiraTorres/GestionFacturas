import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioAutenticacion } from '../services/auth.service';
import { ServicioMensaje } from 'src/app/core/services/message.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private formBuilder = inject(UntypedFormBuilder);
    private route = inject(ActivatedRoute);
    private auth = inject(ServicioAutenticacion);
    private msg = inject(ServicioMensaje);

    loginForm: UntypedFormGroup = this.formBuilder.group({});
    submitted: any = false;
    error: any = '';
    returnUrl: string = "";
    year: number = new Date().getFullYear();

    constructor(private router: Router) { }

    ngOnInit(): void {
        const usuario = '';
        const contrasena = '';

        document.body.classList.add("auth-body-bg");
        this.loginForm = this.formBuilder.group({
            usuario: [usuario, [Validators.required]],
            contrasena: [contrasena, [Validators.required]],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    slideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    };

    get f() { return this.loginForm.controls; }

    /**
     * Form submit
     */
    onSubmit() {
        this.submitted = true;
        this.submitted = true;

        const usuario = this.f['usuario'].value;
        const contrasena = this.f['contrasena'].value;

        this.auth.inicioSesion(usuario, contrasena).subscribe({
            next: () => {
                //this.loading = false;
            },
            error: (err) => {
                //this.loading = false;
                console.log('inicioSesion', err);
                this.msg.error(err);
            }
        });
    }
}
