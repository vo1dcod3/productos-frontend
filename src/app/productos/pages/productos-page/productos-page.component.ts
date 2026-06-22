import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoRequest } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-productos-page',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './productos-page.component.html',
  styleUrl: './productos-page.component.css'
})
export class ProductosPageComponent implements OnInit {

  private readonly productoService = inject(ProductoService);
  private readonly fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  categorias = signal<string[]>([]);
  cargando = signal(true);
  error = signal('');
  mostrarFormulario = signal(false);
  productoEditando = signal<Producto | null>(null);

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    categoria: ['', Validators.required],
    precio: [null, [Validators.required, Validators.min(0)]],
    stock: [null, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.productoService.obtenerTodos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los productos');
        this.cargando.set(false);
      }
    });
  }

  cargarCategorias(): void {
  this.productoService.obtenerCategorias().subscribe({
    next: (data) => this.categorias.set(data)
  });
}

  abrirFormulario(producto?: Producto): void {
    if (producto) {
      this.productoEditando.set(producto);
      this.form.patchValue(producto);
    } else {
      this.productoEditando.set(null);
      this.form.reset();
    }
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) return;

    const datos: ProductoRequest = this.form.value;
    const editando = this.productoEditando();

    if (editando) {
      this.productoService.actualizar(editando.id, datos).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarProductos();
        }
      });
    } else {
      this.productoService.crear(datos).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarProductos();
        }
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productoService.eliminar(id).subscribe({
      next: () => this.cargarProductos()
    });
  }
}