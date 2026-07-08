import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { httpErrorInterceptor } from './shared/interceptors/http-error-interceptor';
import { routes } from './app.route';
import { authInterceptor } from './shared/interceptors/auth-interceptor';


/**
 * Configuración raíz de la aplicación: registra el router, el HttpClient
 * y la cadena de interceptores HTTP.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // El orden importa: authInterceptor agrega el token antes de que httpErrorInterceptor
    // capture posibles errores de la respuesta.
    provideHttpClient(withInterceptors([authInterceptor,httpErrorInterceptor])),
    provideRouter(routes)
  ]
};