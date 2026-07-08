import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
/**
 * Rutas de la aplicación. Las páginas se cargan de forma diferida (lazy) y
 * la ruta de productos queda protegida por authGuard.
 */
export const routes: Routes = [
   {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'register',
  loadComponent: () =>
    import('./auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
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