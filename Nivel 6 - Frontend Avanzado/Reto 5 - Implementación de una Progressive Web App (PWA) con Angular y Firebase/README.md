# Documentacion del Reto 5

## Resumen

Noto es una aplicacion responsive de gestion de notas construida con [[Angular]] y [[TypeScript]]. Incluye tres vistas principales: notas, calendario y tablero. La informacion se sincroniza con [[Firebase Realtime Database]] mediante [[AngularFire]] y mantiene una copia local para continuar trabajando sin conexion.

El proyecto tambien esta preparado como [[PWA]] mediante un [[Service Worker]], un manifiesto instalable y una compilacion de produccion con [[SSR]].

## Objetivos del proyecto

- Crear, editar y eliminar notas.
- Organizar cada nota en las columnas de ideas, en curso o hecho.
- Asignar etiquetas, colores y fechas.
- Consultar las notas en una vista de calendario.
- Consultar el progreso en un tablero tipo flujo.
- Guardar datos localmente cuando no existe conexion.
- Sincronizar automaticamente los cambios pendientes cuando vuelve Internet.
- Permitir la instalacion de la aplicacion como [[PWA]].
- Servir la aplicacion mediante renderizado en servidor y posterior hidratacion en el navegador.

## Tecnologias principales

- [[Angular]]: framework principal de la interfaz y de la estructura de la aplicacion.
- [[TypeScript]]: lenguaje usado para componentes, modelos y servicios.
- [[Angular CLI]]: herramienta para compilar, ejecutar y probar el proyecto.
- [[AngularFire]]: integracion entre Angular y los servicios de Firebase.
- [[Firebase Realtime Database]]: base de datos remota sincronizada en tiempo real.
- [[RxJS]]: biblioteca usada por AngularFire para exponer datos reactivos mediante observables.
- [[Signals]]: mecanismo reactivo de Angular usado para mantener el estado local de la interfaz.
- [[localStorage]]: almacenamiento persistente del navegador para las notas y operaciones pendientes.
- [[PWA]]: modelo de aplicacion web instalable y capaz de trabajar con recursos cacheados.
- [[Service Worker]]: proceso del navegador que cachea los recursos y permite cargar la aplicacion sin red.
- [[SSR]]: renderizado inicial de la aplicacion en el servidor.
- [[Express]]: servidor HTTP que entrega los archivos y procesa las peticiones SSR.
- [[Vitest]]: ejecutor usado por la configuracion de pruebas unitarias.

## Estructura general

```text
reto5/
|-- angular.json
|-- ngsw-config.json
|-- package.json
|-- README.md
|-- DOCUMENTACION_RETO_5.md
|-- public/
|   |-- manifest.webmanifest
|   `-- icons/
`-- src/
    |-- index.html
    |-- main.ts
    |-- main.server.ts
    |-- server.ts
    |-- styles.css
    |-- app/
    |   |-- app.ts
    |   |-- app.html
    |   |-- app.css
    |   |-- app.config.ts
    |   |-- app.config.server.ts
    |   |-- app.routes.ts
    |   |-- app.routes.server.ts
    |   |-- app.spec.ts
    |   |-- note.model.ts
    |   `-- notes-firebase.service.ts
    `-- environments/
        |-- environment.ts
        `-- environment.example.ts
```

## Archivos de configuracion

### `package.json`

Define la identidad del proyecto, sus dependencias y sus scripts principales:

- `npm start` inicia el servidor de desarrollo.
- `npm run build` crea la compilacion de produccion.
- `npm test` ejecuta las pruebas unitarias.
- `npm run serve:ssr:reto5` inicia el servidor generado en el puerto `4000`.

Las dependencias mas relevantes son `@angular/core`, `@angular/fire`, `firebase`, `@angular/service-worker`, `@angular/ssr`, `express` y `rxjs`.

### `angular.json`

Es la configuracion de [[Angular CLI]]. Define:

- El archivo de entrada del navegador.
- El archivo de entrada del servidor.
- Los estilos globales y los recursos publicos.
- Las configuraciones de desarrollo y produccion.
- La generacion del [[Service Worker]] mediante `ngsw-config.json`.
- El modo de salida `server` para [[SSR]].
- Los hosts locales autorizados: `localhost` y `127.0.0.1`.

La propiedad `security.allowedHosts` evita que el servidor SSR rechace las peticiones locales por proteccion frente a ataques [[SSRF]].

### `tsconfig.json`, `tsconfig.app.json` y `tsconfig.spec.json`

Estos archivos contienen las opciones del compilador de [[TypeScript]] para el proyecto, la aplicacion y las pruebas, respectivamente. Permiten comprobar tipos antes de generar el resultado final.

### `environment.ts`

Contiene la configuracion publica necesaria para inicializar la aplicacion web de [[Firebase]]:

- `apiKey`
- `authDomain`
- `projectId`
- `databaseURL`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

La propiedad `databaseURL` identifica la instancia concreta de [[Firebase Realtime Database]] usada por el servicio de notas.

La configuracion web puede aparecer en el cliente y no debe considerarse un secreto. La proteccion real depende de las reglas de la base de datos y de la autenticacion.

### `environment.example.ts`

Sirve como plantilla para copiar la estructura de configuracion sin guardar los valores reales del proyecto.

### `README.md`

Incluye instrucciones basicas de instalacion, desarrollo, compilacion, pruebas y configuracion de Firebase. Tambien documenta las decisiones iniciales de dependencias.

## Configuracion de AngularFire y Firebase

### `src/app/app.config.ts`

Registra los proveedores globales de la aplicacion:

- Inicializa [[Firebase]] con `initializeApp(environment.firebase)`.
- Configura [[Firebase Realtime Database]] con `provideDatabase` y `getDatabase`.
- Activa las rutas de Angular.
- Activa la hidratacion del cliente despues del renderizado del servidor.
- Registra el [[Service Worker]] solo cuando no se esta ejecutando en modo desarrollo.

El registro del worker usa la estrategia `registerWhenStable:30000`, por lo que el navegador puede tardar hasta treinta segundos en registrarlo despues de cargar la pagina.

### `src/app/app.config.server.ts`

Contiene la configuracion especifica que se usa durante el renderizado en servidor.

### `src/app/app.routes.ts` y `src/app/app.routes.server.ts`

Definen las rutas del cliente y la configuracion de rutas que participa en el renderizado del servidor. La aplicacion actual funciona principalmente en una vista unica, pero conserva esta separacion para permitir crecimiento posterior.

## Modelo de datos

### `src/app/note.model.ts`

Define el contrato `Note` de una nota:

- `id`: identificador de Firebase o identificador local.
- `title`: titulo.
- `content`: contenido.
- `tag`: etiqueta.
- `color`: color visual.
- `date`: fecha asociada.
- `column`: estado del tablero.

`NoteColumn` limita el estado de una nota a `ideas`, `doing` o `done`. El identificador es opcional porque una nota nueva se crea primero en la interfaz y recibe un identificador generado antes de sincronizarse.

## Interfaz y flujo de usuario

### `src/app/app.ts`

Es el componente principal. Usa [[Signals]] para almacenar y derivar el estado de la interfaz:

- `activeView` controla la vista actual.
- `searchTerm` controla la busqueda.
- `editingId` identifica la nota que se esta editando.
- `selectedDate` controla la fecha seleccionada.
- `calendarMonth` controla el mes visible.
- `notes` recibe el estado mantenido por `NotesFirebaseService`.
- `filteredNotes`, `calendarDays` y otros valores derivados se calculan con valores reactivos.

Las acciones principales son:

- `saveNote`: crea una nota o guarda cambios.
- `editNote`: carga una nota en el formulario.
- `deleteNote`: elimina una nota.
- `moveNote`: cambia la columna del tablero.
- `addToCalendar`: asigna una fecha.
- `changeCalendarMonth`: navega entre meses.
- `goToToday`: vuelve a la fecha actual.

El componente no escribe directamente en Firebase. Delega todas las operaciones al servicio para centralizar la persistencia remota y local.

### `src/app/app.html`

Es la plantilla declarativa de la interfaz. Usa la sintaxis de plantillas de [[Angular]] para:

- Cambiar entre las vistas de notas, calendario y tablero.
- Renderizar listas con bloques `@for`.
- Mostrar estados vacios con `@empty`.
- Enlazar los campos del formulario con `ngModel`.
- Ejecutar las acciones del componente mediante eventos.

### `src/app/app.css` y `src/styles.css`

Contienen los estilos de la interfaz. `app.css` se centra en el componente principal y `styles.css` contiene estilos globales, tipografia, colores, layout y comportamiento responsive.

### `src/app/app.spec.ts`

Contiene las pruebas basicas del componente principal. Comprueba que la aplicacion se crea correctamente y que se renderiza el titulo esperado.

## Servicio de persistencia y sincronizacion

### `src/app/notes-firebase.service.ts`

Es la pieza central de persistencia. Usa [[AngularFire]], [[Firebase Realtime Database]], [[Signals]], [[RxJS]] y [[localStorage]].

El servicio mantiene:

- `notes$`: [[Observable]] con las notas remotas del nodo `/notes`.
- `notes`: [[Signal]] con el estado que consume la interfaz.
- `online`: indicador de conectividad del navegador.
- `pendingOperations`: cola de operaciones aun no confirmadas por Firebase.

### Creacion de notas

Cuando se crea una nota:

1. Se genera un identificador local formado por la fecha y una parte aleatoria.
2. La nota se inserta inmediatamente en la signal local.
3. La operacion se guarda en `noto-notes-pending`.
4. Si hay conexion, se ejecuta `set` en `notes/id`.
5. Si Firebase confirma la operacion, se elimina de la cola.
6. Si falla la red, la operacion permanece pendiente.

### Edicion y eliminacion

Las ediciones actualizan la interfaz inmediatamente y se guardan como operaciones `update`. Las eliminaciones actualizan la interfaz y se guardan como operaciones `delete`.

La cola se procesa en orden. Esto permite conservar la secuencia de cambios y evita perder una accion realizada sin conexion.

### Recuperacion de conexion

El servicio escucha los eventos `online` y `offline` del navegador. Al recuperar la conexion:

1. Marca la aplicacion como conectada.
2. Recorre la cola pendiente.
3. Ejecuta cada operacion contra Firebase.
4. Elimina cada operacion confirmada de `noto-notes-pending`.
5. Mantiene en la cola la primera operacion que falle para volver a intentarla despues.

Cuando llegan datos remotos, el servicio los aplica al estado local. Si existen operaciones pendientes, las vuelve a aplicar sobre los datos remotos para que los cambios locales no desaparezcan antes de sincronizarse.

### Persistencia local

Se utilizan dos claves del [[Web Storage API]]:

- `noto-notes`: copia local de las notas.
- `noto-notes-pending`: cola serializada de operaciones pendientes.

El acceso esta protegido con `isPlatformBrowser`, por lo que `localStorage` no se consulta durante [[SSR]]. Los errores de lectura o escritura se controlan con `try/catch`.

## Firebase Realtime Database

Las notas se almacenan en el nodo `/notes`. Cada identificador contiene los campos de la interfaz:

```json
{
  "notes": {
    "id-generado": {
      "title": "Titulo",
      "content": "Contenido",
      "tag": "Personal",
      "color": "coral",
      "date": "2026-10-11",
      "column": "ideas"
    }
  }
}
```

La escucha creada con `listVal` permite recibir actualizaciones remotas cuando otro cliente crea, modifica o elimina notas.

## Seguridad

### Reglas actuales

Las reglas configuradas para desarrollo son:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Estas reglas permiten que cualquier cliente lea, modifique o borre todos los datos. Son utiles para una demostracion local, pero no son adecuadas para produccion.

### Recomendacion para produccion

La aplicacion deberia incorporar [[Firebase Authentication]] y sustituir las reglas publicas por reglas asociadas al usuario autenticado. Un punto de partida seria:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Una configuracion mas completa debe separar los datos por identificador de usuario y verificar que cada usuario solo pueda acceder a sus propias notas.

La configuracion web de Firebase no es una contraseña. Sin embargo, nunca deben incluirse claves privadas, tokens administrativos o credenciales de servidor en archivos enviados al navegador.

## PWA y funcionamiento offline

### `public/manifest.webmanifest`

Define los metadatos instalables de la [[PWA]]:

- Nombre y nombre corto.
- Modo `standalone`.
- Ruta de inicio.
- Ambito de navegacion.
- Iconos de distintos tamaños.

### `ngsw-config.json`

Configura el [[Service Worker]] de [[Angular]]:

- El grupo `app` precarga los archivos esenciales.
- El grupo `assets` almacena imagenes y fuentes bajo demanda.
- El manifiesto y los archivos JavaScript y CSS forman parte de los recursos de la aplicacion.

La configuracion se aplica en la compilacion de produccion. En desarrollo, `provideServiceWorker` permanece desactivado.

### Prueba de la PWA

La prueba debe hacerse con el bundle de produccion:

```powershell
npm run build
npm run serve:ssr:reto5
```

Despues se abre `http://localhost:4000` y se comprueba en las herramientas del navegador:

1. En Application > Manifest aparece la aplicacion.
2. En Application > Service Workers aparece `ngsw-worker.js` como activo.
3. En Cache Storage aparecen las caches de Angular.
4. Se activa Offline en Network conditions.
5. Se recarga la pagina y la interfaz sigue disponible.
6. Se crea una nota sin red.
7. Se vuelve a activar la red y se verifica la sincronizacion en Firebase.

La aplicacion debe cargarse primero online y hay que esperar a que el [[Service Worker]] se registre. El registro usa `registerWhenStable:30000`.

Los errores de red que muestran peticiones `.lp` de Firebase mientras el navegador esta offline son esperables: corresponden al mecanismo de reconexion de [[Firebase Realtime Database]].

## Flujos de trabajo

### Flujo de desarrollo

```powershell
npm install
npm start
```

La aplicacion de desarrollo se abre en `http://localhost:4200` y se actualiza automaticamente al modificar los archivos.

### Flujo de creacion online

```text
Formulario -> App -> NotesFirebaseService -> Signal local
                                      `-> Firebase /notes/id
```

La interfaz se actualiza de forma inmediata y Firebase confirma la persistencia remota.

### Flujo de creacion offline

```text
Formulario -> App -> Signal local -> localStorage
                                      `-> Cola pendiente
```

Cuando vuelve la conexion:

```text
Evento online -> Cola pendiente -> Firebase -> Se elimina de la cola
```

### Flujo de compilacion y ejecucion

```text
Codigo fuente -> Angular CLI -> dist/reto5/browser
                              `-> dist/reto5/server
```

El servidor SSR entrega el HTML inicial y los recursos del navegador. Despues la [[Hidratacion]] conecta la interfaz del cliente con el HTML ya generado.

## Comprobaciones realizadas

- Compilacion de produccion completada con `npm run build`.
- Artefactos PWA generados: `ngsw-worker.js`, `ngsw.json` y `manifest.webmanifest`.
- Servidor SSR probado en `http://localhost:4000`.
- Peticion local respondida con codigo HTTP `200`.
- Hosts locales autorizados para evitar el bloqueo SSRF de Angular.
- Persistencia local preparada para operaciones de creacion, edicion y eliminacion.
- Reintento de sincronizacion configurado al recuperar la conexion.

## Mejoras futuras

- Incorporar [[Firebase Authentication]].
- Crear reglas de seguridad por usuario.
- Añadir pruebas unitarias del servicio offline.
- Añadir pruebas de integracion de Firebase.
- Añadir indicadores visuales de estado online, pendiente y sincronizado.
- Resolver conflictos entre cambios simultaneos de varios clientes.
- Sustituir las notas de demostracion por datos iniciales gestionados desde Firebase.
- Añadir una politica para limpiar datos antiguos de `localStorage`.
