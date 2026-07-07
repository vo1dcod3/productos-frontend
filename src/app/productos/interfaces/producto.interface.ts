export interface Producto {
  id: number;
  nombre: string;
  categoriaId: number;
  categoriaNombre: string;
  precio: number;
  stock: number;
}

export interface ProductoRequest {
  nombre: string;
  categoriaId: number;
  precio: number;
  stock: number;
}
