import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';

import { LayoutComponent } from './layout/layout.component';


export const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent,
      },
];
