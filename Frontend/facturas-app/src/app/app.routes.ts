import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuarios/usuarios.component';
import { ClienteComponent } from './pages/clientes/clientes.component';
import { ProductoComponent } from './pages/productos/productos.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    pathMatch: 'prefix',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'clientes', component: ClienteComponent
      },
      {
        path: 'productos', component: ProductoComponent
      },
      {
        path: 'usuarios', component: UsuarioComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
