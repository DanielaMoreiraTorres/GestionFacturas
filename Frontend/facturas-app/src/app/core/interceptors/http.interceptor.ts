import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ServicioDeCookiesSeguras } from 'src/app/account/services/secure-cookie.service';
import { environment } from 'src/environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(ServicioDeCookiesSeguras);
  const token = cookie.obtenerToken();

  let modifiedReq = req;

  if (!req.url.includes('assets/i18n') && !req.url.includes('seguridad/signin')) {
    if (token) {
      modifiedReq = modifiedReq.clone({
        headers: modifiedReq.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    modifiedReq = modifiedReq.clone({
      url: `${environment.baseUrl}/${modifiedReq.url}`
    });
  } else if (req.url.includes('seguridad/signin')) {
    modifiedReq = modifiedReq.clone({
      url: `${environment.baseUrl}/${modifiedReq.url}`
    });
  }

  return next(modifiedReq);
};
