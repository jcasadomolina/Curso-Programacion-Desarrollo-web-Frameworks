# Documentación del Reto 2

## 1. Resumen del proyecto

Este proyecto es una aplicación web desarrollada con [[React]] para practicar el paso de propiedades y la gestión de estado en un [[componente]]. La interfaz muestra un nombre, una fecha y un contador de visitas. Cada vez que la persona usuaria pulsa el botón, el contador se actualiza sin recargar la página.

La aplicación utiliza [[JavaScript]], [[JSX]] y [[CSS]]. La configuración se basa en [[Create React App]], que proporciona las herramientas necesarias para iniciar el servidor de desarrollo, ejecutar pruebas y generar una compilación de producción.

## 2. Objetivo funcional

El flujo principal de la aplicación es el siguiente:

1. El componente `App` prepara los datos `nombre` y `fecha`.
2. `App` envía esos datos al componente `VisualizadorProps` mediante [[props]].
3. `VisualizadorProps` recibe las props y las muestra mediante [[interpolación]] en JSX.
4. El componente mantiene el número de visitas mediante [[estado local]].
5. Al pulsar el botón, se ejecuta un [[evento]] que incrementa el contador.
6. React vuelve a renderizar la interfaz con el valor actualizado.

Este flujo representa un ejemplo sencillo de [[programación reactiva de interfaces]], donde la vista depende del estado y de los datos recibidos por el componente.

## 3. Estructura de la aplicación

### Componente raíz

`App` funciona como punto de entrada de la interfaz. Importa `VisualizadorProps` y `VisualizadorProps.css`, y renderiza el componente pasando los valores `nombre` y `fecha`.

La función `App` es un [[componente funcional]]. Su responsabilidad es componer la vista principal y proporcionar los datos iniciales al componente encargado de visualizarlos.

### Componente VisualizadorProps

`VisualizadorProps` es un componente funcional que recibe las props `nombre` y `fecha`. En su interior declara el estado `visitas` mediante `useState`, que comienza con el valor cero.

El componente también utiliza `useEffect` para modificar el título del documento cuando cambia `nombre`. Este comportamiento muestra cómo un [[efecto secundario]] puede sincronizar el estado de React con una API del navegador, en este caso `document.title`.

### Presentación y estilos

La estructura visual se define mediante JSX y los estilos se importan desde `VisualizadorProps.css`. La clase `.visualizador-props` utiliza [[Flexbox]] para organizar el contenido en una columna, centrarlo y aplicar espaciado, color de fondo, bordes redondeados y sombra.

La separación entre lógica y estilos facilita el mantenimiento del componente y aplica el principio de [[separación de responsabilidades]].

## 4. Conceptos de programación aplicados

### Props

Las [[props]] son datos de entrada que un componente recibe desde su componente padre. En este proyecto, `App` proporciona `nombre` y `fecha` a `VisualizadorProps`.

Las props permiten reutilizar el componente con diferentes valores sin modificar su lógica interna. El componente hijo las recibe mediante la desestructuración del parámetro de la función.

### Estado

La variable `visitas` representa el [[estado]] interno del componente. `useState(0)` devuelve el valor actual y la función `setVisitas`, que permite solicitar una actualización.

La expresión `setVisitas(visitas + 1)` incrementa el contador después de cada interacción. Cuando el estado cambia, React realiza un nuevo [[renderizado]] para reflejar el resultado en la interfaz.

### Eventos

La propiedad `onClick` registra un [[manejador de eventos]] para el botón. Cuando la persona usuaria hace clic, se ejecuta la función que actualiza `visitas`.

Este mecanismo permite responder a la interacción sin manipular directamente el [[DOM]]. React gestiona la actualización de la vista a partir del nuevo estado.

### Interpolación y JSX

Las expresiones `{nombre}`, `{fecha}` y `{visitas}` insertan valores dinámicos dentro del marcado JSX. Esta forma de [[interpolación]] mantiene la presentación vinculada a los datos del componente.

JSX combina la sintaxis de JavaScript con una estructura similar a [[HTML]]. Durante la compilación, esta sintaxis se transforma en llamadas que React utiliza para construir la interfaz.

### Efectos secundarios

`useEffect` ejecuta una operación después del renderizado. En este caso, actualiza el título de la pestaña con una cadena basada en `nombre`.

La dependencia `[nombre]` indica que el efecto debe volver a ejecutarse cuando cambie ese valor. Así se evita ejecutar innecesariamente la misma operación en cada renderizado.

## 5. Tecnologías y herramientas

### React

[[React]] es la librería utilizada para construir la interfaz mediante componentes. Su modelo basado en estado, props y renderizado declarativo permite describir qué debe mostrar la aplicación en cada momento.

### JavaScript y JSX

[[JavaScript]] aporta la lógica de la aplicación, mientras que [[JSX]] permite declarar la estructura visual dentro de los componentes. La combinación de ambos facilita mantener cerca los datos y la representación que depende de ellos.

### Create React App

[[Create React App]] proporciona la configuración inicial del proyecto y los comandos definidos en `package.json`:

- `npm start` inicia el servidor de desarrollo.
- `npm run build` genera una compilación optimizada para producción.
- `npm test` ejecuta las pruebas configuradas.
- `npm run eject` expone la configuración interna del proyecto y es una operación irreversible.

### CSS y Flexbox

[[CSS]] controla la presentación del componente. La propiedad `display: flex` activa [[Flexbox]], que se utiliza para distribuir y alinear los elementos de la interfaz.

## 6. Flujo de datos

```text
App -> props -> VisualizadorProps -> onClick -> setVisitas -> renderizado -> interfaz actualizada
```

El flujo es principalmente unidireccional: los datos bajan desde `App` mediante props, mientras que la interacción modifica el estado interno de `VisualizadorProps`. React utiliza ese estado para volver a representar el contenido visible.

## 7. Pruebas y aspectos mejorables

El proyecto incluye una prueba basada en [[React Testing Library]]. La prueba actual todavía busca el texto predeterminado `learn react`, por lo que no coincide con la interfaz implementada y debería actualizarse.

Sería conveniente añadir pruebas que:

- Comprueben que `nombre` y `fecha` aparecen al renderizar el componente.
- Verifiquen que el contador comienza en cero.
- Confirmen que `setVisitas` incrementa el contador después de pulsar el botón.
- Comprueben que el título del documento se actualiza con el nombre recibido.

También puede mejorarse la implementación usando la actualización funcional `setVisitas(valorActual => valorActual + 1)`, especialmente si se encadenan varias actualizaciones de estado.

## 8. Conclusión

El proyecto presenta una implementación compacta de una interfaz basada en [[componentes]], [[props]], [[estado]] y [[eventos]]. Aunque su funcionalidad es sencilla, reúne fundamentos esenciales del [[desarrollo frontend]] con React: composición de componentes, actualización reactiva, efectos secundarios, JSX y estilos mediante CSS.

Su estructura permite evolucionar la aplicación añadiendo validaciones, más propiedades, persistencia de datos o nuevas acciones sin mezclar la responsabilidad de cada parte.