/** Categoría tal como la devuelve el backend. */
export interface Categoria {
  id: number;
  nombre: string;
}

/** Datos para crear o actualizar una categoría (sin id). */
export interface CategoriaRequest {
  nombre: string;
}
