import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoRequest } from '../interfaces/producto.interface';
import { environment } from '../../../environments/environments';

/**
 * Servicio de acceso al API REST de productos (CRUD y consulta de categorías).
 */
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly apiUrl = `${environment.apiUrl}/productos`;
  private readonly http = inject(HttpClient);

  /** Retorna todos los productos. */
  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  /** Retorna el producto con el id indicado. */
  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  /** Crea un producto y retorna el creado. */
  crear(producto: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  /** Actualiza el producto indicado y retorna el actualizado. */
  actualizar(id: number, producto: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  /** Elimina el producto indicado. */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Retorna los nombres de categorías disponibles. */
  obtenerCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`);
  }
}