# Documentación del Reto 3

## 1. Descripción general

El proyecto es una aplicación web sencilla para organizar tareas diarias. Permite consultar una lista inicial, añadir nuevas tareas indicando su prioridad, resaltar información y eliminar la última tarea de la lista.

La solución combina [[HTML]] para la estructura, [[CSS]] para la presentación visual y [[JavaScript]] junto con [[jQuery]] para el comportamiento dinámico.

## 2. Estructura del proyecto

El proyecto está compuesto por los siguientes archivos:

- `index.html`: define la estructura y el contenido de la interfaz.
- `styles.css`: contiene los estilos visuales y las reglas de adaptación a distintos tamaños de pantalla.
- `script.js`: implementa la interacción con el usuario y la actualización dinámica de la página.

## 3. Estructura HTML

El archivo `index.html` contiene una interfaz semántica formada por:

- Un título principal para identificar la aplicación.
- Una lista no ordenada que muestra las tareas existentes.
- Un formulario para introducir el nombre de una tarea y seleccionar su prioridad.
- Un campo de texto, un selector y un botón de envío.
- Un botón para resaltar los párrafos informativos.
- Un botón para eliminar la última tarea.
- Párrafos con la clase `informacion`, destinados a mostrar mensajes de apoyo.

El formulario utiliza el atributo `required` en el campo de texto. Esto aplica una validación básica del navegador antes de permitir el envío.

También se incluye la [[Librería]] [[jQuery]] mediante un CDN, antes de cargar el archivo de lógica de la aplicación.

## 4. Estilos y diseño visual

El archivo `styles.css` define la apariencia de la aplicación mediante:

- [[Selectores CSS]] para aplicar reglas a elementos, identificadores y clases.
- El modelo de caja con `box-sizing: border-box`.
- [[Flexibilidad responsive]] mediante unidades relativas, `min()`, `clamp()` y una [[Media query]].
- [[CSS Grid]] para organizar los controles del formulario.
- Colores, bordes, sombras y esquinas redondeadas para crear una interfaz clara.
- Estados `:focus` para mejorar la visibilidad del campo activo.
- Estados `:hover` para proporcionar respuesta visual al pasar el cursor sobre los botones.

La [[Media query]] modifica el espaciado y hace que los botones ocupen todo el ancho disponible en pantallas pequeñas. Esto mejora la [[Accesibilidad web]] y la usabilidad en dispositivos móviles.

## 5. Lógica de JavaScript y jQuery

El archivo `script.js` espera a que el [[DOM]] esté listo antes de registrar la lógica de la aplicación. Esta inicialización evita intentar manipular elementos que todavía no existen en la página.

### 5.1 Configuración inicial de la información

Al iniciar la página, se seleccionan todos los elementos con la clase `informacion`. Sobre ellos se aplican tres acciones:

- Se cambia el color del texto.
- Se aumenta el tamaño de la fuente.
- Se añade un atributo `title` con información contextual.

Este comportamiento es un ejemplo de [[Manipulación del DOM]] mediante métodos de [[jQuery]].

### 5.2 Resaltado de información

Al pulsar el botón `cambiar-estilo`, se registra un [[Evento]] `click`. El controlador del evento modifica los párrafos informativos para añadir:

- Color de fondo.
- Borde.
- Espaciado interior.

Además, se reemplaza el texto del primer párrafo. La acción combina cambio de estilos y modificación del contenido del [[DOM]].

### 5.3 Añadir una tarea

Cuando se envía el formulario, se registra el evento `submit`. La función recibe el objeto del evento y ejecuta `preventDefault()` para impedir la recarga de la página.

Después, el programa:

1. Obtiene el valor del campo de texto.
2. Elimina los espacios sobrantes con `trim()`.
3. Obtiene la prioridad seleccionada.
4. Comprueba que el nombre de la tarea no esté vacío.
5. Crea un nuevo elemento de lista.
6. Inserta el texto de la tarea y su prioridad.
7. Añade el nuevo elemento a la lista.
8. Limpia el campo de texto.

La condición `if (tarea)` funciona como una [[Validación de datos]] sencilla en el lado del cliente. El nuevo elemento se crea con `text()`, por lo que el contenido se trata como texto y no como marcado HTML.

### 5.4 Eliminar la última tarea

El botón `eliminar-tarea` escucha otro evento `click`. Al activarse, el código selecciona el último elemento de la lista y lo elimina.

Esta operación utiliza los métodos `last()` y `remove()` de [[jQuery]] para actualizar la interfaz sin recargar el documento.

## 6. Flujo de interacción

```text
La página se carga
        ↓
Se prepara el DOM y se aplican los estilos iniciales
        ↓
El usuario elige una acción
        ├─ Resaltar información → se actualizan estilos y texto
        ├─ Enviar formulario → se valida, se añade una tarea y se limpia el campo
        └─ Eliminar tarea → se borra el último elemento de la lista
```

## 7. Conceptos clave

- [[HTML]]: lenguaje utilizado para definir la estructura de la página.
- [[CSS]]: lenguaje utilizado para diseñar la presentación visual.
- [[JavaScript]]: lenguaje utilizado para añadir comportamiento e interacción.
- [[jQuery]]: librería que simplifica la selección y manipulación del [[DOM]].
- [[DOM]]: representación estructurada de los elementos HTML que puede modificarse desde JavaScript.
- [[Evento]]: acción del usuario o del navegador que puede activar una función.
- [[Manipulación del DOM]]: modificación de elementos, atributos, estilos o contenido de la página.
- [[Formulario]]: conjunto de controles que permite recoger datos del usuario.
- [[Validación de datos]]: comprobación de que la información introducida cumple unas condiciones mínimas.
- [[CSS Grid]]: sistema de distribución utilizado para organizar los controles del formulario.
- [[Media query]]: regla CSS que permite adaptar los estilos según las características de la pantalla.
- [[Accesibilidad web]]: práctica de crear interfaces utilizables por personas con distintas necesidades y dispositivos.

## 8. Conclusión

El reto muestra cómo construir una aplicación interactiva pequeña utilizando tecnologías fundamentales del desarrollo frontend. La estructura se define con [[HTML]], la presentación se controla con [[CSS]] y la lógica de interacción se implementa con [[JavaScript]] y [[jQuery]]. El resultado es una lista de tareas capaz de actualizar su contenido y sus estilos de forma dinámica sin recargar la página.