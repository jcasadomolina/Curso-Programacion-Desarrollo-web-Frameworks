# Documentación del Reto 2

## Resumen

Este proyecto es una aplicación web desarrollada con [[PHP]] y [[Laminas MVC]]. Su funcionalidad principal es la gestión de comentarios mediante un módulo independiente llamado `Comments`.

La aplicación permite consultar comentarios públicamente y crear nuevos comentarios. Las operaciones de edición y eliminación están restringidas a usuarios autenticados como moderadores.

La página principal de la aplicación muestra el listado de comentarios.

## Tecnologías principales

- [[PHP]] como lenguaje de programación del servidor.
- [[Laminas MVC]] como [[Framework]] para organizar la aplicación.
- [[Composer]] como gestor de dependencias y autoload.
- [[PSR-4]] para la carga automática de clases.
- [[HTML]] y [[Bootstrap]] para la presentación de las vistas.
- [[JSON]] como formato de almacenamiento de comentarios.
- [[PHPUnit]] para las pruebas automatizadas.
- [[PHP_CodeSniffer]] para revisar el estilo del código.
- [[Psalm]] como herramienta de [[Análisis estático]].

## Arquitectura

El proyecto sigue el patrón [[MVC]], que separa la aplicación en tres responsabilidades principales:

- **Modelo**: representa los datos y las operaciones de persistencia.
- **Vista**: genera la interfaz HTML que recibe el usuario.
- **Controlador**: recibe las peticiones, aplica la lógica de navegación y coordina los servicios.

La aplicación está organizada en módulos. El módulo base `Application` proporciona la configuración general, el layout y las vistas de error. El módulo `Comments` concentra toda la funcionalidad relacionada con los comentarios para facilitar su reutilización en otros proyectos [[Laminas]].

## Módulo Comments

El módulo está compuesto por las siguientes capas:

### Modelo

`Comment` representa un comentario y contiene:

- Identificador único.
- Nombre del autor.
- Texto del comentario.
- Fecha de creación.
- Fecha de actualización.

El modelo puede crear comentarios nuevos, actualizar sus datos y transformarse en un array para su almacenamiento.

### Repositorio

`CommentRepository` implementa el patrón [[Repositorio]]. Su responsabilidad es leer, guardar, actualizar y eliminar comentarios en un archivo [[JSON]].

El repositorio crea automáticamente el directorio de almacenamiento cuando es necesario y utiliza bloqueo de archivo durante la escritura para reducir conflictos de concurrencia.

### Servicio

`CommentService` concentra la lógica de negocio. Se encarga de:

- Validar el nombre del autor.
- Validar la longitud del contenido.
- Crear comentarios.
- Consultar comentarios.
- Actualizar comentarios.
- Eliminar comentarios.

Esta separación evita que el controlador tenga que conocer los detalles de la persistencia.

### Controlador

`CommentController` gestiona las peticiones [[HTTP]] del módulo y devuelve respuestas o modelos de vista.

Las acciones disponibles son:

- Listado de comentarios.
- Formulario y creación de comentarios.
- Formulario y edición de comentarios.
- Eliminación de comentarios.
- Inicio de sesión de moderadores.
- Cierre de sesión de moderadores.

El controlador establece explícitamente la plantilla del formulario para evitar que el sistema de resolución de vistas busque una plantilla inexistente.

### Vistas

Las vistas están implementadas con plantillas [[PHP]] y utilizan [[Bootstrap]] para la estructura visual.

- `index.phtml`: muestra el listado de comentarios.
- `form.phtml`: permite crear o editar un comentario.
- `login.phtml`: permite iniciar sesión como moderador.

Los datos introducidos por los usuarios se escapan antes de mostrarse en HTML mediante las herramientas de la vista. Esto ayuda a prevenir ataques de [[Cross-Site Scripting]].

## Flujo funcional

### Consulta pública

El usuario accede a la página principal. La ruta raíz invoca el controlador de comentarios, que solicita los datos al servicio. El servicio consulta el repositorio y la vista presenta los comentarios ordenados del más reciente al más antiguo.

### Creación de comentarios

Cualquier usuario puede abrir el formulario de creación. El controlador recibe los datos mediante una petición [[POST]], el servicio valida la información y el repositorio guarda el nuevo comentario en formato [[JSON]].

### Administración de comentarios

La edición y la eliminación requieren autenticación de moderador. La comprobación se realiza en el servidor antes de ejecutar la operación, por lo que no depende únicamente de ocultar botones en la interfaz.

Si una persona no autenticada intenta editar o eliminar un comentario, se redirige al acceso de moderador.

## Autenticación y autorización

`ModeratorAuthenticator` administra la autenticación mediante una [[Sesión]] de servidor.

El proceso es el siguiente:

1. El moderador introduce la contraseña.
2. El servicio compara la contraseña con la configuración del módulo.
3. Si es correcta, se regenera el identificador de sesión.
4. La sesión queda marcada como autenticada.
5. El controlador permite editar y eliminar comentarios.

La [[Autorización]] se comprueba en las acciones sensibles del controlador. La vista adapta los controles disponibles según el estado de autenticación.

La contraseña puede configurarse con la variable de entorno `COMMENTS_MODERATOR_PASSWORD`. El valor predeterminado `moderator` solo debe utilizarse en desarrollo.

## Rutas

| Método | Ruta | Acceso | Función |
| --- | --- | --- | --- |
| `GET` | `/` | Público | Página principal con comentarios |
| `GET` | `/comments` | Público | Listado de comentarios |
| `GET`, `POST` | `/comments/create` | Público | Crear comentario |
| `GET` | `/comments/login` | Público | Acceso de moderador |
| `POST` | `/comments/logout` | Moderador | Cerrar sesión |
| `GET`, `POST` | `/comments/edit/:id` | Moderador | Editar comentario |
| `POST` | `/comments/delete/:id` | Moderador | Eliminar comentario |

## Configuración e integración

El módulo puede integrarse en otro proyecto [[Laminas MVC]] con una configuración mínima.

Primero se añade el namespace `Comments` al autoload [[PSR-4]] de `composer.json` y se registra `Comments` en `config/modules.config.php`.

Después se ejecuta:

```bash
composer dump-autoload
```

La configuración del módulo permite cambiar la ubicación del archivo de comentarios y la contraseña de moderador:

```php
return [
    'comments' => [
        'storage_path' => __DIR__ . '/../../data/comments.json',
        'moderator_password' => getenv('COMMENTS_MODERATOR_PASSWORD'),
    ],
];
```

La ruta de almacenamiento debe ser escribible por el proceso del servidor. En un entorno de producción, la contraseña debe proceder de una variable de entorno o de un [[Gestor de secretos]].

La documentación específica de integración está disponible en `module/Comments/README.md`.

## Pruebas y calidad

El proyecto utiliza [[Pruebas automatizadas]] para comprobar los flujos principales:

- Acceso a la página principal.
- Resolución de la vista de creación.
- Redirección de usuarios no autenticados al intentar editar.
- Respuestas para rutas inexistentes.

Los comandos principales son:

```bash
composer test
composer cs-check
composer static-analysis
```

[[PHPUnit]] verifica el comportamiento de la aplicación. [[PHP_CodeSniffer]] comprueba las convenciones de estilo y [[Psalm]] ayuda a detectar problemas de tipos y posibles errores antes de ejecutar la aplicación.

## Decisiones técnicas

- Se utiliza un módulo independiente para reducir el acoplamiento con la aplicación base.
- La lógica de negocio está fuera del controlador y se concentra en un servicio.
- La persistencia se abstrae mediante un repositorio.
- La configuración de almacenamiento y autenticación puede sobrescribirse sin modificar el código del módulo.
- Las operaciones sensibles se protegen en el servidor mediante [[Autorización]].
- Las plantillas escapan el contenido introducido por los usuarios.

## Mejoras futuras

Para una aplicación de producción podrían añadirse:

- [[Base de datos]] en lugar de almacenamiento en archivo.
- Gestión completa de usuarios y roles.
- [[Hash de contraseñas]] almacenado de forma segura.
- Protección [[CSRF]] para formularios que modifican datos.
- Paginación y búsqueda de comentarios.
- Registro de actividad de moderación.
- Respuestas en formato [[API REST]] para clientes externos.
- Pruebas de integración con una base de datos temporal.

## Conclusión

El proyecto aplica una estructura modular basada en [[Laminas MVC]], separa la presentación, la lógica de negocio y la persistencia, y ofrece un módulo de comentarios reutilizable. La configuración externa y la documentación permiten trasladar el módulo a otro proyecto con pocos cambios.
