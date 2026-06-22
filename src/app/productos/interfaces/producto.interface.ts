export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

export interface ProductoRequest {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}