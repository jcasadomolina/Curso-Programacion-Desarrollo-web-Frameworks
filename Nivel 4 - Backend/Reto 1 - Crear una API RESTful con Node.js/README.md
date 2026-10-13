# Documentación del proyecto

## 1. Descripción general

Este proyecto implementa una [[API REST]] para gestionar usuarios mediante operaciones [[CRUD]]: crear, consultar, actualizar y eliminar.

La aplicación está construida con [[Node.js]] y [[Express.js]]. Los datos se almacenan temporalmente en memoria y la API incluye documentación interactiva basada en [[OpenAPI]] y [[Swagger UI]].

### Funcionalidades principales

- Mostrar un mensaje de estado en la ruta raíz.
- Crear usuarios.
- Obtener todos los usuarios.
- Obtener un usuario mediante su identificador.
- Actualizar un usuario existente.
- Eliminar un usuario.
- Validar los campos obligatorios de las peticiones.
- Exponer una documentación interactiva de la API.

### Limitaciones actuales

- Los usuarios se almacenan en un [[array]] de JavaScript, por lo que los datos se pierden al detener o reiniciar el servidor.
- No existe una [[base de datos]] ni una capa de persistencia.
- La validación comprueba el tipo de los campos, pero no valida el formato real del correo electrónico ni otros requisitos de negocio.
- `package.json` no define todavía una batería de [[pruebas automatizadas]].

## 2. Tecnologías y herramientas

### [[Node.js]]

[[Node.js]] es el entorno de ejecución que permite ejecutar JavaScript en el servidor. En este proyecto se utiliza para levantar el servidor HTTP y ejecutar la lógica de la API.

### [[JavaScript]]

El código está escrito en [[JavaScript]] utilizando la sintaxis de [[CommonJS]]. Los módulos se importan mediante `require`:

```javascript
const express = require('express');
```

### [[Express.js]]

[[Express.js]] es el framework web utilizado para:

- Crear la instancia de la aplicación.
- Registrar [[middleware]].
- Definir rutas HTTP.
- Procesar peticiones y respuestas.
- Iniciar el servidor.

La dependencia utilizada es `express` en la versión `5.2.1` o una versión compatible indicada por el rango `^5.2.1`.

### [[Swagger]] y [[OpenAPI]]

[[OpenAPI]] es la especificación utilizada para describir formalmente los endpoints, parámetros, cuerpos de petición, respuestas y modelos de datos.

El proyecto utiliza dos herramientas:

- `swagger-jsdoc`: genera la especificación OpenAPI a partir del objeto `swaggerDefinition` y de los comentarios [[JSDoc]] situados junto a las rutas.
- `swagger-ui-express`: sirve una interfaz web interactiva para consultar y probar la API.

### [[npm]]

[[npm]] es el gestor de paquetes utilizado para instalar las dependencias declaradas en `package.json`.

### [[HTTP]] y [[JSON]]

La comunicación se realiza mediante [[HTTP]]. Las peticiones y respuestas de la API utilizan [[JSON]] como formato de intercambio de datos.

## 3. Estructura del proyecto

Actualmente el proyecto contiene los siguientes archivos principales:

- `package.json`: metadatos, configuración del proyecto, scripts y dependencias.
- `server.js`: configuración del servidor, rutas, validación, almacenamiento temporal y documentación OpenAPI.
- `README.md`: documentación técnica y funcional del proyecto.

La aplicación utiliza una estructura simple de un único módulo ejecutable. No hay todavía separación en controladores, servicios, repositorios o modelos.

## 4. Configuración del proyecto

### `package.json`

La configuración relevante es:

```json
{
  "name": "reto-1",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "type": "commonjs"
}
```

Aunque `main` apunta a `index.js`, el archivo que se ejecuta actualmente es `server.js`.

### Dependencias

```json
{
  "dependencies": {
    "express": "^5.2.1",
    "swagger-jsdoc": "^6.3.0",
    "swagger-ui-express": "^5.0.1"
  }
}
```

### Puerto del servidor

El puerto se obtiene de la variable de entorno `PORT`. Si no está definida, se utiliza el puerto `3000`:

```javascript
const PORT = process.env.PORT || 3000;
```

Esto permite ejecutar la aplicación en diferentes entornos sin modificar el código fuente.

## 5. Puesta en marcha

### Instalación

Desde la carpeta del proyecto se instalan las dependencias con [[npm]]:

```bash
npm install
```

### Ejecución

El servidor puede iniciarse directamente con [[Node.js]]:

```bash
node server.js
```

Cuando el servidor se inicia correctamente, muestra un mensaje similar a:

```text
Servidor escuchando en http://localhost:3000
```

En [[PowerShell]], también se puede cambiar el puerto mediante una variable de entorno:

```powershell
$env:PORT=4000
node server.js
```

## 6. Arquitectura y patrones utilizados

### [[Arquitectura cliente-servidor]]

El cliente envía peticiones HTTP y el servidor procesa esas peticiones, ejecuta la lógica correspondiente y devuelve una respuesta JSON.

### [[API REST]]

La API utiliza recursos identificables mediante URLs y verbos HTTP con significado estándar:

- `POST /usuarios`: crea un recurso.
- `GET /usuarios`: obtiene una colección.
- `GET /usuarios/:id`: obtiene un recurso concreto.
- `PUT /usuarios/:id`: reemplaza o actualiza un recurso.
- `DELETE /usuarios/:id`: elimina un recurso.

### [[Middleware]]

`express.json()` es un [[middleware]] que analiza cuerpos de petición JSON y deja los datos disponibles en `req.body`.

```javascript
app.use(express.json());
```

### [[Enrutamiento]]

Las rutas se registran asociando un método HTTP y una URL a una función manejadora:

```javascript
app.get('/usuarios', (req, res) => {
	res.json(usuarios);
});
```

### [[Validación de entrada]]

La función `datosDeUsuarioValidos` centraliza la validación mínima de los datos recibidos. Comprueba que el cuerpo exista y que `nombre` y `email` sean cadenas de texto.

```javascript
function datosDeUsuarioValidos(body) {
	return body && typeof body.nombre === 'string' && typeof body.email === 'string';
}
```

### [[Almacenamiento en memoria]]

Los usuarios se guardan en el array `usuarios` y los identificadores se generan mediante `siguienteId`.

```javascript
let siguienteId = 1;
const usuarios = [];
```

Este enfoque es apropiado para un ejercicio o una demostración, pero no para un entorno productivo.

### [[Documentación como código]]

La documentación de cada endpoint se mantiene junto a su implementación mediante comentarios JSDoc con anotaciones Swagger. Así se reduce el riesgo de que la documentación y el código evolucionen de forma independiente.

## 7. Componentes y módulos

### Módulo `express`

Se importa para crear la aplicación web, registrar middleware, definir rutas y arrancar el servidor.

```javascript
const express = require('express');
const app = express();
```

### Módulo `swagger-jsdoc`

Se utiliza para generar `swaggerSpec`, el documento OpenAPI completo:

```javascript
const swaggerSpec = swaggerJsdoc({
	swaggerDefinition,
	apis: ['./server.js']
});
```

### Módulo `swagger-ui-express`

Publica la interfaz de documentación en `/api-docs`:

```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### Objeto `app`

`app` es la instancia principal de [[Express.js]]. Recibe la configuración de middleware y rutas de la aplicación.

### Objeto `swaggerDefinition`

Contiene la configuración base de [[OpenAPI]]:

- Versión de OpenAPI.
- Título, versión y descripción de la API.
- Servidores disponibles.
- Etiquetas de agrupación.
- Esquemas reutilizables.

### Esquemas OpenAPI

Se definen tres [[modelo de datos|modelos de datos]]:

- `Usuario`: representa un usuario completo, incluido su `id`.
- `NuevoUsuario`: representa los datos necesarios para crear o actualizar un usuario.
- `Error`: representa una respuesta de error con la propiedad `error`.

### Función `datosDeUsuarioValidos`

Es una función auxiliar que evita duplicar la validación básica en los endpoints `POST` y `PUT`.

### Colección `usuarios`

Es la estructura que actúa como almacenamiento temporal de los usuarios.

### Contador `siguienteId`

Genera identificadores enteros consecutivos para los nuevos usuarios. El operador `++` incrementa el contador después de asignar el valor actual.

## 8. Endpoints de la API

La URL base local es:

```text
http://localhost:3000
```

### `GET /`

Devuelve un mensaje de estado y una lista básica de rutas disponibles.

Respuesta:

```json
{
  "mensaje": "API de usuarios funcionando.",
  "rutas": ["/usuarios"]
}
```

### `POST /usuarios`

Crea un usuario.

#### Petición

```json
{
  "nombre": "Carlos García",
  "email": "carlos@example.com"
}
```

#### Respuesta `201 Created`

```json
{
  "id": 1,
  "nombre": "Carlos García",
  "email": "carlos@example.com"
}
```

#### Respuesta `400 Bad Request`

Se devuelve cuando `nombre` o `email` no existen o no son cadenas de texto.

```json
{
  "error": "Los campos nombre y email son obligatorios y deben ser texto."
}
```

### `GET /usuarios`

Devuelve todos los usuarios almacenados.

Respuesta `200 OK`:

```json
[
  {
    "id": 1,
    "nombre": "Carlos García",
    "email": "carlos@example.com"
  }
]
```

### `GET /usuarios/:id`

Devuelve el usuario cuyo identificador coincide con el parámetro de ruta `id`.

Ejemplo:

```text
GET /usuarios/1
```

Si existe, responde con `200 OK` y el objeto del usuario. Si no existe, responde con `404 Not Found`:

```json
{
  "error": "Usuario no encontrado."
}
```

### `PUT /usuarios/:id`

Actualiza el nombre y el correo electrónico de un usuario existente.

```text
PUT /usuarios/1
```

Cuerpo de ejemplo:

```json
{
  "nombre": "Carlos García López",
  "email": "carlos.lopez@example.com"
}
```

Respuestas posibles:

- `200 OK`: usuario actualizado.
- `400 Bad Request`: datos ausentes o inválidos.
- `404 Not Found`: el identificador no corresponde a ningún usuario.

### `DELETE /usuarios/:id`

Elimina un usuario existente.

```text
DELETE /usuarios/1
```

Respuestas posibles:

- `204 No Content`: eliminación correcta, sin cuerpo de respuesta.
- `404 Not Found`: usuario inexistente.

## 9. Flujo de una petición

El flujo general es el siguiente:

1. El cliente envía una petición [[HTTP]] a una ruta.
2. El middleware `express.json()` analiza el cuerpo [[JSON]], si existe.
3. [[Express.js]] localiza el manejador asociado al método y a la URL.
4. El manejador valida los parámetros o el cuerpo de la petición.
5. La aplicación consulta o modifica el array `usuarios`.
6. El servidor devuelve una respuesta con datos JSON y un código de estado HTTP.

Para una petición de creación, el flujo puede representarse así:

```text
Cliente -> Express.js -> express.json() -> Validación -> Array usuarios -> Respuesta JSON
```

## 10. Códigos de estado HTTP

- `200 OK`: operación de consulta o actualización realizada correctamente.
- `201 Created`: usuario creado correctamente.
- `204 No Content`: usuario eliminado correctamente sin contenido de respuesta.
- `400 Bad Request`: petición con datos ausentes o inválidos.
- `404 Not Found`: usuario no encontrado.

## 11. Documentación interactiva

Con el servidor en ejecución, la documentación puede consultarse en:

```text
http://localhost:3000/api-docs
```

La interfaz de [[Swagger UI]] permite:

- Consultar los endpoints agrupados bajo la etiqueta `Usuarios`.
- Revisar los parámetros y cuerpos esperados.
- Ver los códigos de respuesta.
- Ejecutar peticiones contra el servidor local mediante la opción `Try it out`.

## 12. Mejoras recomendadas

- Incorporar una [[base de datos]] como SQLite, PostgreSQL o MongoDB.
- Separar rutas, controladores, servicios y persistencia siguiendo una [[arquitectura por capas]].
- Añadir validación de formato para correos electrónicos.
- Rechazar nombres y correos vacíos o compuestos únicamente por espacios.
- Añadir control de duplicados por correo electrónico.
- Centralizar el [[manejo de errores]].
- Añadir [[pruebas unitarias]] y [[pruebas de integración]].
- Crear un script `start` en `package.json`.
- Utilizar variables de entorno para la configuración de servidores y otros valores sensibles.
- Añadir [[CORS]], autenticación y autorización si la API va a ser consumida desde aplicaciones externas.

## 13. Resumen

El proyecto es una aplicación de servidor compacta que demuestra la creación de una [[API REST]] con [[Node.js]], [[Express.js]], [[JSON]] y documentación [[OpenAPI]]. Su diseño es adecuado como ejercicio introductorio porque concentra todos los elementos en `server.js`, aunque para crecer hacia un entorno productivo debería incorporar persistencia, separación de responsabilidades, validaciones más completas, seguridad y pruebas automatizadas.