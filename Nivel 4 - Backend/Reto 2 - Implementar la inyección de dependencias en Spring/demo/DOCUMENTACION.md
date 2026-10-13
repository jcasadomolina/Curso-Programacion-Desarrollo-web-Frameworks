# Documentacion del proyecto

## 1. Descripcion general

Este proyecto es una API REST desarrollada con Spring Boot para gestionar productos. La aplicacion permite crear, consultar, actualizar y eliminar productos mediante peticiones HTTP.

La organizacion sigue una separacion sencilla por capas:

```text
Cliente HTTP
    |
    v
ProductoController  ->  ProductoService  ->  ProductoRepository  ->  Base de datos H2
        |                    |                    |
        v                    v                    v
      REST              Logica de aplicacion   Acceso a datos
```

## 2. Configuracion del proyecto

### 2.1 Sistema de construccion

El proyecto utiliza Gradle y conserva el wrapper (`gradlew` y `gradlew.bat`), por lo que puede construirse sin instalar Gradle globalmente.

En `settings.gradle` se define el nombre del proyecto:

```groovy
rootProject.name = 'demo'
```

En `build.gradle` se configura lo siguiente:

- Plugin de Java.
- Plugin de Spring Boot en la version `4.1.1`.
- Plugin de gestion de dependencias de Spring.
- Java 17 mediante el mecanismo de toolchains de Gradle.
- Repositorio de dependencias Maven Central.

### 2.2 Dependencias principales

- `spring-boot-starter-webmvc`: permite crear la API web y utilizar controladores REST.
- `spring-boot-starter-data-jpa`: integra JPA y Spring Data para trabajar con persistencia.
- `spring-boot-h2console`: habilita la integracion con la consola de H2.
- `h2`: base de datos utilizada en tiempo de ejecucion.
- Dependencias de prueba de MVC y JPA.
- `junit-platform-launcher`: soporte para la ejecucion de pruebas con la plataforma JUnit.

### 2.3 Propiedades de Spring

El archivo `src/main/resources/application.properties` contiene:

```properties
spring.application.name=demo
```

Esto establece el nombre de la aplicacion. No se han definido propiedades explicitas de conexion a H2, por lo que, si se necesita una configuracion concreta de la base de datos, convendria anadir la URL JDBC, el usuario, la contrasena y la estrategia de generacion del esquema.

### 2.4 Arranque y pruebas

Desde la carpeta del proyecto se puede arrancar la aplicacion con:

```bash
./gradlew bootRun
```

En Windows tambien puede utilizarse:

```bat
gradlew.bat bootRun
```

Para ejecutar las pruebas:

```bat
gradlew.bat test
```

La clase `DemoApplicationTests` comprueba actualmente que el contexto de Spring puede arrancar correctamente.

## 3. Clases y responsabilidades

### 3.1 `DemoApplication`

Es la clase principal de la aplicacion. El metodo `main` llama a `SpringApplication.run`, que inicia Spring Boot y crea el contexto de la aplicacion.

La anotacion `@SpringBootApplication` combina tres capacidades importantes:

- Configuracion automatica de Spring Boot.
- Escaneo de componentes dentro del paquete `com.example.demo` y sus subpaquetes.
- Posibilidad de declarar configuracion adicional.

### 3.2 `Producto`

Es la entidad del dominio y se encuentra en el paquete `model`.

- `@Entity` indica que la clase se persiste mediante JPA.
- `id` es la clave primaria y se genera automaticamente con `GenerationType.IDENTITY`.
- `nombre` y `precio` representan los datos del producto.
- El constructor vacio es necesario para que JPA pueda crear instancias.
- Los getters y setters permiten a JPA y a Jackson leer y escribir los datos.

### 3.3 `ProductoRepository`

Es una interfaz del paquete `repository` que extiende `JpaRepository<Producto, Long>`.

Al extender `JpaRepository`, hereda operaciones CRUD como:

- `findAll()` para obtener todos los productos.
- `findById(id)` para buscar un producto por su identificador.
- `save(producto)` para insertar o actualizar.
- `deleteById(id)` para eliminar.

No es necesario implementar manualmente estos metodos: Spring Data crea una implementacion y la registra como bean durante el arranque.

### 3.4 `ProductoService`

Es la interfaz de la capa de servicio. Define las operaciones que necesita el controlador:

- Obtener todos los productos.
- Obtener un producto por su identificador.
- Guardar un producto.
- Eliminar un producto.

La interfaz desacopla al controlador de la clase concreta que realiza el trabajo.

### 3.5 `ProductoServiceImplementacion`

Es la implementacion de `ProductoService` y esta marcada con `@Service`, por lo que Spring la registra como componente de la capa de negocio.

Recibe un `ProductoRepository` en el constructor y delega en el repositorio las operaciones de persistencia. Actualmente la logica de negocio es minima, pero esta capa permite incorporar validaciones, reglas y transformaciones sin cargar el controlador.

### 3.6 `ProductoController`

Es un controlador REST marcado con `@RestController` y con la ruta base `/api/productos`.

| Metodo | Ruta | Funcion |
| --- | --- | --- |
| `POST` | `/api/productos` | Crea un producto a partir de un JSON. |
| `GET` | `/api/productos` | Devuelve todos los productos. |
| `GET` | `/api/productos/{id}` | Devuelve un producto por su ID. |
| `PUT` | `/api/productos/{id}` | Actualiza el producto indicado. |
| `DELETE` | `/api/productos/{id}` | Elimina el producto indicado. |

Para recibir y devolver JSON se utilizan `@RequestBody` y el comportamiento automatico de Spring MVC con Jackson. `@PathVariable` obtiene el identificador incluido en la URL.

En la consulta por ID, si el producto no existe, el controlador devuelve actualmente `null`. En una version posterior seria recomendable devolver una respuesta HTTP `404 Not Found` mediante `ResponseEntity` o una excepcion gestionada globalmente.

## 4. Inyeccion de dependencias en Spring

### 4.1 Que dependencia necesita cada clase

El flujo de dependencias es el siguiente:

1. `ProductoController` necesita un objeto que implemente `ProductoService`.
2. Spring encuentra `ProductoServiceImplementacion`, que implementa esa interfaz y esta anotada con `@Service`.
3. `ProductoServiceImplementacion` necesita un `ProductoRepository`.
4. Spring Data crea automaticamente el bean concreto que implementa `ProductoRepository`.
5. Spring construye los objetos y los entrega ya conectados al controlador.

Por tanto, el controlador no utiliza `new ProductoServiceImplementacion(...)` ni crea el repositorio. El contenedor de Spring administra el ciclo de vida y el ensamblado de los componentes.

### 4.2 Inyeccion por constructor

El proyecto utiliza inyeccion por constructor:

```java
public ProductoController(ProductoService service) {
    this.service = service;
}
```

Y aplica el mismo patron en el servicio:

```java
public ProductoServiceImplementacion(ProductoRepository repository) {
    this.repository = repository;
}
```

Esta forma de inyeccion tiene varias ventajas:

- Hace obligatorias las dependencias necesarias para crear el objeto.
- Permite declarar los atributos como `final` y mantenerlos inmutables despues de la construccion.
- Facilita las pruebas unitarias, porque se puede pasar un mock o una implementacion alternativa directamente al constructor.
- Hace visible la relacion entre clases en la propia firma del constructor.
- Evita depender de reflexion para modificar atributos privados despues de crear el objeto.

Cuando una clase tiene un unico constructor, Spring puede utilizarlo automaticamente sin que sea necesario anadir `@Autowired`.

### 4.3 Inyectar la interfaz

`ProductoController` recibe `ProductoService` y no `ProductoServiceImplementacion`. Esto reduce el acoplamiento: el controlador conoce el contrato que necesita, pero no los detalles de la implementacion.

En el futuro se podria sustituir `ProductoServiceImplementacion` por otra implementacion, por ejemplo una que aplique una estrategia distinta, sin cambiar el controlador. Si hubiera varias implementaciones de la misma interfaz, seria necesario indicar cual debe utilizarse mediante `@Primary` o `@Qualifier`.

## 5. Conclusiones

- Spring Boot simplifica el arranque gracias a la configuracion automatica y al escaneo de componentes.
- Spring Data JPA evita escribir gran parte del codigo repetitivo de acceso a datos.
- La separacion entre controlador, servicio y repositorio mejora la organizacion y permite que cada capa tenga una responsabilidad clara.
- La inyeccion por constructor hace explicitas las dependencias y favorece clases mas faciles de probar y mantener.
- Inyectar interfaces disminuye el acoplamiento entre las capas y facilita cambiar implementaciones.
- El contenedor de Spring se encarga de crear y conectar los objetos, por lo que las clases no tienen que construir manualmente sus colaboradores.
- La aplicacion es un buen punto de partida, aunque seria recomendable anadir validacion de entrada, respuestas `404` y otros codigos HTTP apropiados, manejo global de excepciones, pruebas de los endpoints y una configuracion explicita de H2 para entornos concretos.