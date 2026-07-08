# Productos Frontend

![CI](https://github.com/vo1dcod3/productos-frontend/actions/workflows/ci.yml/badge.svg)

Aplicación **Angular** para gestionar un catálogo de productos y categorías, con **autenticación JWT** y un dashboard con métricas y gráficos. Consume la API REST de [productos-api](https://github.com/vo1dcod3/productos-api).

## Tecnologías

- **Angular 21** (standalone components)
- **TypeScript**
- **Signals** + `computed` + `effect` — estado reactivo
- **Reactive Forms** — formularios y validación
- **HttpClient** + interceptors funcionales
- **Chart.js** — gráficos del dashboard
- **Bootstrap 5** — estilos
- **JWT** — autenticación (token en `localStorage`)

## Funcionalidades

### Autenticación
- **Login** y **registro** con diseño split-screen (panel de marca + formulario).
- Registro con **validación de contraseñas que coinciden** (validador a nivel de formulario).
- **Guard funcional** que protege las rutas privadas.
- **Interceptor** que añade el token JWT a cada petición.
- Perfil del usuario (email + iniciales) en la barra de navegación.

### Gestión de productos
- **Dashboard** con métricas (total de productos, stock bajo, categorías) y **gráfico** de productos por categoría (Chart.js).
- **CRUD de productos** con formulario crear/editar.
- **CRUD de categorías** con edición y borrado.
- Buscador por nombre en tiempo real.
- Badge visual para **stock bajo** (≤ 5 unidades).
- Borrado lógico con confirmación vía toast.
- **Interceptor** de manejo centralizado de errores HTTP.

## Estructura

```
src/app/
├── auth/
│   ├── pages/            → login-page, register-page
│   └── services/         → auth.service (login, registro, JWT)
├── categorias/
│   ├── interfaces/       → Categoria, CategoriaRequest
│   └── services/         → categoria.service
├── productos/
│   ├── interfaces/       → Producto, ProductoRequest
│   ├── pages/            → productos-page (dashboard + CRUD)
│   └── services/         → producto.service
└── shared/
    ├── components/       → toast
    ├── guards/           → auth-guard (rutas protegidas)
    └── interceptors/     → auth-interceptor (JWT), http-error-interceptor
```

## Cómo ejecutar

### Requisitos
- Node 22
- Angular CLI 21
- `productos-api` corriendo en `http://localhost:8080`

### Desarrollo local (con recarga en caliente)

```bash
ng serve
```

La app queda en `http://localhost:4200`. En modo desarrollo consume la API en `http://localhost:8080/api`.

### Con Docker Compose

Desde la raíz de `productos-api` (levanta base + backend + frontend):

```bash
docker compose up --build
```

La app queda en `http://localhost:4200`, servida por **Nginx**, que además hace de proxy inverso hacia la API.

## Configuración por ambiente

La URL de la API cambia según el entorno mediante `fileReplacements` de Angular:

| Ambiente | Archivo | `apiUrl` |
|----------|---------|----------|
| Desarrollo (`ng serve`) | `environments.ts` | `http://localhost:8080/api` |
| Producción (Docker/build) | `environment.prod.ts` | `/api` (relativo, resuelto por Nginx) |

## Autor

Manuel Fuentealba — [github.com/vo1dcod3](https://github.com/vo1dcod3)
