# Productos Frontend

Frontend Angular para gestionar un catálogo de productos, consumiendo la API REST de productos-api.

## Tecnologías

- Angular 21
- TypeScript
- Signals (estado reactivo)
- Reactive Forms
- HttpClient
- Bootstrap 5

## Funcionalidades

- Listado de productos activos
- Buscador por nombre en tiempo real
- Formulario para crear y editar productos
- Borrado lógico con confirmación via toast
- Select de categorías cargado desde la API
- Badge visual para stock bajo (≤ 5 unidades)
- Interceptor HTTP para manejo centralizado de errores
- Environments para configuración por ambiente

## Estructura

```
src/app/
├── productos/
│   ├── components/
│   ├── interfaces/       → Producto, ProductoRequest
│   ├── pages/            → productos-page
│   └── services/         → producto.service
└── shared/
    ├── components/       → toast
    └── interceptors/     → http-error.interceptor
```

## Cómo ejecutar

### Requisitos
- Node 22
- Angular CLI 21
- productos-api corriendo en `http://localhost:8080`

### Desarrollo local

```bash
ng serve
```

La app queda disponible en `http://localhost:4200`

### Con Docker Compose (recomendado)

Desde la raíz de `productos-api`:

```bash
docker compose up
```

Levanta PostgreSQL + Spring Boot con un solo comando.

## Variables de entorno

La URL de la API se configura en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```
