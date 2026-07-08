import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';


/** Credenciales enviadas al endpoint de login. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Respuesta del backend con el token JWT emitido. */
export interface AuthResponse {
  token: string;
}

/**
 * Servicio de autenticación: gestiona el login/logout y la persistencia del
 * token JWT en localStorage, y expone datos derivados del token.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';

  /** Autentica al usuario y persiste el token recibido. Retorna la respuesta con el token. */
  login(credenciales: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
      })
    );
  }

  /** Elimina el token y redirige al login. */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Indica si existe un token almacenado (usuario autenticado). */
  estaAutenticado(): boolean {
    return this.getToken() !== null;
  }

  /** Extrae el email del token. Retorna null si no hay token o no se puede decodificar. */
  getEmailDesdeToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      // El payload del JWT va en base64 en la parte central (índice 1); sub = email.
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }

  /** Retorna la inicial en mayúscula del email, o '?' si no hay email disponible. */
  getIniciales(): string {
    const email = this.getEmailDesdeToken();
    if (!email) return '?';
    return email[0].toUpperCase();
  }
}