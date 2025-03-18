import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class ServicioDeCookiesSeguras  {
  private readonly tokenKey = 'miToken';
  private readonly urlKey = 'miNavigateUrl';
  private readonly path = '/';
  private readonly isSecure = true;
  private readonly sameSite = 'Strict';

  constructor(private servicioDeCookies : CookieService) { }

  // Método para establecer una cookie
  private establecerCookie(key: string, value: string): void {
    this.servicioDeCookies .set(key, value, undefined, this.path, undefined, this.isSecure, this.sameSite);
  }

  // Método para establecer el token en una cookie segura y HttpOnly
  establecerToken(token: string): void {
    this.establecerCookie(this.tokenKey, token);
  }

  // Método para establecer la URL en una cookie segura y HttpOnly
  estabecerUrlActual(url: string): void {
    this.establecerCookie(this.urlKey, url);
  }

  // Método para obtener el token almacenado en la cookie
  obtenerToken(): string | null {
    return this.servicioDeCookies .get(this.tokenKey);
  }

  // Método para obtener la URL almacenada en la cookie
  obtnerUrlActual(): string | null {
    return this.servicioDeCookies .get(this.urlKey);
  }

  // Método para eliminar las cookies al cerrar sesión
  cerrarSesion(): void {
    this.servicioDeCookies .delete(this.tokenKey, this.path);
    this.servicioDeCookies .delete(this.urlKey, this.path);
  }
}
