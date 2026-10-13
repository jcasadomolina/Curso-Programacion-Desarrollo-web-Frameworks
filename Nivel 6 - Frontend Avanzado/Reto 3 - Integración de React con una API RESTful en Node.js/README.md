Este proyecto es una aplicación web sencilla para gestionar una lista de usuarios. Está dividido en dos partes: un [[Frontend]] construido con [[React]] y [[Vite]], y un [[Backend]] construido con [[Node.js]] y [[Express]]. Ambos procesos se ejecutan de forma independiente y se comunican mediante una [[API REST]] sobre [[HTTP]].

  

La información se mantiene temporalmente en memoria dentro del servidor. Por tanto, los usuarios se pierden cuando el proceso del backend se reinicia.

  

## Tecnologías utilizadas

  

- [[JavaScript]] como lenguaje principal.

- [[React]] para construir la [[Interfaz de usuario]] mediante componentes.

- [[React DOM]] para montar la aplicación en el navegador.

- [[Vite]] como herramienta de desarrollo, servidor local y sistema de construcción.

- [[Node.js]] como entorno de ejecución del servidor.

- [[Express]] como [[Framework web]] del backend.

- [[CORS]] para controlar las peticiones entre distintos [[Origen|orígenes]].

- [[Fetch API]] para realizar peticiones desde el navegador.

- [[HTML]] como estructura base del documento.

- [[CSS]] para los estilos globales y la presentación visual.

- [[JSON]] como formato de intercambio de datos.

- [[Oxlint]] para revisar posibles problemas en el código del frontend.

  

## Estructura del proyecto

  

El workspace contiene dos aplicaciones relacionadas:

  

```text

Reto 3/

├── reto-3/                 # Aplicación frontend

│   ├── index.html

│   ├── package.json

│   ├── vite.config.js

│   ├── public/

│   ├── docs/

│   │   └── documentacion-proyecto.md

│   └── src/

│       ├── App.jsx

│       ├── App.css

│       ├── index.css

│       ├── main.jsx

│       └── assets/

└── reto3-backend/          # Servidor backend

    ├── package.json

    └── server.js

```

  

## Configuración del frontend

  

El frontend está definido en `reto-3/package.json`. Su configuración utiliza [[ES Modules]] mediante la propiedad `"type": "module"` y proporciona estos comandos:

  

- `npm run dev`: inicia el servidor de desarrollo de [[Vite]].

- `npm run build`: genera la versión optimizada para producción.

- `npm run lint`: ejecuta [[Oxlint]].

- `npm run preview`: sirve localmente la versión construida.

  

### Entrada de la aplicación

  

`index.html` define el documento inicial y contiene el elemento `<div id="root">`. Este elemento actúa como [[Punto de montaje]] de la aplicación de [[React]]. También carga `src/main.jsx` como [[Módulo JavaScript]].

  

En `src/main.jsx` se realizan tres tareas:

  

1. Se importa `index.css` para aplicar los estilos globales.

2. Se importa el componente raíz `App` desde `App.jsx`.

3. Se utiliza `createRoot` de [[React DOM]] para renderizar `<App />` dentro del elemento `root`.

  

La aplicación está envuelta en [[Strict Mode]], que ayuda a detectar patrones problemáticos durante el desarrollo.

  

### Componente principal

  

`src/App.jsx` contiene el componente `App`, responsable de la interacción con los usuarios:

  

- Mantiene la colección de usuarios en un [[Estado|estado]] llamado `usuarios`.

- Mantiene el texto del formulario en el estado `nuevoNombre`.

- Usa `useEffect` para cargar los usuarios cuando el componente se renderiza por primera vez.

- Usa `useState` para gestionar los datos que cambian durante la interacción.

- Renderiza el formulario de alta y la lista de usuarios con `map`.

- Permite eliminar un usuario desde un botón asociado a su identificador.

  

`src/index.css` contiene los estilos globales, variables de color, tipografías, diseño adaptable y reglas del contenedor principal. `src/App.css` conserva estilos adicionales del template inicial, aunque la interfaz implementada en `App.jsx` utiliza principalmente estilos escritos directamente en los elementos.

  

### Configuración de Vite

  

`vite.config.js` utiliza `defineConfig` y registra `@vitejs/plugin-react`. Este plugin permite que [[Vite]] procese correctamente la sintaxis [[JSX]] empleada por [[React]].

  

## Configuración del backend

  

El backend está definido en `reto3-backend/package.json`. Utiliza [[CommonJS]] mediante `"type": "commonjs"` y depende de:

  

- `express`: crea el servidor web y define las rutas.

- `cors`: añade el middleware de control de [[CORS]].

  

El archivo `reto3-backend/server.js` crea una instancia de [[Express]] y determina el puerto con la expresión `process.env.PORT || 3000`. Esto permite usar un puerto proporcionado por el entorno y, si no existe, utilizar el puerto `3000`.

  

El servidor registra estos [[Middleware|middlewares]]:

  

```js

app.use(cors());

app.use(express.json());

```

  

`cors()` permite que el navegador acepte peticiones del frontend aunque este se sirva desde otro origen. `express.json()` analiza el cuerpo de las peticiones que contienen [[JSON]] y lo deja disponible en `req.body`.

  

Los usuarios se almacenan en el array `usuarios`, por lo que se trata de una persistencia temporal en memoria y no de una [[Base de datos]].

  

## Archivos principales y función

  

| Archivo | Función |

|---|---|

| `reto-3/index.html` | Documento HTML inicial y punto de entrada del navegador. |

| `reto-3/package.json` | Dependencias y scripts del frontend. |

| `reto-3/vite.config.js` | Configuración de Vite y del plugin de React. |

| `reto-3/src/main.jsx` | Arranque y montaje de React en el DOM. |

| `reto-3/src/App.jsx` | Lógica de la interfaz, estados y peticiones a la API. |

| `reto-3/src/index.css` | Estilos globales y diseño base. |

| `reto-3/src/App.css` | Estilos adicionales heredados del template. |

| `reto3-backend/package.json` | Dependencias y configuración del backend. |

| `reto3-backend/server.js` | Servidor Express, middleware, datos y rutas de la API. |

| `docs/documentacion-proyecto.md` | Documentación estructurada para Obsidian. |

  

## API del backend

  

La [[API REST]] expone el recurso `/api/usuarios`.

  

### Obtener usuarios

  

```http

GET http://localhost:3000/api/usuarios

```

  

El servidor responde con un objeto JSON que contiene `exito` y el array `usuarios`.

  

### Crear un usuario

  

```http

POST http://localhost:3000/api/usuarios

Content-Type: application/json

  

{

  "nombre": "Nuevo usuario",

  "rol": "User"

}

```

  

El backend crea un objeto con `id`, `nombre` y `rol`. Si no se proporciona el rol, se utiliza `User` como valor predeterminado.

  

### Eliminar un usuario

  

```http

DELETE http://localhost:3000/api/usuarios/:id

```

  

El parámetro `:id` se convierte a número y se utiliza para filtrar el array. Después, el servidor devuelve un mensaje de confirmación.

  

## Conexión frontend y backend

  

La comunicación se realiza directamente desde el navegador mediante [[Fetch API]]. El flujo principal es el siguiente:

  

1. El usuario abre el frontend servido por [[Vite]].

2. `main.jsx` monta el componente `App`.

3. El [[Hook|hook]] `useEffect` ejecuta `cargarUsuarios` después del primer renderizado.

4. `cargarUsuarios` envía una petición `GET` a `http://localhost:3000/api/usuarios`.

5. El backend recibe la petición, consulta el array en memoria y devuelve JSON.

6. El frontend convierte la respuesta con `res.json()` y actualiza `usuarios` mediante `setUsuarios`.

7. [[React]] vuelve a renderizar la lista con los datos actualizados.

  

Para añadir un usuario, el formulario ejecuta `agregarUsuario`. La función evita el comportamiento predeterminado del formulario, serializa los datos con `JSON.stringify` y envía una petición `POST`. Tras recibir una respuesta correcta, vuelve a cargar la lista y limpia el campo de nombre.

  

Para borrar un usuario, `eliminarUsuario` añade el identificador a la URL y envía una petición `DELETE`. Cuando la API confirma la operación, el frontend vuelve a solicitar la colección completa para reflejar el cambio.

  

## CORS como mecanismo de seguridad

  

[[CORS]] significa [[Cross-Origin Resource Sharing]]. Los navegadores aplican la [[Same-Origin Policy]], que limita las peticiones realizadas desde un origen a recursos servidos por otro origen. En desarrollo, es habitual que el frontend y el backend utilicen puertos diferentes, por ejemplo:

  

- Frontend: origen proporcionado por Vite, normalmente `http://localhost:5173`.

- Backend: `http://localhost:3000`.

  

Aunque ambos se ejecuten en el mismo equipo, los puertos diferentes hacen que sean orígenes distintos. `app.use(cors())` añade las cabeceras necesarias para que el navegador permita al frontend leer las respuestas de la API.

  

En este proyecto, CORS funciona como una medida de control de acceso del navegador, pero no sustituye a la [[Autenticación]], la [[Autorización]], la validación de datos ni la protección contra ataques. Además, `cors()` sin opciones permite peticiones desde cualquier origen, una configuración cómoda para desarrollo pero demasiado abierta para producción. En un entorno real convendría restringirlo al dominio concreto del frontend:

  

```js

app.use(cors({

  origin: 'https://dominio-del-frontend.example'

}));

```

  

La seguridad completa también debería incluir validación del contenido recibido, gestión de errores, almacenamiento persistente y controles de permisos en las operaciones de la API.

  

## Flujo resumido

  

```text

Navegador

   │

   │ Renderiza React y ejecuta Fetch API

   ▼

Frontend Vite (puerto de desarrollo)

   │

   │ GET /api/usuarios

   │ POST /api/usuarios

   │ DELETE /api/usuarios/:id

   ▼

Backend Express (puerto 3000)

   │

   │ CORS + Express JSON

   ▼

Array de usuarios en memoria

```

  

## Conceptos clave

  

- [[Componente]]: unidad reutilizable de interfaz en React.

- [[Estado|Estado local]]: datos variables que provocan un nuevo renderizado cuando cambian.

- [[Hook]]: función especial de React que permite usar capacidades como el estado y los efectos.

- [[Renderizado]]: proceso de convertir el estado y la estructura JSX en elementos visibles.

- [[Ruta|Ruta HTTP]]: combinación de método y URL que identifica una operación de la API.

- [[Middleware]]: función intermedia que procesa una petición antes de llegar a la ruta.

- [[Endpoint]]: punto de acceso concreto de una API.

- [[Persistencia]]: conservación de datos después de reiniciar una aplicación; en este proyecto todavía no existe porque los datos se guardan en memoria.

- [[Desarrollo local]]: ejecución de frontend y backend en el equipo del desarrollador para probar la aplicación.