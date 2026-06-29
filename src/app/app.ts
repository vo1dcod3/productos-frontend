import { Component } from '@angular/core';
import { ProductosPageComponent } from './productos/pages/productos-page/productos-page.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ProductosPageComponent,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}