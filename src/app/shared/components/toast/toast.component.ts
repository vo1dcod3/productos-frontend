import { Component, signal } from '@angular/core';

/** Mensaje de notificación (toast) con su nivel visual. */
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
/**
 * Componente de notificaciones tipo toast; muestra mensajes temporales
 * de éxito, error o advertencia.
 */
export class ToastComponent {

  toasts = signal<ToastMessage[]>([]);

  /** Agrega un toast y programa su cierre automático a los 3 segundos. */
  mostrar(mensaje: string, tipo: 'success' | 'danger' | 'warning' = 'success'): void {
    this.toasts.update(t => [...t, { mensaje, tipo }]);
    // Se cierra siempre el índice 0 (el más antiguo) para respetar el orden FIFO de aparición.
    setTimeout(() => this.cerrar(0), 3000);
  }

  /** Elimina el toast en la posición indicada. */
  cerrar(index: number): void {
    this.toasts.update(t => t.filter((_, i) => i !== index));
  }
}