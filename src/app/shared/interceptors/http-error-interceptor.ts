import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Error inesperado';

      switch (error.status) {
        case 0:
          mensaje = 'No se pudo conectar con el servidor';
          break;
        case 400:
          mensaje = 'Datos inválidos';
          break;
        case 404:
          mensaje = 'Recurso no encontrado';
          break;
        case 500:
          mensaje = 'Error interno del servidor';
          break;
      }

      console.error(`[HTTP Error] ${error.status} — ${mensaje}`, error);
      return throwError(() => new Error(mensaje));
    })
  );
};