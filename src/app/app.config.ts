import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { httpErrorInterceptor } from './shared/interceptors/http-error-interceptor';
import { routes } from './app.route';
import { authInterceptor } from './shared/interceptors/auth-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor,httpErrorInterceptor])),
    provideRouter(routes)
  ]
};