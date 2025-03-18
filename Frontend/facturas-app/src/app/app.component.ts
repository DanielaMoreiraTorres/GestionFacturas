import { Component, effect, ElementRef, inject, OnInit, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ServicioAutenticacion } from './account/services/auth.service';
import { EstadoAutenticacion } from './account/interfaces';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'facturas-app';
  private servicioAutenticacion = inject(ServicioAutenticacion);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  public finishedAuthCheck = computed(() => {
    if (this.servicioAutenticacion.estadoAutenticacion() === EstadoAutenticacion.comprobando) {
      return false;
    }
    return true;
  });

  public authStatusChangeEffect = effect(() => {
    console.log("estado",this.servicioAutenticacion.estadoAutenticacion())

    switch (this.servicioAutenticacion.estadoAutenticacion()) {
      case EstadoAutenticacion.comprobando:
        return;

      case EstadoAutenticacion.autenticado:
        if (location.href.includes('/auth/login')) {
          this.router.navigateByUrl('/');
        }
        return;

      case EstadoAutenticacion.noAutenticado:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
}
