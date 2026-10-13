# [[Componente]] `Contador`
`Contador` es un [[componente funcional]] de [[React]] que muestra un número y permite incrementarlo mediante un botón. Está implementado en `app/contador.tsx` y se utiliza desde `app/page.tsx`.


La página principal no controla el valor ni la lógica del contador: únicamente importa el componente y lo renderiza dentro de su contenido principal.


## Funcionamiento


El componente sigue este [[flujo de ejecución]]:

  

1. Inicializa el contador con el valor `0`.

2. [[Renderiza]] el valor actual en un encabezado: `Contador: {contador}`.

3. Cuando el usuario pulsa **Incrementar**, actualiza el [[estado]] sumando `1`.

4. [[React]] vuelve a [[renderizar]] el componente con el nuevo valor.

5. Después de cada cambio, registra el valor actualizado en la [[consola del navegador]].

  

Su estructura esencial es equivalente a:

  

```tsx

const Contador = () => {

  const [contador, setContador] = useState(0);

  

  useEffect(() => {

    console.log("El valor actual del contador es:", contador);

  }, [contador]);

  

  return (

    <button onClick={() => setContador(contador + 1)}>

      Incrementar

    </button>

  );

};

```

  

## Por qué usa `"use client"`

  

La [[directiva]] `"use client"` aparece al principio de `app/contador.tsx`. En el [[App Router]] de [[Next.js]], los componentes son [[Server Components]] por defecto. Este componente necesita ejecutarse en el navegador porque:

  

- `useState` conserva un valor que cambia durante la interacción del usuario.

- El [[manejador de eventos]] `onClick` responde a un evento del navegador.

- `useEffect` ejecuta código después del [[renderizado]] en el cliente.

  

Por estas razones, `Contador` debe seguir siendo un [[Client Component]]. `app/page.tsx` puede permanecer como [[Server Component]] y renderizarlo como hijo.

  

## [[Hooks]] utilizados

  

### [[Hook]] `useState`

  

```tsx

const [contador, setContador] = useState(0);

```

  

`useState` devuelve dos elementos:

  

- `contador`: el valor actual.

- `setContador`: la función que solicita una actualización del [[estado]].

  

El `0` es el valor inicial. No se debe modificar `contador` directamente; siempre debe utilizarse `setContador` para que [[React]] sepa que tiene que volver a [[renderizar]] el componente.

  

El botón usa actualmente esta actualización:

  

```tsx

setContador(contador + 1);

```

  

Para [[actualizaciones de estado]] basadas en el valor anterior, especialmente si se encadenan varias actualizaciones, es más robusto usar la [[forma funcional]]:

  

```tsx

setContador((valorAnterior) => valorAnterior + 1);

```

  

### [[Hook]] `useEffect`

  

```tsx

useEffect(() => {

  console.log("El valor actual del contador es:", contador);

}, [contador]);

```

  

El [[efecto]] se ejecuta después del [[renderizado]] inicial y después de cada renderizado en el que cambia `contador`. La [[lista de dependencias]] `[contador]` expresa que el efecto depende de ese valor.

  

En el estado actual, el efecto solo sirve para [[observabilidad]] y [[depuración]]. No modifica el estado ni produce efectos visibles en la interfaz. En una ampliación podría utilizarse para sincronizar el contador con `localStorage`, enviar métricas o reaccionar a cambios externos. Si el efecto crea [[suscripciones]], [[temporizadores]] o [[listeners]], debe devolver una [[función de limpieza]].

  

## [[Presentación]] y [[estilos]]

  

El componente combina:

  

- Un estilo [[inline]] en el contenedor: centra el contenido y añade espacio interior.

- [[Clases de utilidad]] en el botón: espaciado, color, tipografía, bordes, sombra y estados `hover`.

  

La lógica no depende de esos estilos, por lo que se pueden sustituir por clases [[CSS]], un [[sistema de diseño]] o componentes visuales sin cambiar el funcionamiento de los [[Hooks]].

  

## Cómo [[reutilizar]] el componente

  

El componente no recibe [[props]], así que se puede reutilizar directamente:

  

```tsx

import Contador from "./contador";

  

export default function OtraPagina() {

  return <Contador />;

}

```

  

Cada [[instancia]] mantiene su propio [[estado]]. Si una página [[renderiza]] dos instancias, incrementar una no cambia la otra.

  

## Formas de expandir la [[funcionalidad]]

  

### Añadir decremento y reinicio

  

Se pueden añadir [[acciones]] que reutilicen el mismo [[setter]]:

  

```tsx

<button onClick={() => setContador((valor) => valor - 1)}>

  Decrementar

</button>

<button onClick={() => setContador(0)}>

  Reiniciar

</button>

```

  

Conviene usar la [[actualización funcional]] para incrementar o decrementar a partir del [[estado]] anterior.

  

### Configurar un valor inicial y un [[paso]]

  

Para que el componente sea configurable, se pueden añadir [[props tipadas]]:

  

```tsx

type ContadorProps = {

  valorInicial?: number;

  paso?: number;

};

  

const Contador = ({ valorInicial = 0, paso = 1 }: ContadorProps) => {

  const [contador, setContador] = useState(valorInicial);

  

  return (

    <button onClick={() => setContador((valor) => valor + paso)}>

      Contador: {contador}

    </button>

  );

};

```

  

Si `valorInicial` puede cambiar después del [[montaje]] y debe volver a sincronizar el estado, esa decisión debe documentarse y resolverse explícitamente con un [[efecto]] o haciendo que el valor sea [[controlado]] por el componente padre.

  

### Convertirlo en un [[componente controlado]]

  

Si el padre necesita conocer o decidir el valor, el [[estado]] puede subir al padre:

  

```tsx

type ContadorControladoProps = {

  valor: number;

  alCambiar: (nuevoValor: number) => void;

};

  

const Contador = ({ valor, alCambiar }: ContadorControladoProps) => (

  <button onClick={() => alCambiar(valor + 1)}>

    Contador: {valor}

  </button>

);

```

  

Este enfoque es útil cuando el contador participa en un [[formulario]], debe [[persistirse]] junto con otros datos o varias partes de la interfaz necesitan compartirlo.

  

### [[Persistir]] el valor

  

Para conservar el valor entre recargas, `useEffect` puede sincronizarlo con `localStorage`. Como `localStorage` solo existe en el navegador, esa lógica debe permanecer dentro del [[Client Component]]. Hay que contemplar la lectura inicial, valores inválidos y la disponibilidad de [[almacenamiento]] antes de usarla en producción.

  

### Extraer un [[Hook personalizado]]

  

Si la lógica crece, puede extraerse a un [[Hook]] como `useContador`, dejando `Contador` dedicado a la [[presentación]]:

  

```tsx

function useContador(valorInicial = 0, paso = 1) {

  const [valor, setValor] = useState(valorInicial);

  

  const incrementar = () => setValor((actual) => actual + paso);

  const decrementar = () => setValor((actual) => actual - paso);

  const reiniciar = () => setValor(valorInicial);

  

  return { valor, incrementar, decrementar, reiniciar };

}

```

  

El [[Hook personalizado]] debe llamarse siempre en el [[nivel superior]] de un componente o de otro Hook, nunca dentro de una condición, un bucle o un [[manejador de eventos]].

  

## Recomendaciones para [[mantenimiento]]

  

- Mantener la lógica de [[estado]] separada de la [[presentación]] cuando aumente la complejidad.

- Usar la [[forma funcional]] del [[setter]] para cambios relativos al valor anterior.

- Mantener las [[dependencias]] de `useEffect` completas y precisas.

- Añadir [[limpieza]] al efecto cuando se incorporen recursos externos.

- Tipar las [[props]] si el componente empieza a recibir configuración.

- Añadir [[pruebas]] para el valor inicial, incremento, decremento, reinicio y [[límites de negocio]].

- Evitar mover el componente a un [[Server Component]] mientras dependa de eventos y [[Hooks]] de cliente.

  

## [[Validación local]]

  

Desde la raíz del [[proyecto]] se pueden ejecutar:

  

```bash

npm run lint

npm run build

```

  

`lint` comprueba la [[calidad estática]] del código y `build` valida que [[Next.js]] pueda [[compilar]] correctamente la frontera entre [[Server Components]] y [[Client Components]].
