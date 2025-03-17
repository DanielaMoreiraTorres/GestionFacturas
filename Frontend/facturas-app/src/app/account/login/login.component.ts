import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { AuthService } from '../services/auth.service';
//import { MessageService } from 'src/app/core/services/message.service';
//import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        //CarouselModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private formBuilder = inject(UntypedFormBuilder);
    private route = inject(ActivatedRoute);
    //private auth = inject(AuthService);
    //private msg = inject(MessageService);


    loginForm: UntypedFormGroup = this.formBuilder.group({});

    submitted: any = false;
    error: any = '';
    returnUrl: string = "";

    year: number = new Date().getFullYear();

    constructor(private router: Router) { }

    ngOnInit(): void {

        const user = '';
        const password = '';

        document.body.classList.add("auth-body-bg");
        this.loginForm = this.formBuilder.group({
            user: [user, [Validators.required]],
            password: [password, [Validators.required]],
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

        //const user = this.f?['user'].value;
        //const password = this.f['password'].value;

        /*this.auth.login(user,password).subscribe({
          next:()=> {
            //this.loading = false;
          },
          error:(err)=>{
            //this.loading = false;
            console.log('login',err);
            this.msg.error(err);
          }
        });*/

    }
}
