import { Component, signal } from '@angular/core';

export interface ToastMessage {
  mensaje: string;
  tipo: 'success' | 'danger' | 'warning';
}

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  toasts = signal<ToastMessage[]>([]);

  mostrar(mensaje: string, tipo: 'success' | 'danger' | 'warning' = 'success'): void {
    this.toasts.update(t => [...t, { mensaje, tipo }]);
    setTimeout(() => this.cerrar(0), 3000);
  }

  cerrar(index: number): void {
    this.toasts.update(t => t.filter((_, i) => i !== index));
  }
}