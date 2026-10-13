## 1. Resumen del proceso de creación

El proceso de inicialización y creación de este proyecto web con **[[Laminas MVC]]** consta de los siguientes pasos fundamentales:

*   **Preparación del entorno:** Verificación de **[[XAMPP]]** y activación de las extensiones `intl` y `pdo_mysql` en **[[PHP]]**.
*   **Persistencia:** Creación de la base de datos `fundae_reto5_db` y la tabla `mensajes_contacto` en **[[MySQL]]** (a través de **[[phpMyAdmin]]**).
*   **Dependencias:** Instalación del núcleo y los módulos adicionales de Laminas (como `laminas-db` y `laminas-form`) utilizando **[[Composer]]**.
*   **Configuración:** Ajuste de las credenciales y el puerto de conexión a la base de datos en el archivo `config/autoload/global.php`.
*   **Ejecución:** Arranque del servidor de desarrollo integrado de **[[PHP]]** mediante el comando:
    ```bash
    php -S localhost:8080 -t public
    ```

---

## 2. Descripción general

Este proyecto es una aplicación **[[MVC]]** construida con **[[Laminas MVC]]**. Su funcionalidad principal es mostrar un formulario de contacto en la página raíz (`/`) y almacenar los mensajes validados en una base de datos **[[MySQL]]**.

El flujo actual está preparado para ejecutarse localmente con:
*   **[[PHP]]** de **[[XAMPP]]**.
*   **[[MySQL]]**/**[[MariaDB]]** de **[[XAMPP]]**.
*   **[[phpMyAdmin]]** para administrar la base de datos.
*   El servidor web incorporado de **[[PHP]]**:

```bash
php -S localhost:8080 -t public
```

---

## 3. Estructura del proyecto

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
| `public/` | Punto de entrada **[[HTTP]]** de la aplicación. |
| `config/` | Configuración general, módulos y conexión a la base de datos. |
| `module/Application/config/` | Rutas, factorías, servicios y vistas del módulo. |
| `Controller/` | Recibe la petición y coordina el flujo de aplicación. |
| `Form/` | Define campos, filtros y validaciones. |
| `Model/` | Representa los datos y encapsula el acceso mediante [[TableGateway]]. |
| `view/` | Plantillas **[[HTML]]**/**[[PHTML]]** que se muestran al usuario. |

---

## 4. Configuración de ejecución local

### 4.1 Requisitos
1.  **[[XAMPP]]** con **[[PHP]]**.
2.  **[[MySQL]]** iniciado.
3.  Extensión **[[PHP]]** `intl` activada (necesaria para [[Laminas I18n]] y la clase [[Locale]]).
4.  Extensión **[[PHP]]** `pdo_mysql` activada.
5.  **[[Composer]]** instalado.
6.  Base de datos `fundae_reto5_db` creada.
7.  Tabla `mensajes_contacto` creada.

### 4.2 Conexión a [[MySQL]]
Definida en `config/autoload/global.php`:

```php
'db' => [
    'driver'   => 'Pdo_Mysql',
    'hostname' => 'localhost',
    'port'     => 9009, // Puerto configurado en XAMPP
    'database' => 'fundae_reto5_db',
    'username' => 'root',
    'password' => '',
    'charset'  => 'utf8mb4',
],
```

---

## 5. Dependencias principales (`composer.json`)

| Dependencia | Uso |
|---|---|
| `laminas/laminas-mvc` | Núcleo **[[MVC]]**, enrutamiento y controladores. |
| `laminas/laminas-db` | Adaptador **[[PDO]]**, [[TableGateway]] y acceso a **[[MySQL]]**. |
| `laminas/laminas-form` | Clase [[Form]], elementos y helpers de formularios. |
| `laminas/laminas-i18n` | Traducción y soporte internacional. |
| `laminas/laminas-development-mode` | Utilidades de desarrollo. |

---

## 6. Configuración de [[Laminas]]

`config/application.config.php` carga módulos y configuraciones. La caché de configuración está activada:

```php
'config_cache_enabled' => true,
'module_map_cache_enabled' => true,
'cache_dir' => 'data/cache/',
```
*Nota: Tras cambiar configuraciones, ejecutar `php bin/clear-config-cache.php` y reiniciar el servidor.*

---

## 7. Rutas (`module/Application/config/module.config.php`)

| Nombre | Método | URL | Controlador | Acción |
|---|---|---|---|---|
| `home` | **[[GET]]**/**[[POST]]** | `/` | `IndexController` | `indexAction()` |
| `contacto` | **[[GET]]** | `/contacto` | `ContactController` | `indexAction()` |
| `contacto-procesar` | **[[POST]]** | `/contacto/procesar` | `ContactController` | `processAction()` |

---

## 8. Servicios y Factorías

Se utiliza **[[Inyección de dependencias]]** para gestionar los componentes:

### 8.1 [[TableGateway]]
La factoría obtiene la configuración `db`, crea un adaptador y construye un [[TableGateway]] que conecta la tabla `mensajes_contacto` con objetos `Contacto`.

### 8.2 [[ContactoMapper]]
La factoría de `ContactoMapper` solicita `ContactoTableGateway` al ServiceManager y lo inyecta en el mapper.

### 8.3 Controlador
`IndexController` recibe `ContactoMapper` por **[[Inyección de dependencias]]**, evitando que el controlador gestione la conexión o ejecute **[[SQL]]** directamente.

---

## 9. Modelo de datos

### 9.1 Estructura SQL
```sql
CREATE TABLE mensajes_contacto (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 9.2 Clase `Contacto` (`Application\Model\Contacto`)
Representa una fila de la tabla. Utiliza `exchangeArray()` para hidratar el objeto desde un array y `getArrayCopy()` para exportarlo.

---

## 10. Formulario de contacto (`Application\Form\ContactForm`)

Extiende de `Laminas\Form\Form`. Utiliza el método **[[POST]]**:

| Campo | Elemento | Atributos |
|---|---|---|
| `nombre` | `Element\Text` | `required`, clase **[[Bootstrap]]** |
| `email` | `Element\Email` | `required`, clase **[[Bootstrap]]** |
| `mensaje` | `Element\Textarea` | `required`, 5 filas |
| `submit` | `Element\Submit` | Botón de envío |

---

## 11. Filtros y validaciones (`InputFilter`)

Se implementa `InputFilterProviderInterface`.

*   **Filtros aplicados:** `StringTrim` (elimina espacios) y `StripTags` (elimina **[[HTML]]**).
*   **Validaciones:**
    *   `nombre`: Obligatorio, longitud 2-100.
    *   `email`: Obligatorio, formato válido (`EmailAddress`).
    *   `mensaje`: Obligatorio, longitud mínima 10.

---

## 12. Flujo de una petición (Ejemplo: Envío válido)

1.  Navegador envía **[[POST]]** `/`.
2.  `IndexController` detecta la petición.
3.  Formulario recibe datos (`setData()`).
4.  `isValid()` aplica filtros y validadores.
5.  Si es correcto, se crea objeto `Contacto`.
6.  `ContactoMapper::saveContacto()` añade fecha e inserta en **[[MySQL]]** mediante [[TableGateway]].
7.  Controlador devuelve `saved => true`.
8.  La vista muestra confirmación.

---

## 13. Comprobaciones útiles (Terminal)

*   **Puerto [[MySQL]]:**
    ```powershell
    Test-NetConnection localhost -Port 9009
    ```
*   **Extensión `intl`:**
    ```powershell
    C:\xampp\php\php.exe -m | Select-String '^intl$'
    ```
*   **Conexión [[PDO]]:**
    ```powershell
    C:\xampp\php\php.exe -r "$pdo = new PDO('mysql:host=127.0.0.1;port=9009;dbname=fundae_reto5_db', 'root', ''); echo 'DB OK';"
    ```

---

## 14. Observaciones y límites actuales

*   No se realiza redirección **[[POST]]**/**[[Redirect]]**/**[[GET]]** (puede provocar re-envíos al recargar).
*   No hay token **[[CSRF]]** configurado.
*   Conexión `root` sin contraseña (solo entorno local).
*   El servidor `php -S` es exclusivo para desarrollo.