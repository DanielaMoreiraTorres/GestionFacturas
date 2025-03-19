import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class ServicioMensaje {
  private toastr = inject(ToastrService);

  constructor() { }

  error(message: string) {
    this.showAlert(message, 'error');
  }

  info(message: string) {
    this.showAlert(message, 'info');
  }

  warning(message: string) {
    this.showAlert(message, 'warning');
  }

  success(message: string) {
    this.showAlert(message, 'success');
  }

  confirm(message: string) {
    return Swal.fire({
      html: message,
      showCancelButton: true,
      confirmButtonColor: '#A2CADF',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });
  }

  get growl() {
    return new GrowlAlert(this.toastr);
  }

  private showAlert(message: string, type: 'success' | 'info' | 'warning' | 'error') {
    Swal.fire('', message, type);
  }
}

class GrowlAlert {
  constructor(private toastr: ToastrService) { }

  private displayToast(message: string, type: 'success' | 'info' | 'warning' | 'error') {
    switch (type) {
      case 'success':
        this.toastr.success(message);
        break;
      case 'info':
        this.toastr.info(message);
        break;
      case 'warning':
        this.toastr.warning(message);
        break;
      case 'error':
        this.toastr.error(message);
        break;
    }
  }

  success(message: string) {
    this.displayToast(message, 'success');
  }

  info(message: string) {
    this.displayToast(message, 'info');
  }

  error(message: string) {
    this.displayToast(message, 'error');
  }

  warning(message: string) {
    this.displayToast(message, 'warning');
  }
}
