import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
   {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./productos/pages/productos-page/productos-page.component').then(m => m.ProductosPageComponent)
  },
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  }
];