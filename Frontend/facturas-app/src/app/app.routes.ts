import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
            path: 'clientes',
            children: [
            ],
          },
          {
            path: 'productos',
            children: [
            ],
          },
          {
            path: 'usuarios',
            children: [
            ],
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
        ],
      },
];
