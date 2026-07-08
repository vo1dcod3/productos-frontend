import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor que centraliza el manejo de errores HTTP: traduce el código de
 * estado a un mensaje legible y propaga un Error con ese mensaje.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Error inesperado';

      switch (error.status) {
        // status 0 = no hubo respuesta HTTP (servidor caído, CORS o sin red), no un error del backend.
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