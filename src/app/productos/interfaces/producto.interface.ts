/** Producto tal como lo devuelve el backend (incluye el nombre de la categoría ya resuelto). */
export interface Producto {
  id: number;
  nombre: string;
  categoriaId: number;
  categoriaNombre: string;
  precio: number;
  stock: number;
}

/** Datos para crear o actualizar un producto (sin id ni nombre de categoría). */
export interface ProductoRequest {
  nombre: string;
  categoriaId: number;
  precio: number;
  stock: number;
}
