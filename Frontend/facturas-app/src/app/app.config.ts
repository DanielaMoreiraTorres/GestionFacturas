import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    CookieService,
    provideAnimations(),
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClient,
      ToastrModule.forRoot({
        timeOut: 2000,
        positionClass: 'toast-top-right',
        preventDuplicates: true, // Evita duplicados de toasts
        progressBar: false, // Muestra la barra de progreso
        easeTime: 500, // Tiempo de animación para abrir y cerrar el toast
        tapToDismiss: false, // Si el toast desaparece cuando se hace clic
        closeButton: false,
      }),
      FormsModule,
      SimplebarAngularModule,
      ModalModule.forRoot(),
      TabsModule.forRoot(),
      BsDropdownModule.forRoot(),
      TooltipModule.forRoot(),
      AlertModule.forRoot(),
    ),
    provideHttpClient(withInterceptors([httpInterceptor, errorInterceptor]))]
};
