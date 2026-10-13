# Documentación del proyecto Hibernate

## 1. Descripción general

Este proyecto es una aplicación Java sencilla que utiliza Hibernate ORM para
persistir objetos Java en una base de datos H2 en memoria. El ejemplo modela
usuarios y demuestra las cuatro operaciones básicas de persistencia:

- Crear un usuario.
- Consultar un usuario por su identificador.
- Actualizar los datos de un usuario.
- Eliminar un usuario.

La estructura principal del proyecto es:

```text
hibernate/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── Main.java
│   │   ├── java/com/reto3/Usuario.java
│   │   ├── java/com/reto3/UsuarioDAO.java
│   │   └── resources/hibernate.cfg.xml
│   └── test/java/com/reto3/UsuarioDAOTest.java
└── target/
```

## 2. Configuración del proyecto

El proyecto se gestiona con Maven mediante el archivo `pom.xml`.

### Java

Se compila con Java 17, configurado mediante las propiedades:

```xml
<maven.compiler.source>17</maven.compiler.source>
<maven.compiler.target>17</maven.compiler.target>
```

### Dependencias principales

| Dependencia | Versión | Uso |
| --- | --- | --- |
| `org.hibernate.orm:hibernate-core` | `6.4.4.Final` | ORM, sesiones, transacciones y acceso a persistencia |
| `com.h2database:h2` | `2.2.224` | Base de datos en memoria para las pruebas |
| `org.junit.jupiter:junit-jupiter-engine` | `5.10.2` | Ejecución de tests con JUnit 5 |
| `maven-compiler-plugin` | `3.14.1` | Compilación del código Java |
| `maven-surefire-plugin` | `3.5.3` | Ejecución de tests durante la fase `test` |

H2 y JUnit están declaradas con `scope` `test`, por lo que se utilizan para
las pruebas y no forman parte de las dependencias de ejecución principal.

### Configuración de Hibernate

La configuración se encuentra en
`src/main/resources/hibernate.cfg.xml`. Hibernate la carga mediante
`Configuration().configure()`.

Los aspectos más relevantes son:

- **Driver:** `org.h2.Driver`.
- **URL:** `jdbc:h2:mem:proyectodb;DB_CLOSE_DELAY=-1`.
- **Usuario:** `sa`, sin contraseña.
- **Dialecto:** `org.hibernate.dialect.H2Dialect`.
- **Autocommit:** desactivado, para controlar las transacciones de forma explícita.
- **Segundo nivel de caché:** desactivado.
- **SQL:** activado con `hibernate.show_sql=true`.
- **Esquema:** `hibernate.hbm2ddl.auto=update`, que permite crear o actualizar
  la estructura durante el desarrollo.
- **Entidad registrada:** `com.reto3.Usuario`.

La base de datos es temporal. Al ser una base H2 en memoria, los datos sirven
para la ejecución actual y no se conservan como una base de datos de
producción.

## 3. Entidad `Usuario`

La clase `com.reto3.Usuario` representa una entidad persistente:

```java
@Entity
@Table(name = "usuarios")
public class Usuario { ... }
```

### Mapeo de atributos

| Atributo | Mapeo | Significado |
| --- | --- | --- |
| `id` | `@Id` y `@GeneratedValue(strategy = GenerationType.IDENTITY)` | Clave primaria generada por la base de datos |
| `nombre` | `@Column(nullable = false, length = 100)` | Nombre obligatorio de hasta 100 caracteres |
| `email` | `@Column(nullable = false, unique = true)` | Email obligatorio y único |

La entidad incluye un constructor vacío, necesario para que Hibernate pueda
instanciarla, y otro constructor para crear usuarios con nombre y email.
También proporciona getters y setters para acceder a sus propiedades.

## 4. Clase `UsuarioDAO`

`UsuarioDAO` concentra el acceso a los datos de `Usuario`.

En su constructor crea una `SessionFactory` a partir de la configuración de
Hibernate y registra la entidad anotada. La `SessionFactory` es un objeto
pesado que normalmente se crea una sola vez y se reutiliza durante la vida de
la aplicación.

Cada operación abre una `Session` y la cierra automáticamente mediante
try-with-resources.

### Operaciones implementadas

- `guardarUsuario(Usuario usuario)`: inicia una transacción, llama a
  `session.persist(usuario)` y confirma la transacción.
- `obtenerUsuario(Long id)`: recupera la entidad mediante
  `session.get(Usuario.class, id)`.
- `actualizarUsuario(Usuario usuario)`: inicia una transacción y utiliza
  `session.merge(usuario)` para sincronizar los cambios.
- `eliminarUsuario(Long id)`: busca el usuario, lo elimina si existe y
  confirma la transacción.

Este patrón muestra claramente el ciclo de vida básico de Hibernate:

```text
SessionFactory -> Session -> Transaction -> operación ORM -> commit -> close
```

## 5. Test `UsuarioDAOTest`

El test `com.reto3.UsuarioDAOTest` se ejecuta con JUnit 5.

El método `setUp`, anotado con `@BeforeEach`, crea un nuevo `UsuarioDAO` antes
de cada prueba. El test `testOperacionesCRUD` comprueba en orden:

1. **Create:** guarda `Juan Perez` y verifica que Hibernate haya generado un
   identificador.
2. **Read:** recupera el usuario y comprueba su nombre.
3. **Update:** cambia el nombre a `Juan Modificado`, guarda el cambio y vuelve
   a consultar la entidad para verificarlo.
4. **Delete:** elimina el usuario y comprueba que la consulta posterior
   devuelve `null`.

El test valida el comportamiento integrado entre la entidad, el DAO,
Hibernate y la base de datos H2. No es solo un test unitario aislado, porque
utiliza una sesión y una base de datos reales, aunque sean locales y en
memoria.

## 6. Ejecución

Con Maven instalado y disponible en el `PATH`, el ciclo habitual es:

```bash
mvn test
```

Para limpiar y volver a ejecutar toda la compilación:

```bash
mvn clean test
```

Durante las pruebas Hibernate muestra las sentencias SQL generadas porque
`hibernate.show_sql` está activado.

## 7. Hibernate e inyección de dependencias

### Qué aporta Hibernate

Hibernate aporta principalmente una solución de **mapeo objeto-relacional**:

- Permite trabajar con objetos Java en lugar de escribir todo el SQL a mano.
- Convierte las anotaciones de `Usuario` en una estructura de tabla.
- Gestiona el estado de las entidades dentro de una sesión.
- Proporciona operaciones como `persist`, `get`, `merge` y `remove`.
- Coordina las operaciones con transacciones.
- Puede generar SQL compatible con el dialecto de la base de datos configurada.

### Qué no aporta por sí solo

Hibernate no es, por sí mismo, un contenedor general de inyección de
dependencias como Spring. En este proyecto el DAO crea explícitamente su
dependencia:

```java
sessionFactory = new Configuration()
        .configure()
        .addAnnotatedClass(Usuario.class)
        .buildSessionFactory();
```

Por tanto, la `SessionFactory` está **instanciada manualmente**, no inyectada.
Esto acopla `UsuarioDAO` a la forma concreta de configurar Hibernate y hace
más difícil sustituir la factoría por un doble de prueba o compartirla con
otros DAOs.

### Conclusión

Hibernate facilita mucho la persistencia y reduce el código repetitivo de
acceso a la base de datos, pero la inyección de dependencias debe proporcionarla
la arquitectura de la aplicación. En una aplicación mayor sería preferible:

- Crear una única `SessionFactory` como componente compartido.
- Inyectarla en `UsuarioDAO` mediante constructor.
- Delegar la creación y el ciclo de vida de los componentes a un contenedor,
  por ejemplo Spring, CDI o Jakarta EE.
- Mantener las transacciones en una capa bien definida, especialmente cuando
  una operación de negocio combina varias consultas o escrituras.
- Cerrar la `SessionFactory` cuando se detenga la aplicación.

La conclusión principal es que Hibernate resuelve la persistencia, mientras
que un contenedor de dependencias resuelve la creación, composición y ciclo de
vida de los objetos. Son responsabilidades relacionadas, pero diferentes.

## 8. Observaciones sobre el estado actual

`src/main/Main.java` parece conservar referencias de una estructura anterior:
declara el paquete `com.reto3.modelo` e importa `com.reto3.modelo.Usuario`,
mientras que la entidad actual está en `com.reto3.Usuario`. Si se desea usar
esa clase como punto de entrada, habría que actualizar el paquete y el import
para que coincidan con la estructura actual.

La comprobación `mvn test` no se pudo ejecutar en el entorno de documentación
porque el comando `mvn` no está disponible en el `PATH`. La configuración y el
comportamiento descritos se han deducido de los archivos fuente y de
configuración del proyecto.