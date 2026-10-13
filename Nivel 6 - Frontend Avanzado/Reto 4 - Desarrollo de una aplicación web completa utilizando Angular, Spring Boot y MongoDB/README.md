# Documentación Reto 4

## 1. Descripción del proyecto

Este proyecto implementa una plataforma para gestionar eventos de un dojo. La solución está dividida en dos aplicaciones principales:

- Un frontend desarrollado con [[Angular]] y [[TypeScript]].
- Un backend desarrollado con [[Spring Boot]] y [[Java]].
- Una base de datos [[MongoDB]] para almacenar usuarios y eventos.
- Un script independiente para realizar [[Pruebas de carga]] sobre la API.

La comunicación entre las aplicaciones se realiza mediante una [[API REST]]. El frontend permite registrarse, iniciar sesión y realizar operaciones de consulta, creación, edición y eliminación de eventos.

## 2. Arquitectura general

```text
Usuario
  |
  v
Frontend Angular
  |
  | HTTP + JWT
  v
Backend Spring Boot
  |
  | Spring Data MongoDB
  v
MongoDB
```

El frontend es responsable de la presentación y de la interacción con el usuario. El backend concentra la lógica de negocio, la validación, la autenticación y la autorización. MongoDB almacena los datos persistentes.

La autenticación utiliza [[JWT]] y el backend funciona con sesiones sin estado mediante [[Spring Security]]. Cada petición protegida debe incluir el token en la cabecera `Authorization`.

## 3. Estructura de carpetas

### Backend

```text
backend/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── src/
    ├── main/
    │   ├── java/com/reto4/fullstack/
    │   │   ├── FullstackApplication.java
    │   │   ├── auth/
    │   │   ├── config/
    │   │   ├── event/
    │   │   ├── security/
    │   │   └── user/
    │   └── resources/application.properties
    └── test/java/com/reto4/fullstack/
```

### Frontend

```text
frontend/
├── angular.json
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts
    ├── main.server.ts
    ├── server.ts
    ├── styles.css
    └── app/
        ├── app.ts
        ├── app.html
        ├── app.css
        ├── app.config.ts
        └── app.spec.ts
```

### Rendimiento

```text
performance/
└── load-test.mjs
```

## 4. Frontend

### `frontend/src/app/app.ts`

Es el componente principal de la aplicación. Gestiona:

- Estado de autenticación mediante [[Signals]].
- Registro e inicio de sesión.
- Almacenamiento temporal del token JWT en memoria.
- Carga de eventos desde el backend.
- Búsqueda local de eventos.
- Creación, edición y eliminación de eventos.
- Mensajes de éxito y error.
- Envío de la cabecera `Authorization` en las peticiones protegidas.

El componente utiliza [[Reactive Forms]] para validar los formularios de usuario y eventos.

La URL base de la API está definida como:

```text
http://localhost:8080/api
```

### `frontend/src/app/app.html`

Contiene la plantilla de la interfaz. La vista presenta dos estados principales:

- Pantalla de autenticación para iniciar sesión o crear un usuario.
- Pantalla de gestión de eventos para usuarios autenticados.

La plantilla utiliza el control de flujo moderno de Angular para mostrar condicionalmente el formulario de autenticación, la tabla de eventos y el modal de creación o edición.

### `frontend/src/app/app.css`

Define los estilos de la pantalla de acceso, la tabla, los botones, los formularios y el modal de eventos. También incluye reglas adaptables para pantallas pequeñas.

### `frontend/src/app/app.config.ts`

Configura los proveedores globales de Angular:

- [[Router]] mediante `provideRouter`.
- Hidratación del cliente mediante [[SSR]].
- [[HttpClient]] con `withFetch`.
- Gestión global de errores del navegador.

### `frontend/src/app/app.spec.ts`

Contiene las pruebas unitarias básicas del componente principal. Comprueba que el componente se crea correctamente y que se muestra la pantalla inicial de acceso.

### `frontend/package.json`

Define las dependencias y los comandos del frontend:

```text
npm start
npm run build
npm test -- --watch=false --no-progress
```

El frontend utiliza [[Vitest]] como motor de ejecución de pruebas a través de la configuración de Angular.

## 5. Backend

### `backend/src/main/java/com/reto4/fullstack/FullstackApplication.java`

Es el punto de entrada de la aplicación [[Spring Boot]]. Arranca el contexto de Spring y el servidor web integrado.

### Paquete `user`

#### `User.java`

Representa el documento de usuario almacenado en MongoDB. Incluye:

- Identificador.
- Nombre.
- Email.
- Contraseña cifrada.
- Rol.
- Fecha de creación.

La contraseña nunca se almacena en texto plano. Se cifra mediante [[BCrypt]].

#### `Role.java`

Define los roles disponibles:

- `USER`: usuario normal.
- `ADMIN`: usuario con permisos globales de administración.

#### `UserRepository.java`

Es un repositorio basado en [[Spring Data MongoDB]]. Permite buscar usuarios por email y comprobar si un email ya está registrado.

### Paquete `event`

#### `Event.java`

Representa un evento del dojo. Sus datos principales son:

- Título.
- Categoría.
- Fecha y hora.
- Ubicación.
- Instructor.
- Capacidad.
- Número de inscritos.
- Estado.
- Email del propietario.
- Fecha de creación.

#### `EventRepository.java`

Proporciona el acceso a los eventos almacenados en MongoDB. Además de las operaciones básicas, permite realizar búsquedas mediante un índice de texto.

#### `EventService.java`

Contiene la lógica de negocio de eventos:

- Crear eventos asociados al usuario autenticado.
- Buscar eventos.
- Validar que las inscripciones no superen la capacidad.
- Actualizar eventos.
- Eliminar eventos.
- Comprobar que el usuario sea propietario o tenga rol `ADMIN`.

#### `EventController.java`

Expone los endpoints HTTP de eventos:

```text
GET    /api/events
GET    /api/events/{id}
POST   /api/events
PUT    /api/events/{id}
DELETE /api/events/{id}
```

La búsqueda puede realizarse mediante el parámetro `search`:

```text
GET /api/events?search=seminario
```

### Paquete `auth`

#### `AuthController.java`

Expone los endpoints de autenticación:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

#### `AuthService.java`

Implementa el flujo de registro y login. Comprueba credenciales, cifra contraseñas, crea usuarios y genera tokens JWT.

#### `AuthDtos.java`

Define los objetos de transferencia de datos para registrar usuarios, iniciar sesión y devolver información pública del usuario.

## 6. Configuración de MongoDB

La conexión se define en `backend/src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/reto4
spring.data.mongodb.auto-index-creation=true
```

La aplicación utiliza:

- Host local `localhost`.
- Puerto estándar de MongoDB.
- Base de datos `reto4`.
- Creación automática de índices durante el desarrollo.

MongoDB crea la base de datos y las colecciones de forma diferida cuando se realiza la primera escritura. Por ello, la base de datos puede no aparecer en MongoDB Compass hasta registrar un usuario o guardar un evento correctamente.

### Colección `users`

Almacena los usuarios registrados. El email tiene un índice único para evitar duplicados.

### Colección `events`

Almacena los eventos del dojo. Se han definido índices para optimizar las consultas más frecuentes:

- Índice de texto sobre título, categoría e instructor.
- Índice compuesto por estado y fecha.
- Índice compuesto por propietario y fecha.

Estos índices reducen el coste de las búsquedas y facilitan la consulta de calendarios filtrados.

## 7. Seguridad

### Autenticación

El registro y el login son endpoints públicos. Cuando el login es correcto, el backend devuelve un token [[JWT]].

El frontend incluye el token en las peticiones protegidas:

```http
Authorization: Bearer token_jwt
```

### Autorización

La configuración de seguridad se encuentra en `SecurityConfig.java`.

La aplicación utiliza:

- [[Spring Security]].
- Sesiones sin estado.
- Filtro JWT por petición.
- Contraseñas cifradas mediante BCrypt.
- Roles de usuario.
- Protección de todos los endpoints salvo registro y login.

Un usuario puede modificar o eliminar sus propios eventos. Un usuario con rol `ADMIN` puede gestionar eventos de cualquier propietario.

### `JwtService.java`

Genera, valida y decodifica los tokens JWT. La clave y la duración se configuran mediante variables de entorno:

```properties
app.jwt.secret=${JWT_SECRET:change-this-development-secret-key-to-at-least-32-characters}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
```

En producción se debe establecer `JWT_SECRET` con una clave segura y no utilizar el valor predeterminado.

### `JwtAuthenticationFilter.java`

Lee la cabecera `Authorization`, valida el token y coloca la identidad autenticada en el contexto de seguridad de Spring.

### `WebConfig.java`

Configura [[CORS]] para permitir las peticiones del frontend local en los puertos `4200` y `4300`.

## 8. Flujos de trabajo principales

### Registro e inicio de sesión

1. El usuario introduce sus datos en Angular.
2. El frontend envía una petición a `/api/auth/register` o `/api/auth/login`.
3. El backend valida los datos.
4. La contraseña se cifra o se comprueba mediante BCrypt.
5. El backend genera un JWT.
6. Angular conserva el token durante la sesión.
7. Las siguientes peticiones incluyen el token.

### Crear un evento

1. El usuario abre el formulario de evento.
2. Angular valida los campos obligatorios.
3. Se envía un `POST` a `/api/events`.
4. Spring Security valida el JWT.
5. El servicio comprueba la capacidad del evento.
6. Se asigna el email del usuario como propietario.
7. MongoDB almacena el documento.
8. Angular vuelve a cargar la lista.

### Editar o eliminar un evento

1. El usuario selecciona una acción desde la tabla.
2. Angular envía una petición `PUT` o `DELETE`.
3. El backend recupera el evento.
4. Se comprueba si el usuario es propietario o administrador.
5. Si la autorización es correcta, se actualiza o elimina el documento.
6. La lista del frontend se sincroniza con la base de datos.

## 9. Pruebas

### Pruebas unitarias del backend

Las pruebas unitarias utilizan [[JUnit]] y [[Mockito]].

`JwtServiceTest.java` comprueba la generación, extracción y validación de tokens.

`EventServiceTest.java` comprueba:

- Creación de eventos.
- Asignación del propietario.
- Validación de capacidad.
- Restricción de modificación de eventos ajenos.

### Prueba de integración

`FullstackIntegrationTest.java` utiliza [[Spring Test]] y [[MockMvc]] para recorrer el flujo real de la aplicación:

1. Registro de usuario.
2. Login y obtención del JWT.
3. Creación de evento.
4. Consulta de eventos.
5. Eliminación del evento.

La prueba se conecta a MongoDB local, por lo que requiere que MongoDB esté disponible en `localhost:27017`.

### Pruebas del frontend

`app.spec.ts` utiliza [[Vitest]] y las herramientas de test de Angular para comprobar la creación del componente y el renderizado de la pantalla de acceso.

### Pruebas de carga

`performance/load-test.mjs` utiliza [[Node.js]] y la API `fetch` para:

- Crear un usuario temporal.
- Obtener un JWT.
- Realizar peticiones concurrentes a `/api/events`.
- Calcular percentil cincuenta.
- Calcular percentil noventa y cinco.
- Medir la latencia máxima.
- Calcular el throughput.
- Informar de errores y tasa de error.

Comando de ejecución:

```powershell
node performance\load-test.mjs
```

Parámetros configurables:

```powershell
$env:REQUESTS=500
$env:CONCURRENCY=25
$env:API_URL="http://localhost:8080/api"
node performance\load-test.mjs
```

En la medición inicial realizada con 100 peticiones y 10 conexiones concurrentes se obtuvieron estos valores:

- Errores: 0.
- Tasa de error: 0.00%.
- P50: 11.91 ms.
- P95: 30.68 ms.
- Latencia máxima: 34.36 ms.
- Throughput: 519.14 peticiones por segundo.

Estos resultados dependen del equipo, la carga de MongoDB y el entorno de ejecución.

## 10. Comandos principales

### Iniciar MongoDB

MongoDB debe estar ejecutándose en el puerto estándar antes de iniciar el backend.

### Iniciar backend

```powershell
cd reto4\backend
.\mvnw.cmd spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8080
```

### Iniciar frontend

```powershell
cd reto4\frontend
npm start
```

Si el puerto `4200` está ocupado, se puede utilizar otro:

```powershell
npm start -- --port 4300
```

### Ejecutar pruebas

```powershell
cd reto4\backend
.\mvnw.cmd test
```

```powershell
cd reto4\frontend
npm test -- --watch=false --no-progress
```

### Compilar frontend

```powershell
cd reto4\frontend
npm run build -- --no-progress
```

## 11. Consideraciones de despliegue

Para un entorno real se recomienda:

- Utilizar una instancia administrada de [[MongoDB Atlas]] o un servidor MongoDB protegido.
- Configurar la URI mediante variables de entorno.
- Sustituir la clave JWT de desarrollo.
- Restringir los orígenes permitidos en CORS.
- Añadir paginación en la consulta de eventos cuando el volumen de datos aumente.
- Añadir registros estructurados y monitorización.
- Ejecutar las pruebas de carga con datos representativos.
- No exponer contraseñas ni tokens en logs.

## 12. Resumen de conceptos

- [[Angular]]: framework utilizado para construir la interfaz.
- [[TypeScript]]: lenguaje principal del frontend.
- [[Spring Boot]]: framework del backend.
- [[API REST]]: mecanismo de comunicación entre frontend y backend.
- [[MongoDB]]: base de datos documental.
- [[Spring Data MongoDB]]: capa de persistencia para MongoDB.
- [[Spring Security]]: framework de autenticación y autorización.
- [[JWT]]: token utilizado para autenticar peticiones.
- [[BCrypt]]: algoritmo utilizado para cifrar contraseñas.
- [[CORS]]: mecanismo que controla los orígenes permitidos.
- [[Reactive Forms]]: sistema de formularios reactivos de Angular.
- [[Signals]]: mecanismo reactivo de estado utilizado en Angular.
- [[SSR]]: renderizado del frontend en servidor.
- [[JUnit]]: framework de pruebas Java.
- [[Mockito]]: librería para crear dobles de prueba.
- [[MockMvc]]: herramienta para probar endpoints Spring sin levantar un servidor externo.
- [[Vitest]]: motor de pruebas utilizado por el frontend.
- [[Pruebas de carga]]: pruebas para medir escalabilidad y rendimiento.
