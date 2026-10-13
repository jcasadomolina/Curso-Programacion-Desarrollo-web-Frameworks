# Reto 4: Crear una petición AJAX

## Propósito del proyecto

Este proyecto muestra cómo crear una [[Petición AJAX]] desde una página web para consultar información remota sin recargar el documento. La aplicación se conecta con la [[API]] pública Dog CEO y permite visualizar imágenes de perros, tanto de forma aleatoria como a partir de una raza seleccionada.

La interfaz está construida con [[HTML]], la apariencia se define mediante [[CSS]] y la lógica de comunicación y actualización de la página se desarrolla con [[JavaScript]] y [[jQuery]].

## Funcionalidades principales

### Obtener un perro aleatorio

Al pulsar el botón `#obtener-perro`, se ejecuta `getRandomDog` y se realiza una [[Petición AJAX]] con el [[Método GET]] al [[Endpoint]] de imágenes aleatorias.

El flujo es el siguiente:

1. Se muestra el estado de carga en `#lista-perros`.
2. Se consulta el endpoint `/api/breeds/image/random`.
3. La respuesta se interpreta como [[JSON]].
4. Se extrae la raza desde la [[URL]] de la imagen.
5. Se crea un título y un elemento de imagen.
6. El contenido se inserta en el [[DOM]].
7. Si la petición falla, se muestra un mensaje informativo.

### Cargar el listado de razas

Al cargar la página se ejecuta `getBreeds`, que utiliza `$.getJSON` para obtener todas las razas disponibles.

La función recorre los datos recibidos mediante un [[Bucle]] y distingue entre razas sin subrazas y razas que contienen [[Subraza]]s. Después genera las opciones del elemento `select` y habilita el botón `#busca-perro` cuando la información está disponible.

### Buscar una raza concreta

Cuando el usuario pulsa `#busca-perro`, se ejecuta `getDogByBreed`.

Antes de enviar la consulta, el programa comprueba que exista una raza seleccionada. Si no existe, detiene el flujo y muestra una indicación. Si la selección es válida, realiza otra [[Petición AJAX]] al [[Endpoint]] correspondiente, procesa la respuesta [[JSON]] y muestra una imagen de la raza elegida.

## Conceptos técnicos

- [[Petición AJAX]]: comunicación con un servidor en segundo plano sin recargar la página.
- [[API]]: conjunto de recursos que permite a la aplicación solicitar datos externos.
- [[Endpoint]]: dirección concreta de la [[API]] que atiende una operación.
- [[Método GET]]: operación HTTP utilizada para solicitar información.
- [[JSON]]: formato estructurado empleado para transportar los datos de las respuestas.
- [[jQuery]]: [[Librería]] de [[JavaScript]] utilizada para gestionar eventos, peticiones y elementos del [[DOM]].
- [[DOM]]: representación de la estructura del documento que puede modificarse desde [[JavaScript]].
- [[Evento]]: acción del usuario, como hacer clic en un botón, que desencadena una función.
- [[Callback]]: función que se ejecuta cuando una operación asíncrona termina.
- [[Asincronía]]: modelo que permite continuar con la interacción mientras se espera una respuesta externa.
- [[Manejo de errores]]: tratamiento de fallos mediante `.fail()` para informar al usuario.
- [[Accesibilidad web]]: uso de `aria-live` y textos alternativos para comunicar cambios y describir imágenes.
- [[Expresión regular]]: patrón utilizado para transformar el nombre de una raza y mejorar su presentación.

## Organización de los archivos

- `ajax.html`: define la estructura de la interfaz, los controles y la carga de [[jQuery]] y del archivo de lógica.
- `api-request.js`: contiene las funciones que realizan las consultas, procesan las respuestas y actualizan el [[DOM]].
- `styles.css`: contiene los estilos visuales, los estados de los controles, la adaptación a móviles y la animación de aparición de las imágenes.

## Flujo general de la aplicación

```text
Usuario -> Evento de clic o carga inicial -> Función de JavaScript
       -> Petición AJAX -> API Dog CEO -> Respuesta JSON
       -> Actualización del DOM -> Resultado visible
```

Si la [[API]] no responde correctamente, el flujo pasa al [[Manejo de errores]] y la interfaz informa de que no se ha podido completar la operación.

## Tecnologías utilizadas

- [[HTML5]] para la estructura semántica.
- [[CSS3]] para el diseño responsive y los estados visuales.
- [[JavaScript]] para la lógica de aplicación.
- [[jQuery]] para simplificar la manipulación del [[DOM]] y las peticiones asíncronas.
- [[API REST]] Dog CEO como fuente externa de datos.
- [[Obsidian]] como destino de esta documentación mediante enlaces internos.

## Resultado esperado

La persona usuaria puede consultar una imagen aleatoria o seleccionar una raza para obtener otra imagen sin abandonar la página ni realizar una recarga completa. El proyecto sirve como ejemplo práctico de consumo de una [[API REST]], procesamiento de [[JSON]] y actualización dinámica de una interfaz web.