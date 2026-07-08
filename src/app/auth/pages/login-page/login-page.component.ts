import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
/**
 * Página de inicio de sesión: valida las credenciales mediante un formulario
 * reactivo y redirige a productos tras autenticar.
 */
export class LoginPageComponent {

   private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  cargando = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  /** Envía las credenciales; navega a productos si el login es correcto o muestra el error. */
  login(): void {
    if (this.form.invalid) return;

    this.cargando.set(true);
    this.error.set('');

    this.authService.login(this.form.value as any).subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: () => {
        this.error.set('Email o contraseña incorrectos');
        this.cargando.set(false);
      }
    });
  }
}
