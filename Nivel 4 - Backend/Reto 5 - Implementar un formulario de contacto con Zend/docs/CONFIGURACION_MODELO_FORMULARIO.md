# Documentación técnica del proyecto

## Resumen del proceso de creación

El proceso de inicialización y creación de este proyecto web con **[[Laminas MVC]]** consta de los siguientes pasos fundamentales:
* **Preparación del entorno:** Verificación de **[[XAMPP]]** y activación de las extensiones `intl` y `pdo_mysql` en **[[PHP]]**.
* **Persistencia:** Creación de la base de datos `fundae_reto5_db` y la tabla `mensajes_contacto` en **[[MySQL]]** (a través de **[[phpMyAdmin]]**).
* **Dependencias:** Instalación del núcleo y los módulos adicionales de Laminas (como `laminas-db` y `laminas-form`) utilizando **[[Composer]]**.
* **Configuración:** Ajuste de las credenciales y el puerto de conexión a la base de datos en el archivo `config/autoload/global.php`.
* **Ejecución:** Arranque del servidor de desarrollo integrado de **[[PHP]]** mediante el comando `php -S localhost:8080 -t public`.

---

## 1. Descripción general

Este proyecto es una aplicación MVC construida con Laminas MVC. Su funcionalidad principal es mostrar un formulario de contacto en la página raíz (`/`) y almacenar los mensajes válidados en una base de datos MySQL.

El flujo actual está preparado para ejecutarse localmente con:

- PHP de XAMPP.
- MySQL/MariaDB de XAMPP.
- phpMyAdmin para administrar la base de datos.
- El servidor web incorporado de PHP:

```powershell
php -S localhost:8080 -t public
```

La aplicación utiliza la base de datos `fundae_reto5_db` y la tabla `mensajes_contacto`.

## 2. Estructura relevante

```text
reto5/
├── config/
│   ├── application.config.php
│   ├── modules.config.php
│   └── autoload/
│       └── global.php
├── module/Application/
│   ├── config/module.config.php
│   ├── src/
│   │   ├── Controller/
│   │   │   ├── IndexController.php
│   │   │   └── ContactController.php
│   │   ├── Form/ContactForm.php
│   │   └── Model/
│   │       ├── Contacto.php
│   │       └── ContactoMapper.php
│   └── view/
│       ├── application/index/index.phtml
│       └── layout/layout.phtml
├── public/index.php
├── composer.json
└── vendor/
```

### Responsabilidad de cada zona

| Zona | Responsabilidad |
|---|---|
| `public/` | Punto de entrada HTTP de la aplicación. |
| `config/` | Configuración general, módulos y conexión a la base de datos. |
| `module/Application/config/` | Rutas, factorías, servicios y vistas del módulo. |
| `Controller/` | Recibe la petición y coordina el flujo de aplicación. |
| `Form/` | Define campos, filtros y validaciones. |
| `Model/` | Representa los datos y encapsula el acceso mediante `TableGateway`. |
| `view/` | Plantillas HTML/PHTML que se muestran al usuario. |

## 3. Configuración de ejecución local

### 3.1 Requisitos

Antes de iniciar la aplicación deben estar disponibles:

1. XAMPP con PHP.
2. MySQL iniciado desde XAMPP.
3. La extensión PHP `intl` activada.
4. La extensión PHP `pdo_mysql` activada.
5. Composer instalado o accesible desde la terminal.
6. La base de datos `fundae_reto5_db` creada en phpMyAdmin.
7. La tabla `mensajes_contacto` creada en esa base de datos.

La extensión `intl` es necesaria porque Laminas I18n utiliza la clase PHP `Locale`.

### 3.2 Conexión a MySQL

La conexión se define en `config/autoload/global.php`:

```php
'db' => [
    'driver'   => 'Pdo_Mysql',
    'hostname' => 'localhost',
    'port'     => 9009,
    'database' => 'fundae_reto5_db',
    'username' => 'root',
    'password' => '',
    'charset'  => 'utf8mb4',
],
```

El puerto `9009` corresponde a la configuración actual de MySQL en XAMPP. Si MySQL vuelve a utilizar el puerto estándar `3306`, debe cambiarse este valor.

Los parámetros significan:

- `driver`: utiliza PDO para MySQL.
- `hostname`: servidor local.
- `port`: puerto TCP donde escucha MySQL.
- `database`: base de datos seleccionada.
- `username`: usuario de MySQL.
- `password`: contraseña del usuario. En esta instalación está vacía.
- `charset`: codificación utilizada por la conexión.

### 3.3 Instalación y arranque

Desde la raíz del proyecto:

```powershell
composer install
php -S localhost:8080 -t public
```

También existe el alias de Composer:

```powershell
composer serve
```

La aplicación queda disponible en:

```text
http://localhost:8080/
```

Después de modificar la configuración de Laminas se puede limpiar la caché con:

```powershell
php bin/clear-config-cache.php
```

## 4. Dependencias principales

Las dependencias de ejecución declaradas en `composer.json` incluyen:

| Dependencia | Uso |
|---|---|
| `laminas/laminas-mvc` | Núcleo MVC, enrutamiento de la petición y controladores. |
| `laminas/laminas-db` | Adaptador PDO, `TableGateway` y acceso a MySQL. |
| `laminas/laminas-form` | Clase `Form`, elementos y helpers de formularios. |
| `laminas/laminas-i18n` | Traducción y soporte internacional utilizado por los helpers. |
| `laminas/laminas-development-mode` | Configuración y utilidades de desarrollo. |

Los módulos se activan en `config/modules.config.php`:

```php
return [
    'Laminas\\I18n',
    'Laminas\\Form',
    'Laminas\\Hydrator',
    'Laminas\\InputFilter',
    'Laminas\\Filter',
    'Laminas\\Db',
    'Laminas\\Router',
    'Laminas\\Validator',
    'Application',
];
```

La activación de `Laminas\\I18n` explica por qué la extensión `intl` de PHP debe estar habilitada.

## 5. Configuración general de Laminas

`config/application.config.php` carga:

- La lista de módulos desde `config/modules.config.php`.
- Las configuraciones globales y locales desde `config/autoload/`.
- La caché de configuración en `data/cache/`.

La configuración de caché está activada:

```php
'config_cache_enabled' => true,
'module_map_cache_enabled' => true,
'cache_dir' => 'data/cache/',
```

Por este motivo, después de cambiar archivos de configuración conviene ejecutar `php bin/clear-config-cache.php` y reiniciar el servidor PHP.

## 6. Rutas de la aplicación

Las rutas se definen en `module/Application/config/module.config.php`.

| Nombre | Método | URL | Controlador | Acción |
|---|---|---|---|---|
| `home` | GET/POST | `/` | `IndexController` | `indexAction()` |
| `contacto` | GET | `/contacto` | `ContactController` | `indexAction()` |
| `contacto-procesar` | POST | `/contacto/procesar` | `ContactController` | `processAction()` |

El flujo principal es `home`. La vista de inicio envía el formulario a `home`, por lo que tanto la visualización como el procesamiento se realizan en `/`.

Las rutas `contacto` y `contacto-procesar` pertenecen al flujo anterior de contacto y se mantienen registradas por compatibilidad. El formulario principal no las utiliza actualmente.

## 7. Servicios y factorías

En `module.config.php` se registran dos servicios relacionados con la persistencia.

### 7.1 `ContactoTableGateway`

La factoría obtiene la configuración `db`, crea un adaptador y construye un `TableGateway`:

```php
$dbAdapter = new Adapter($container->get('config')['db']);
$resultSetPrototype = new ResultSet();
$resultSetPrototype->setArrayObjectPrototype(new Contacto());

return new TableGateway(
    'mensajes_contacto',
    $dbAdapter,
    null,
    $resultSetPrototype
);
```

Esto conecta la tabla SQL `mensajes_contacto` con objetos `Contacto`.

### 7.2 `ContactoMapper`

La factoría de `ContactoMapper` solicita `ContactoTableGateway` al ServiceManager y lo inyecta en el mapper:

```php
return new ContactoMapper($tableGateway);
```

### 7.3 Controlador

`IndexController` también recibe `ContactoMapper` por inyección de dependencias. De esta forma, el controlador no construye directamente la conexión ni ejecuta SQL.

## 8. Modelo de datos

### 8.1 Tabla `mensajes_contacto`

La aplicación espera una tabla con esta estructura lógica:

| Campo | Tipo recomendado | Nulo | Descripción |
|---|---|---:|---|
| `id` | `INT UNSIGNED AUTO_INCREMENT` | No | Identificador único del mensaje. |
| `nombre` | `VARCHAR(100)` | No | Nombre de la persona. |
| `email` | `VARCHAR(255)` | No | Dirección de correo electrónico. |
| `mensaje` | `TEXT` | No | Contenido del mensaje. |
| `fecha` | `DATETIME` | No | Fecha y hora de inserción o actualización. |

Una definición SQL equivalente es:

```sql
CREATE TABLE mensajes_contacto (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 8.2 Clase `Contacto`

`Application\\Model\\Contacto` representa una fila de la tabla mediante propiedades:

```php
private ?int $id;
private string $nombre;
private string $email;
private string $mensaje;
private ?string $fecha;
```

El método `exchangeArray()` hidrata el objeto a partir de un array. Convierte `id` a entero y asigna valores vacíos cuando un campo no está presente.

El método `getArrayCopy()` devuelve los datos del objeto en formato array. Los getters son utilizados por el mapper para preparar la inserción.

### 8.3 `ContactoMapper`

`ContactoMapper` encapsula las operaciones de persistencia:

- `fetchAll()`: obtiene todos los registros mediante `TableGateway`.
- `saveContacto()`: inserta un nuevo contacto o actualiza uno existente.
- `getContacto()`: busca un contacto por `id`.

Para un contacto nuevo, `saveContacto()` construye estos datos:

```php
$data = [
    'nombre'  => $contacto->getNombre(),
    'email'   => $contacto->getEmail(),
    'mensaje' => $contacto->getMensaje(),
    'fecha'   => date('Y-m-d H:i:s'),
];
```

Como el formulario crea un `Contacto` sin `id`, el mapper ejecuta una inserción.

## 9. Formulario de contacto

El formulario se define en `Application\\Form\\ContactForm` y extiende `Laminas\\Form\\Form`.

El método HTTP configurado es `POST`:

```php
$this->setAttribute('method', 'post');
```

### 9.1 Campos

| Campo | Elemento Laminas | Etiqueta | Atributos principales |
|---|---|---|---|
| `nombre` | `Element\\Text` | Nombre completo | `required`, clase Bootstrap y placeholder. |
| `email` | `Element\\Email` | Correo Electrónico | `required`, clase Bootstrap y placeholder. |
| `mensaje` | `Element\\Textarea` | Mensaje | `required`, cinco filas y placeholder. |
| `submit` | `Element\\Submit` | Enviar Mensaje | Botón de envío. |

Los atributos HTML `required` proporcionan una primera validación en el navegador. No sustituyen la validación del servidor.

## 10. Filtros y validaciones

`ContactForm` implementa `InputFilterProviderInterface`, por lo que define sus reglas en `getInputFilterSpecification()`.

Los filtros se ejecutan antes de validar:

- `StringTrim`: elimina espacios al principio y al final.
- `StripTags`: elimina etiquetas HTML del valor recibido.

### 10.1 Campo `nombre`

Reglas:

- Obligatorio.
- No puede estar vacío.
- Longitud mínima: 2 caracteres.
- Longitud máxima: 100 caracteres.

Mensajes configurados:

```text
El campo nombre no puede estar vacío.
El nombre debe tener al menos 2 caracteres.
El nombre no puede superar los 100 caracteres.
```

### 10.2 Campo `email`

Reglas:

- Obligatorio.
- No puede estar vacío.
- Debe cumplir el formato de correo electrónico validado por `EmailAddress`.

Mensaje de formato:

```text
El formato del correo electrónico no es válido.
```

### 10.3 Campo `mensaje`

Reglas:

- Obligatorio.
- No puede estar vacío.
- Longitud mínima: 10 caracteres.

Mensajes configurados:

```text
Por favor, escribe un mensaje.
El mensaje debe contener al menos 10 caracteres.
```

## 11. Flujo completo de una petición

### 11.1 Carga de la página

1. El navegador solicita `GET /`.
2. El router selecciona la ruta `home`.
3. Laminas crea `IndexController` mediante su factoría.
4. El controlador recibe `ContactoMapper`.
5. `indexAction()` crea un `ContactForm` vacío.
6. Se devuelve un `ViewModel` con la clave `form`.
7. `application/index/index.phtml` renderiza el formulario.
8. `layout/layout.phtml` inserta el contenido en la página HTML final.

### 11.2 Envío válido

1. El navegador envía `POST /`.
2. `IndexController` detecta que la petición es POST.
3. El formulario recibe los datos mediante `setData()`.
4. `isValid()` aplica filtros y validadores.
5. Si todo es correcto, se crea un objeto `Contacto`.
6. `exchangeArray()` copia los datos validados al modelo.
7. `ContactoMapper::saveContacto()` añade la fecha.
8. `TableGateway` inserta la fila en `mensajes_contacto`.
9. El controlador devuelve `saved => true`.
10. La vista muestra el mensaje de confirmación.

### 11.3 Envío inválido

1. El navegador envía `POST /`.
2. El formulario no supera `isValid()`.
3. El controlador devuelve la misma vista con el formulario y sus errores.
4. La plantilla muestra los errores junto a cada campo.
5. No se ejecuta ninguna inserción en la base de datos.

## 12. Responsabilidad de los archivos principales

### `public/index.php`

Es el punto de entrada. Cambia al directorio raíz, carga Composer, crea la aplicación Laminas y ejecuta el ciclo MVC.

### `config/autoload/global.php`

Contiene la conexión local a MySQL. En este proyecto es especialmente importante el puerto `9009`.

### `module/Application/config/module.config.php`

Centraliza rutas, factorías de controladores, configuración de vistas y factorías de persistencia.

### `IndexController.php`

Orquesta el formulario principal y el guardado del contacto.

### `ContactForm.php`

Define la estructura del formulario y las reglas de validación del servidor.

### `Contacto.php`

Representa los datos de un mensaje de contacto.

### `ContactoMapper.php`

Aísla el acceso a la tabla mediante `TableGateway`.

### `index.phtml`

Renderiza el formulario, muestra errores y muestra la confirmación posterior al guardado.

### `layout.phtml`

Define la estructura HTML común e imprime `$this->content`, que contiene la vista de la acción actual.

## 13. Comprobaciones útiles

### Comprobar el puerto MySQL

```powershell
Test-NetConnection localhost -Port 9009
```

El resultado esperado es `TcpTestSucceeded : True`.

### Comprobar la extensión `intl`

```powershell
C:\xampp\php\php.exe -m | Select-String '^intl$'
```

### Comprobar la conexión PDO

```powershell
C:\xampp\php\php.exe -r "`$pdo = new PDO('mysql:host=127.0.0.1;port=9009;dbname=fundae_reto5_db', 'root', ''); echo 'DB OK';"
```

### Consultar los mensajes guardados

```sql
SELECT id, nombre, email, mensaje, fecha
FROM mensajes_contacto
ORDER BY id DESC;
```

## 14. Observaciones y límites actuales

- El flujo principal usa `POST /` y no realiza una redirección POST/Redirect/GET. Al recargar una respuesta posterior a un POST, el navegador puede volver a enviar el formulario.
- No hay un token CSRF configurado en el formulario.
- La conexión utiliza el usuario `root` sin contraseña porque corresponde al entorno local actual de XAMPP. No es una configuración recomendable para producción.
- `ContactController` conserva un flujo alternativo en `/contacto` y `/contacto/procesar`, pero la página principal usa `IndexController`.
- La aplicación muestra excepciones en desarrollo mediante `display_exceptions`. En producción debe desactivarse.
- El servidor `php -S` es apropiado para desarrollo, no para producción.
