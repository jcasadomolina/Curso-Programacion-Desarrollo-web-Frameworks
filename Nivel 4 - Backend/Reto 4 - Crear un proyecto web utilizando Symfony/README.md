# Documentación del Proyecto Symfony (Reto 4)

Esta documentación detalla la estructura y el funcionamiento básico de la aplicación web desarrollada utilizando el framework [[Symfony]].

## 1. Estructura del Proyecto

Un proyecto estándar de [[Symfony]] implementa el patrón arquitectónico [[MVC]] (Modelo-Vista-Controlador) y se organiza en directorios clave:

* **`bin/`**: Contiene archivos ejecutables como la interfaz de línea de comandos [[Symfony Console]].
* **`config/`**: Almacena los archivos de configuración del framework, rutas globales y servicios (`routes.yaml`, `packages/`, etc.).
* **`public/`**: Es el directorio raíz web ([[Document Root]]). Contiene el controlador frontal `index.php` que gestiona todas las peticiones HTTP y los recursos estáticos.
* **`src/`**: Contiene el código fuente de la aplicación desarrollado en [[PHP]].
  * **`src/Controller/`**: Ubicación de los [[Controladores]] encargados de procesar la lógica de negocio y las peticiones.
* **`templates/`**: Almacena las plantillas HTML utilizando el motor de plantillas [[Twig]] (`home.html.twig`, `detail.html.twig`, etc.).
* **`var/`**: Directorio reservado para archivos generados automáticamente por el framework ([[Caché]] y registros de [[Log]]).
* **`vendor/`**: Directorio donde se almacenan las dependencias externas gestionadas por [[Composer]].

## 2. Creación y Configuración de Controladores

Los **Controladores** son clases de [[PHP]] ubicadas en `src/Controller/` que extienden de la clase base [[AbstractController]]. Su propósito es recibir una petición HTTP, procesarla y devolver una respuesta [[HTTP Response]].

### Ejemplo de Controlador (`src/Controller/HomeController.php`)

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home.html.twig');
    }

    #[Route('/detalles', name: 'app_details')]
    public function details(): Response
    {
        return $this->render('detail.html.twig');
    }
}
```

## 3. Configuración de Rutas

En las versiones modernas de [[Symfony]], el [[Sistema de Enrutamiento]] se configura mediante [[Atributos de PHP]] (`#[Route]`) situados justo encima de los métodos del controlador:

* `#[Route('/', name: 'app_home')]`: Vincula la ruta raíz del sitio (`/`) al método `index()`. El parámetro `name` define un identificador único para referenciar la ruta.
* `#[Route('/detalles', name: 'app_details')]`: Vincula la ruta `/detalles` al método `details()`.

## 4. Creación y Uso de Vistas

Las vistas separan la lógica de presentación utilizando el motor [[Twig]]. Son renderizadas desde los controladores mediante el método `$this->render()`.

### 1. Plantilla de Inicio (`templates/home.html.twig`)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Página de inicio</title>
</head>
<body>
    <h1>Bienvenido a la página de inicio</h1>
    <p>Esta es la vista renderizada con [[Twig]] para el home.</p>
    <a href="/detalles">Ir a detalles</a>
</body>
</html>
```

### 2. Plantilla de Detalles (`templates/detail.html.twig`)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Página de detalles</title>
</head>
<body>
    <h1>Página de detalles de la aplicación</h1>
    <p>Esta es la vista de detalles renderizada con [[Twig]].</p>
    <a href="/">Volver al inicio</a>
</body>
</html>
```

## 5. Instrucciones para Ejecutar Localmente

Sigue los pasos a continuación para poner en marcha la aplicación web en tu entorno de desarrollo local:

1. **Requisitos Previos**:
   * Tener instalado [[PHP]] (versión 8.2 o superior) asegurándote de habilitar la extensión `zip` en el archivo de configuración `php.ini`.
   * Tener instalado [[Composer]].

2. **Instalación de Dependencias**:
   Ejecuta el siguiente comando en la raíz del proyecto para descargar las librerías necesarias:
   ```bash
   composer install
   ```

3. **Ejecución del Servidor Local**:
   Inicia el servidor de desarrollo integrado de [[PHP]] apuntando al directorio público:
   ```bash
   php -S localhost:8000 -t public/
   ```

4. **Acceso a la Aplicación**:
   Abre tu navegador web e interactúa con las rutas configuradas:
   * **Página de inicio**: `http://localhost:8000/`