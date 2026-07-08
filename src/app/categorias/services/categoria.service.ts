import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaRequest } from '../interfaces/categoria.interface';
import { environment } from '../../../environments/environments';

/**
 * Servicio de acceso al API REST de categorías (CRUD).
 */
@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private readonly apiUrl = `${environment.apiUrl}/categorias`;
  private readonly http = inject(HttpClient);

  /** Retorna todas las categorías. */
  obtenerTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  /** Crea una categoría y retorna la creada. */
  crear(dto: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, dto);
  }

  /** Actualiza la categoría indicada y retorna la actualizada. */
  actualizar(id: number, dto: CategoriaRequest): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, dto);
  }

  /** Elimina la categoría indicada. */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
