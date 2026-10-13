# Microservicio de clientes

## Resumen

Este proyecto es un [[Microservicio]] desarrollado con [[Java]] y [[Spring Boot]]. Expone una [[API REST]] para gestionar clientes mediante operaciones [[CRUD]]: crear, consultar, actualizar y eliminar información.

La aplicación sigue una arquitectura por capas formada por [[Controlador]], [[Servicio]], [[Repositorio]] y [[Entidad]]. Cada capa tiene una responsabilidad concreta y delega el trabajo a la siguiente, lo que mejora la [[Cohesión]] y facilita el mantenimiento.

## Tecnologías principales

- [[Java 17]]: lenguaje y versión utilizada por el proyecto.
- [[Spring Boot]]: simplifica la configuración y el arranque de la aplicación.
- [[Spring Web MVC]]: permite crear los endpoints HTTP mediante un controlador REST.
- [[Spring Data JPA]]: proporciona una abstracción para acceder a los datos.
- [[JPA]]: especificación para mapear objetos Java a tablas de una base de datos.
- [[Hibernate]]: implementación de JPA utilizada por Spring Boot.
- [[H2]]: base de datos relacional en memoria utilizada durante la ejecución.
- [[Gradle]]: herramienta de construcción, gestión de dependencias y ejecución.
- [[Tomcat]]: servidor web embebido que atiende las peticiones HTTP.
- [[Postman]]: herramienta utilizada para probar los endpoints.

## Arranque de la aplicación

La clase `MicroservicioApplication` contiene el método `main` y utiliza `@SpringBootApplication`. Esta anotación combina tres capacidades:

- [[Configuración automática]] de Spring Boot.
- [[Escaneo de componentes]] dentro del paquete principal y sus subpaquetes.
- Configuración de la aplicación como [[Aplicación Spring Boot]].

La aplicación se inicia con:

```powershell
.\gradlew.bat bootRun
```

Durante el arranque, Spring Boot crea el [[Contexto de Spring]], registra los componentes, configura el servidor web, inicializa la persistencia y deja disponible la API en el puerto `8080`.

El proceso `bootRun` permanece ejecutándose porque el servidor debe seguir activo para recibir peticiones. Se detiene con `Ctrl + C`.

## Modelo de datos

La clase `Customer` representa un cliente y está marcada con `@Entity`, por lo que [[JPA]] la considera una entidad persistente.

Sus atributos son:

- `id`: identificador único de tipo `Long`.
- `nombre`: nombre del cliente.
- `email`: correo electrónico del cliente.

La anotación `@Id` identifica la clave primaria. `@GeneratedValue(strategy = GenerationType.IDENTITY)` permite que la base de datos genere automáticamente el identificador al guardar un cliente.

El constructor vacío es necesario para que [[JPA]] pueda crear instancias de la entidad. Los métodos [[Getter]] y [[Setter]] permiten leer y modificar sus atributos.

## Arquitectura por capas

### 1. Capa de presentación: controlador

`CustomerController` está anotado con `@RestController` y expone la ruta base:

```text
/api/customers
```

`@RestController` indica que la clase recibe peticiones HTTP y devuelve respuestas, normalmente serializadas como [[JSON]]. `@RequestMapping` establece la ruta común de todos los endpoints.

El controlador no accede directamente a la base de datos. Recibe la petición, obtiene sus datos y delega la operación en `CustomerService`.

### 2. Capa de servicio

`CustomerService` es una [[Interfaz]] que define las operaciones disponibles para los clientes:

```java
List<Customer> getAllCustomers();
Optional<Customer> getCustomerById(Long id);
Customer saveCustomer(Customer customer);
void deleteCustomer(Long id);
```

`CustomerServiceImplementation` implementa esa interfaz y está anotada con `@Service`. Esta anotación registra la clase como [[Bean de Spring]], permitiendo que Spring la cree e inyecte automáticamente en el controlador.

La capa de servicio actúa como punto central de la [[Lógica de negocio]]. Actualmente delega las operaciones en el repositorio, pero permite añadir validaciones o reglas de negocio sin cargar el controlador.

### 3. Capa de persistencia: repositorio

`CustomerRepository` es una interfaz que extiende:

```java
JpaRepository<Customer, Long>
```

El primer parámetro indica la entidad gestionada (`Customer`) y el segundo el tipo de su identificador (`Long`).

[[Spring Data JPA]] genera automáticamente la implementación del repositorio. Por ello no es necesario escribir una clase con SQL para las operaciones básicas.

El repositorio proporciona métodos como:

- `save(customer)`: inserta o actualiza un cliente.
- `findAll()`: recupera todos los clientes.
- `findById(id)`: busca un cliente por su identificador.
- `existsById(id)`: comprueba si existe un cliente.
- `deleteById(id)`: elimina un cliente por su identificador.

### 4. Capa de base de datos

[[Hibernate]] traduce las operaciones de `CustomerRepository` a instrucciones SQL y mantiene la correspondencia entre la clase `Customer` y la tabla de la base de datos.

[[H2]] se ejecuta en memoria, por lo que los datos se pierden al detener la aplicación. Es apropiada para prácticas, pruebas y demostraciones. En un entorno real se sustituiría por una base de datos persistente como [[PostgreSQL]] o [[MySQL]].

## Flujo de una petición

El recorrido de una petición es el siguiente:

```text
Cliente HTTP
    -> CustomerController
    -> CustomerService
    -> CustomerRepository
    -> Hibernate / JPA
    -> Base de datos H2
```

1. Un cliente HTTP, por ejemplo [[Postman]], envía una petición a `/api/customers`.
2. [[Spring Web MVC]] identifica el método del controlador mediante sus anotaciones.
3. `CustomerController` recibe los parámetros o el cuerpo de la petición.
4. El controlador llama a `CustomerService`.
5. `CustomerServiceImplementation` delega la operación en `CustomerRepository`.
6. [[Spring Data JPA]] y [[Hibernate]] ejecutan la operación sobre [[H2]].
7. El resultado vuelve por las mismas capas hasta convertirse en una respuesta [[HTTP]].

## Endpoints disponibles

### Crear un cliente

```http
POST /api/customers
Content-Type: application/json
```

Cuerpo de ejemplo:

```json
{
  "nombre": "Ana García",
  "email": "ana@example.com"
}
```

El método `saveCustomer` guarda la entidad. Como el identificador todavía no existe, JPA realiza una inserción.

### Obtener todos los clientes

```http
GET /api/customers
```

Devuelve una lista de clientes mediante `customerRepository.findAll()`.

### Obtener un cliente por ID

```http
GET /api/customers/{id}
```

El identificador se obtiene con `@PathVariable`. El repositorio devuelve un `Optional<Customer>`, que representa un resultado que puede existir o no.

### Actualizar un cliente

```http
PUT /api/customers/{id}
Content-Type: application/json
```

El controlador asigna el ID de la ruta al objeto recibido y reutiliza `save`. Si la entidad ya existe, JPA realiza una actualización.

### Eliminar un cliente

```http
DELETE /api/customers/{id}
```

El servicio llama a `deleteById` para eliminar el registro correspondiente.

## Inyección de dependencias

El controlador recibe `CustomerService` mediante su constructor. Esta técnica se denomina [[Inyección de dependencias por constructor]]. Spring localiza el bean `CustomerServiceImplementation`, registrado con `@Service`, y lo proporciona automáticamente.

La inyección permite que las clases dependan de abstracciones, como la interfaz `CustomerService`, en lugar de crear manualmente sus dependencias. Esto favorece el [[Bajo acoplamiento]] y facilita las pruebas.

## Problema encontrado y solución

El primer arranque falló porque `CustomerServiceImplementation` no tenía `@Service`. Aunque la clase implementaba `CustomerService`, Spring no la registraba como bean y no podía inyectarla en `CustomerController`.

La solución fue añadir:

```java
@Service
public class CustomerServiceImplementation implements CustomerService {
```

También fue necesario marcar `Customer` con `@Entity` para que [[JPA]] reconociera la clase como entidad persistente.

## Validación

El proyecto se validó con:

```powershell
.\gradlew.bat test
```

La aplicación se ejecutó correctamente con `bootRun` y se comprobó el funcionamiento de los endpoints mediante [[Postman]]. El mensaje `Tomcat started on port 8080` confirma que el servidor está listo para recibir peticiones.

## Ideas clave

- [[Spring Boot]] configura y arranca la aplicación.
- [[Spring Web MVC]] transforma métodos Java en endpoints HTTP.
- [[JPA]] relaciona objetos Java con tablas.
- [[Hibernate]] ejecuta la persistencia real.
- [[Spring Data JPA]] evita escribir código repetitivo para el acceso a datos.
- [[@Entity]] identifica una clase persistente.
- [[@Service]] registra la lógica de negocio como bean.
- [[@RestController]] expone una API REST.
- [[JpaRepository]] proporciona operaciones CRUD.
- La separación entre [[Controlador]], [[Servicio]] y [[Repositorio]] mantiene una arquitectura organizada y cohesiva.
