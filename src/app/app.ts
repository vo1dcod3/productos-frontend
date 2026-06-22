import { Component } from '@angular/core';
import { ProductosPageComponent } from './productos/pages/productos-page/productos-page.component';

@Component({
  selector: 'app-root',
  imports: [ProductosPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}