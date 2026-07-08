import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
/** Página de registro: crea una cuenta nueva y deja al usuario autenticado. */
export class RegisterPageComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  cargando = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordsCoinciden });

  private passwordsCoinciden(grupo: AbstractControl): ValidationErrors | null {
    const pass = grupo.get('password')?.value;
    const confirm = grupo.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsNoCoinciden: true };
  }

  registrar(): void {
    if (this.form.invalid) return;
    this.cargando.set(true);
    this.error.set('');

    // Enviar SOLO email + password (confirmPassword no va al backend)
    const { email, password } = this.form.value;

    this.authService.registro({ email, password } as any).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: () => {
        this.error.set('No se pudo registrar. ¿El email ya existe?');
        this.cargando.set(false);
      }
    });
  }

}
