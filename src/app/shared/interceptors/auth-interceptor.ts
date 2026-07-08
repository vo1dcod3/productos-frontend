import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Interceptor que agrega la cabecera Authorization con el token Bearer
 * a las peticiones salientes cuando hay sesión activa.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  // Se clona la petición porque los HttpRequest son inmutables: no se pueden mutar sus headers.
  const reqAutenticado = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(reqAutenticado);
};