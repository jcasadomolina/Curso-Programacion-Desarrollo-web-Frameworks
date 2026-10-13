# Módulo Comments

Módulo independiente para Laminas MVC que permite listar y crear comentarios, y proporciona edición y eliminación protegidas para moderadores.

## Integración mínima

1. Copia la carpeta `module/Comments` al proyecto destino.
2. Añade el namespace al autoload PSR-4 de `composer.json`:

```json
{
    "autoload": {
        "psr-4": {
            "Comments\\": "module/Comments/src/"
        }
    }
}
```

3. Registra el módulo en `config/modules.config.php`:

```php
return [
    'Laminas\\Router',
    'Laminas\\Validator',
    'Comments',
];
```

4. Regenera el autoload:

```bash
composer dump-autoload
```

El módulo registra sus controladores, servicios, rutas y plantillas desde `Module::getConfig()`. No requiere paquetes Composer adicionales aparte de Laminas MVC y sus dependencias habituales.

## Configuración

La configuración puede sobrescribirse desde cualquier archivo de `config/autoload/`:

```php
return [
    'comments' => [
        'storage_path' => __DIR__ . '/../../data/comments.json',
        'moderator_password' => getenv('COMMENTS_MODERATOR_PASSWORD'),
    ],
];
```

`storage_path` debe apuntar a un archivo JSON escribible por el proceso PHP. Si no se sobrescribe, se utiliza `data/comments.json` en la estructura estándar del proyecto. En producción, define siempre `moderator_password` mediante una variable de entorno o un gestor de secretos y no uses el valor predeterminado `moderator`.

## Rutas

- `GET /comments`: listado público.
- `GET|POST /comments/create`: crear comentario.
- `GET /comments/login`: acceso de moderador.
- `POST /comments/logout`: cerrar sesión de moderador.
- `GET|POST /comments/edit/:id`: editar, solo moderadores.
- `POST /comments/delete/:id`: eliminar, solo moderadores.

La autorización se comprueba en el controlador, por lo que ocultar los botones de edición no es la única medida de protección.
