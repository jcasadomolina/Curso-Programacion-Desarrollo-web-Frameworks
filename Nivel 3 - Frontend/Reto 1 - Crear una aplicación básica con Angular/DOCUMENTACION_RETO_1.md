# Documentación del Reto 1: Lista de elementos

## 1. Resumen del proyecto

Este proyecto es una aplicación web desarrollada con [[Angular]] para practicar la creación de una lista de elementos. La aplicación permite escribir un nombre en un formulario, añadirlo a una colección en memoria y mostrar todos los elementos en una lista HTML.

El proyecto utiliza [[Angular CLI]] como herramienta de generación y desarrollo, [[TypeScript]] como lenguaje principal y [[HTML]] y [[CSS]] para la estructura y la presentación. La configuración también incluye [[Server-Side Rendering]] mediante [[Angular SSR]] y pruebas unitarias con [[Vitest]].

## 2. Objetivo funcional

El objetivo es implementar un flujo sencillo de entrada y visualización de datos:

1. La persona usuaria escribe un valor en el campo de texto.
2. El formulario captura el envío.
3. El componente recibe el valor y lo incorpora a la colección `lista`.
4. La plantilla recorre la colección y crea un elemento visual por cada valor.
5. El campo de entrada se limpia y el formulario no provoca una recarga completa de la página.

Este flujo representa un ejemplo básico de [[programación reactiva de interfaces]], donde la vista se actualiza a partir del estado mantenido por el componente.

## 3. Estructura de la aplicación

### Componente raíz

El componente `App` funciona como punto de entrada de la interfaz. Su plantilla contiene la navegación principal y un `router-outlet`, que actúa como zona de representación para las vistas asociadas a cada ruta.

El componente raíz importa `RouterLink` y `RouterOutlet`, por lo que utiliza [[Angular Router]] para desplazarse entre la página inicial y la vista de la lista sin recargar el documento.

### Componente de la lista

`ListaElementos` es un [[componente standalone]] encargado de la funcionalidad principal. Su estado se define mediante la propiedad `lista`, que es un [[array]] de valores de tipo [[String]].

El método `addElement` recibe un elemento, comprueba que la colección esté inicializada y utiliza `push` para añadir el valor. La lógica está encapsulada dentro del componente, mientras que la plantilla se ocupa de representar el resultado.

### Plantillas y estilos

Cada componente separa la lógica de la presentación en archivos diferentes:

- Los archivos `.ts` contienen la clase y el comportamiento.
- Los archivos `.html` contienen la [[plantilla]] y el marcado de la interfaz.
- Los archivos `.css` contienen los estilos específicos del componente.
- `styles.css` está reservado para los estilos globales.

Esta separación facilita el mantenimiento y aplica el principio de [[separación de responsabilidades]].

## 4. Conceptos de programación aplicados

### Estado y colecciones

La propiedad `lista` representa el estado local del componente. Su tipo `string[]` indica que se trata de una colección ordenada de cadenas. Cada vez que se añade un valor, el estado cambia y Angular vuelve a evaluar la parte de la plantilla que depende de él.

### Métodos y parámetros

`addElement(element: string)` es un método que recibe un parámetro tipado. La anotación `string` permite expresar el contrato del método: solo debe recibir texto. El método modifica el estado de la instancia mediante una operación de [[mutabilidad controlada]].

### Condicionales

La instrucción `if (!this.lista)` comprueba si la colección no tiene un valor válido. Aunque la propiedad se inicializa desde el principio, esta comprobación funciona como protección adicional antes de insertar datos.

### Eventos

La expresión `(submit)="..."` utiliza [[enlace de eventos]] de Angular. Cuando la persona usuaria envía el formulario, se ejecuta la lógica asociada al evento `submit`.

La llamada `$event.preventDefault()` cancela el comportamiento predeterminado del navegador y evita que el formulario recargue la página. Esto permite gestionar el envío desde la aplicación de forma dinámica.

### Referencia local de plantilla

La expresión `#elemento` crea una [[referencia local de plantilla]]. Gracias a ella, el controlador del formulario puede leer el valor actual del campo sin declarar un modelo de formulario adicional.

### Interpolación

La expresión `{{ elemento }}` usa [[interpolación]] para insertar en el HTML el valor de cada elemento de la colección. Angular mantiene la vista sincronizada con el estado del componente.

### Iteración en la plantilla

El bloque `@for` implementa el [[control de flujo]] de Angular para recorrer `lista`. Por cada valor se genera un elemento `li`.

La opción `track $index` ayuda a Angular a identificar cada posición de la colección y a actualizar el [[DOM]] de manera más eficiente cuando cambia la lista.

## 5. Tecnologías y herramientas

### Angular

[[Angular]] es el [[framework]] utilizado para construir la interfaz y organizar la aplicación en componentes. En este proyecto se utiliza la arquitectura moderna de componentes independientes, sin depender de un módulo raíz tradicional.

### TypeScript

[[TypeScript]] amplía JavaScript con [[tipado estático]], clases, decoradores y otras características útiles para estructurar aplicaciones grandes. En este proyecto se utiliza para definir componentes, propiedades, métodos y tipos de datos.

### Angular CLI

[[Angular CLI]] permite crear el proyecto, iniciar el servidor de desarrollo, compilar la aplicación y ejecutar las pruebas. Los comandos principales definidos en el proyecto son:

- `npm start` inicia el servidor de desarrollo.
- `npm run build` genera una compilación de producción.
- `npm test` ejecuta las pruebas unitarias.

### Angular Router

[[Angular Router]] gestiona la navegación interna. Las rutas conectan la URL con los componentes que deben mostrarse dentro de `router-outlet`.

### Server-Side Rendering

La configuración incluye [[Server-Side Rendering]] mediante `@angular/ssr`. Esta técnica permite generar HTML en el servidor antes de entregarlo al navegador, lo que puede mejorar la carga inicial y la [[accesibilidad]]. También se configura la [[hidratación]] del cliente para que Angular retome la interacción en el navegador.

### Pruebas unitarias

Las pruebas utilizan [[Vitest]] junto con las herramientas de pruebas de Angular. Los archivos `app.spec.ts` y `lista-elementos.spec.ts` verifican actualmente que los componentes puedan crearse correctamente.

## 6. Flujo de datos

```text
Campo de texto -> evento submit -> addElement -> lista -> @for -> elementos li
```

El flujo es unidireccional: la persona usuaria genera un evento, el componente actualiza su estado y la plantilla representa el estado resultante. Esta organización hace que el comportamiento sea fácil de seguir y de ampliar.

## 7. Aspectos mejorables

- Añadir una prueba específica para comprobar que `addElement` incorpora correctamente un valor.
- Añadir una prueba de interfaz que verifique que el nuevo elemento aparece en el DOM.
- Evitar aceptar cadenas vacías o valores compuestos únicamente por espacios mediante una validación adicional.
- Incorporar una acción para eliminar elementos si el alcance del reto lo requiere.
- Revisar el texto esperado en la prueba de `App` para que coincida con la plantilla actual.

## 8. Conclusión

El proyecto presenta una implementación clara de una interfaz basada en [[componentes]], [[eventos]] y [[renderizado dinámico]]. Aunque su funcionalidad es pequeña, reúne fundamentos importantes de [[desarrollo frontend]]: gestión de estado local, tipado, navegación, interacción con formularios, actualización del DOM y pruebas automatizadas.

La estructura actual permite evolucionar la aplicación sin mezclar la lógica con la presentación y sirve como base para incorporar persistencia, validaciones más completas o nuevas operaciones sobre la lista.