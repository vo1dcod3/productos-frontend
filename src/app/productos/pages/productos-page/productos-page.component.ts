import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoRequest } from '../../interfaces/producto.interface';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { AuthService } from '../../../auth/services/auth.service';
import { CategoriaService } from '../../../categorias/services/categoria.service';
import { Categoria, CategoriaRequest } from '../../../categorias/interfaces/categoria.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-productos-page',
  imports: [ReactiveFormsModule, DecimalPipe, ToastComponent],
  templateUrl: './productos-page.component.html',
  styleUrl: './productos-page.component.css'
})
/**
 * Página principal de gestión: administra el CRUD de productos y categorías,
 * calcula métricas del catálogo con signals/computed y renderiza un gráfico de
 * barras (Chart.js) con la distribución de productos por categoría.
 */
export class ProductosPageComponent implements OnInit {

  private readonly productoService  = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly fb               = inject(FormBuilder);
  private readonly toast            = viewChild.required(ToastComponent);
  readonly authService              = inject(AuthService);

  private graficoCanvas = viewChild<ElementRef>('graficoCanvas');
  private chart: Chart | null = null;

  // ── Productos ──────────────────────────────────────────────
  productos          = signal<Producto[]>([]);
  cargando           = signal(true);
  error              = signal('');
  mostrarFormulario  = signal(false);
  productoEditando   = signal<Producto | null>(null);
  filtroNombre       = signal('');

  // ── Categorías ─────────────────────────────────────────────
  categorias             = signal<Categoria[]>([]);
  mostrarFormCategoria   = signal(false);
  categoriaEditando      = signal<Categoria | null>(null);

  // ── Métricas ───────────────────────────────────────────────
  totalProductos        = computed(() => this.productos().length);
  // Umbral de negocio: se considera "stock bajo" con 5 unidades o menos.
  stockBajoCount        = computed(() => this.productos().filter(p => p.stock <= 5).length);
  categoriasCount       = computed(() => this.categorias().length);

  // Agrupa la cantidad de productos por nombre de categoría; alimenta el gráfico.
  productosPorCategoria = computed(() => {
    const map = new Map<string, number>();
    this.productos().forEach(p =>
      map.set(p.categoriaNombre, (map.get(p.categoriaNombre) ?? 0) + 1)
    );
    return map;
  });

  productosFiltrados = computed(() => {
    const filtro = this.filtroNombre().toLowerCase();
    if (!filtro) return this.productos();
    return this.productos().filter(p =>
      p.nombre.toLowerCase().includes(filtro)
    );
  });

  // ── Formulario producto ────────────────────────────────────
  form: FormGroup = this.fb.group({
    nombre:     ['', Validators.required],
    categoriaId: [null, Validators.required],
    precio:     [null, [Validators.required, Validators.min(0)]],
    stock:      [null, [Validators.required, Validators.min(0)]]
  });

  // ── Formulario categoría ───────────────────────────────────
  formCategoria: FormGroup = this.fb.group({
    nombre: ['', Validators.required]
  });

  constructor() {
    // El effect reacciona a cambios en los signals leídos (productosPorCategoria y
    // graficoCanvas): cada vez que cambian los datos o aparece el canvas, se re-dibuja el gráfico.
    effect(() => {
      const datos = this.productosPorCategoria();
      if (datos.size === 0) return;
      const canvas = this.graficoCanvas()?.nativeElement;
      if (!canvas) return; // el canvas aún no está en el DOM; el effect volverá a correr cuando exista.
      this.renderizarGrafico(canvas, datos);
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  // ── Gráfico ────────────────────────────────────────────────
  private renderizarGrafico(canvas: HTMLCanvasElement, datos: Map<string, number>): void {
    // Chart.js no reutiliza un canvas ya inicializado: hay que destruir la instancia previa
    // antes de crear una nueva o lanza "Canvas is already in use".
    if (this.chart) { this.chart.destroy(); this.chart = null; }
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [...datos.keys()],
        datasets: [{
          label: 'Productos',
          data: [...datos.values()],
          backgroundColor: 'rgba(13, 110, 253, 0.15)',
          borderColor: 'rgba(13, 110, 253, 0.8)',
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ── Productos CRUD ─────────────────────────────────────────
  /** Carga la lista de productos desde el backend y actualiza el estado de carga/error. */
  cargarProductos(): void {
    this.cargando.set(true);
    this.productoService.obtenerTodos().subscribe({
      next: (data) => { this.productos.set(data); this.cargando.set(false); },
      error: () => { this.error.set('Error al cargar los productos'); this.cargando.set(false); }
    });
  }

  /** Abre el formulario en modo editar (si se pasa un producto) o crear (si no). */
  abrirFormulario(producto?: Producto): void {
    if (producto) {
      this.productoEditando.set(producto);
      this.form.patchValue({ ...producto });
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

  /** Persiste el producto: actualiza si hay uno en edición, o crea uno nuevo. */
  guardar(): void {
    if (this.form.invalid) return;
    const datos: ProductoRequest = this.form.value;
    const editando = this.productoEditando();

    // La presencia de un producto en edición decide entre PUT (actualizar) y POST (crear).
    if (editando) {
      this.productoService.actualizar(editando.id, datos).subscribe({
        next: () => { this.cerrarFormulario(); this.cargarProductos(); this.toast().mostrar('Producto actualizado correctamente', 'success'); },
        error: () => this.toast().mostrar('Error al actualizar el producto', 'danger')
      });
    } else {
      this.productoService.crear(datos).subscribe({
        next: () => { this.cerrarFormulario(); this.cargarProductos(); this.toast().mostrar('Producto creado correctamente', 'success'); },
        error: () => this.toast().mostrar('Error al crear el producto', 'danger')
      });
    }
  }

  /** Elimina el producto indicado y recarga la lista. */
  eliminar(id: number): void {
    this.productoService.eliminar(id).subscribe({
      next: () => { this.cargarProductos(); this.toast().mostrar('Producto eliminado correctamente', 'warning'); },
      error: () => this.toast().mostrar('Error al eliminar el producto', 'danger')
    });
  }

  // ── Categorías CRUD ────────────────────────────────────────
  /** Carga la lista de categorías desde el backend. */
  cargarCategorias(): void {
    this.categoriaService.obtenerTodas().subscribe({
      next: (data) => this.categorias.set(data)
    });
  }

  /** Abre el formulario de categoría en modo editar (si se pasa una) o crear (si no). */
  abrirFormCategoria(categoria?: Categoria): void {
    if (categoria) {
      this.categoriaEditando.set(categoria);
      this.formCategoria.patchValue({ nombre: categoria.nombre });
    } else {
      this.categoriaEditando.set(null);
      this.formCategoria.reset();
    }
    this.mostrarFormCategoria.set(true);
  }

  cerrarFormCategoria(): void {
    this.mostrarFormCategoria.set(false);
    this.formCategoria.reset();
  }

  /** Persiste la categoría: actualiza si hay una en edición, o crea una nueva. */
  guardarCategoria(): void {
    if (this.formCategoria.invalid) return;
    const dto: CategoriaRequest = this.formCategoria.value;
    const editando = this.categoriaEditando();

    // Igual que en productos: la categoría en edición decide entre actualizar y crear.
    if (editando) {
      this.categoriaService.actualizar(editando.id, dto).subscribe({
        next: () => { this.cerrarFormCategoria(); this.cargarCategorias(); this.toast().mostrar('Categoría actualizada correctamente', 'success'); },
        error: () => this.toast().mostrar('Error al actualizar la categoría', 'danger')
      });
    } else {
      this.categoriaService.crear(dto).subscribe({
        next: () => { this.cerrarFormCategoria(); this.cargarCategorias(); this.toast().mostrar('Categoría creada correctamente', 'success'); },
        error: () => this.toast().mostrar('Error al crear la categoría', 'danger')
      });
    }
  }

  /** Elimina la categoría indicada y recarga la lista. */
  eliminarCategoria(id: number): void {
    this.categoriaService.eliminar(id).subscribe({
      next: () => { this.cargarCategorias(); this.toast().mostrar('Categoría eliminada correctamente', 'warning'); },
      error: () => this.toast().mostrar('Error al eliminar la categoría', 'danger')
    });
  }

  /** Cierra la sesión del usuario. */
  logout(): void {
    this.authService.logout();
  }
}
