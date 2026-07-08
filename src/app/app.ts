import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
/**
 * Componente raíz de la aplicación; hospeda el RouterOutlet.
 */
export class App {}