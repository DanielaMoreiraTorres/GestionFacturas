import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ServicioAutenticacion } from 'src/app/account/services/auth.service';
import { SimplebarAngularModule } from 'simplebar-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    SimplebarAngularModule,
    BsDropdownModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})

export class TopbarComponent implements OnInit, OnDestroy {
  cookieValue: any;
  valueset: any;
  theme: any;
  layout: string = "";
  dataLayout$: Observable<string>;
  userNameCompleto: string;
  photo = 'assets/images/user.jpg';

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private autenticacion: ServicioAutenticacion,
    public _cookiesService: CookieService,
  ) { }

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.userNameCompleto = this.autenticacion.usuarioActual() ? this.autenticacion.usuarioActual()?.nombres + " " + this.autenticacion.usuarioActual()?.apellidos : "USERNAME";
  }

  ngOnDestroy() {

  }

  /**
   * Logout the user
   */
  cerrarSesion() {
    this.autenticacion.cerrarSesion();
    this.router.navigate(['/auth/login']);
  }


  changeLayout(layoutMode: string) {

  }
}
