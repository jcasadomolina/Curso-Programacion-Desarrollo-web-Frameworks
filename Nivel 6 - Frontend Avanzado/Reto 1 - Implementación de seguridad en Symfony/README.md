# DOCUMENTACION_RETO1

## Objetivo del reto

El objetivo de este reto ha sido comprender y reconstruir progresivamente la seguridad de una aplicación [[Symfony]].

Se han trabajado estos conceptos:

- [[Autenticacion]]: comprobar quién es el usuario.
- [[Autorizacion]]: comprobar qué puede hacer ese usuario.
- [[Hash de contrasenas]]: guardar contraseñas de forma no reversible.
- [[Roles]]: agrupar permisos, como `ROLE_USER` y `ROLE_ADMIN`.
- [[Firewall]]: interceptar las peticiones relacionadas con la seguridad.
- [[CSRF]]: impedir que otra página falsifique formularios enviados por un usuario autenticado.
- [[Voter]]: tomar decisiones de autorización sobre una entidad concreta.
- [[Sanitizacion HTML]]: limpiar contenido generado por usuarios antes de mostrarlo.

La finalidad no era aplicar una solución compleja, sino entender qué responsabilidad tiene cada pieza y cómo se relacionan entre sí.

## Cómo era la aplicación base sin seguridad

Antes de reconstruir la seguridad se retiraron intencionadamente las protecciones para disponer de una base de aprendizaje.

La aplicación base tenía estas características:

- El [[Firewall]] principal tenía `security: false`.
- No había [[Proveedor de usuarios]] configurado.
- Las contraseñas se guardaban temporalmente sin hash.
- La entidad `User` no tenía roles efectivos.
- `/admin` y `/profile` podían quedar accesibles sin comprobar permisos.
- No existía el [[PostVoter]].
- Los formularios no tenían protección [[CSRF]] activa.
- El formulario manual de borrado no validaba ningún token.
- El contenido Markdown se convertía directamente a HTML sin `sanitize_html`.
- No existía una pantalla funcional de login ni una ruta de logout.

Este estado era inseguro intencionadamente. Sólo servía como punto de partida para observar qué cambia al añadir cada protección.

## Resultado final

La aplicación actual vuelve a tener una estructura básica de seguridad:

1. `User` implementa `UserInterface` y `PasswordAuthenticatedUserInterface`.
2. Los usuarios tienen `ROLE_USER` o `ROLE_ADMIN`.
3. Las contraseñas nuevas se procesan con el [[Password Hasher]] de Symfony.
4. Doctrine busca usuarios mediante el proveedor `database_users`.
5. El [[Firewall]] `main` gestiona el login.
6. El logout utiliza `POST` y [[CSRF]].
7. `/admin` requiere `ROLE_ADMIN`.
8. `/profile` requiere `ROLE_USER`.
9. `PostVoter` comprueba la autoría de cada publicación.
10. Los formularios y el borrado manual tienen protección CSRF.
11. Posts y comentarios pasan por `sanitize_html` después de convertirse desde Markdown.
12. Hay pruebas funcionales y unitarias para los principales flujos.

## Paso 1: restaurar `UserInterface` y los roles

Archivo principal: `src/Entity/User.php`.

La entidad `User` debe implementar las interfaces que espera el componente [[Security]]:

```php
class User implements UserInterface, PasswordAuthenticatedUserInterface
```

También se añadieron constantes para evitar escribir nombres de roles como cadenas repetidas:

```php
public const ROLE_USER = 'ROLE_USER';
public const ROLE_ADMIN = 'ROLE_ADMIN';
```

Los roles se guardan en una columna JSON de Doctrine:

```php
#[ORM\Column(type: Types::JSON)]
private array $roles = [];
```

`getRoles()` devuelve los roles guardados. Si no hay ninguno, devuelve `ROLE_USER` por defecto:

```php
public function getRoles(): array
{
    $roles = $this->roles;

    if ([] === $roles) {
        $roles[] = self::ROLE_USER;
    }

    return array_unique($roles);
}
```

La razón de tener un rol por defecto es evitar que un usuario autenticado se quede sin una clasificación mínima dentro del sistema de autorización.

Las fixtures crean usuarios con roles distintos:

```php
['Jane Doe', 'jane_admin', 'kitten', 'jane_admin@symfony.com', [User::ROLE_ADMIN]],
['John Doe', 'john_user', 'kitten', 'john_user@symfony.com', [User::ROLE_USER]],
```

## Paso 2: restaurar el hash de contraseñas

Archivo: `config/packages/security.yaml`.

La configuración utilizada es:

```yaml
security:
    password_hashers:
        Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: 'auto'
```

Este bloque indica a Symfony qué [[Hasher]] debe utilizar para las entidades que implementen `PasswordAuthenticatedUserInterface`.

`auto` permite que Symfony seleccione un algoritmo seguro disponible, como [[Argon2]] o [[Bcrypt]], según el entorno.

Al crear un usuario no se guarda la contraseña original:

```php
$user->setPassword(
    $this->passwordHasher->hashPassword($user, $plainPassword)
);
```

El servicio utilizado es `UserPasswordHasherInterface`. Se aplica tanto en:

- `src/DataFixtures/AppFixtures.php`.
- `src/Command/AddUserCommand.php`.

La contraseña original sólo existe temporalmente durante la ejecución. En la base de datos se guarda el [[Hash]], que no está diseñado para recuperarse como texto original.

## Paso 3: configurar el proveedor Doctrine

En `security.yaml` se añadió:

```yaml
providers:
    database_users:
        entity:
            class: App\Entity\User
            property: username
```

Un [[Proveedor de usuarios]] indica a Symfony dónde buscar la entidad que representa al usuario.

En este caso:

- `class` indica que la entidad es `App\Entity\User`.
- `property` indica que el identificador de login será `username`.

El flujo es:

1. El usuario introduce `jane_admin`.
2. El proveedor ejecuta una búsqueda Doctrine sobre `User.username`.
3. Symfony obtiene la entidad `User`.
4. Después puede comparar su contraseña y leer sus roles.

El proveedor no autentica por sí solo. Sólo localiza al usuario. La autenticación la coordina después el [[Firewall]].

## Paso 4: crear el firewall y el login

En `security.yaml` se configuró el firewall principal:

```yaml
firewalls:
    main:
        lazy: true
        provider: database_users
        form_login:
            login_path: security_login
            check_path: security_login
            enable_csrf: true
            default_target_path: blog_index
```

El [[Firewall]] examina las peticiones antes de que lleguen normalmente al controlador.

El login utiliza estos elementos:

- `login_path`: ruta que muestra el formulario.
- `check_path`: ruta a la que se envían las credenciales.
- `provider`: fuente de datos para buscar el usuario.
- `enable_csrf`: activa la protección del formulario de login.
- `default_target_path`: destino después de autenticarse correctamente.

El controlador está en `src/Controller/SecurityController.php` y muestra el formulario en `templates/security/login.html.twig`.

El controlador no compara contraseñas manualmente. El [[Autenticador de formulario]] del firewall recibe `_username` y `_password`, busca el usuario y utiliza el hasher configurado.

El formulario incluye:

```twig
<input name="_username" type="text">
<input name="_password" type="password">
<input type="hidden" name="_csrf_token" value="{{ csrf_token('authenticate') }}">
```

La ruta de login es localizada, por ejemplo:

```text
/en/login
/es/login
```

## Paso 5: añadir logout con CSRF

En el mismo firewall se añadió:

```yaml
logout:
    target: homepage
    enable_csrf: true
```

La ruta automática se registra desde `config/routes/security.yaml`:

```yaml
_security_logout:
    resource: security.route_loader.logout
    type: service
```

El menú utiliza un formulario `POST`:

```twig
<form action="{{ logout_path() }}" method="post">
    <button type="submit">
        {{ 'menu.logout'|trans }}
    </button>
</form>
```

El logout invalida la sesión y elimina la autenticación. Se utiliza `POST` porque cerrar una sesión es una acción que modifica el estado; no debe depender de visitar un enlace `GET`.

## Paso 6: proteger `/profile` y `/admin`

Las reglas se encuentran en `config/packages/security.yaml`:

```yaml
access_control:
    - { path: '^/[^/]+/admin', roles: ROLE_ADMIN }
    - { path: '^/[^/]+/profile', roles: ROLE_USER }
```

`access_control` permite proteger rutas completas mediante un patrón de URL.

El patrón `^/[^/]+/admin` contempla el primer segmento de locale:

```text
/en/admin
/es/admin
/fr/admin
```

El comportamiento es:

- Un usuario anónimo intenta acceder a `/en/admin` y es enviado al login.
- Un usuario con `ROLE_USER` intenta acceder a `/en/admin` y recibe `403 Forbidden`.
- Un usuario con `ROLE_ADMIN` puede pasar la primera barrera.
- `/profile` requiere como mínimo `ROLE_USER`.

La interfaz visual puede ocultar enlaces, pero eso no es seguridad. La protección importante se ejecuta en el servidor mediante `access_control`.

## Paso 7: reintroducir CSRF en formularios

Archivo: `config/packages/csrf.yaml`.

La configuración global es:

```yaml
framework:
    form:
        csrf_protection:
            token_id: submit

    csrf_protection:
        stateless_token_ids:
            - submit
            - authenticate
            - logout
```

Los formularios creados con `createForm()` reciben automáticamente un token [[CSRF]]. Esto incluye formularios de:

- Posts.
- Comentarios.
- Perfil.
- Cambio de contraseña.
- Login, con el token `authenticate`.

El borrado de posts es un formulario HTML manual, no un formulario Symfony. Por eso necesita protección explícita:

```twig
<input type="hidden" name="token" value="{{ csrf_token('delete') }}">
```

Y el controlador comprueba el token antes de ejecutar `remove()`:

```php
if (!$this->isCsrfTokenValid('delete', $token)) {
    return $this->redirectToRoute('admin_post_index');
}
```

Un token inválido no debe llegar nunca a la operación de borrado.

## Paso 8: crear `PostVoter`

Archivo: `src/Security/PostVoter.php`.

Un [[Voter]] decide si un usuario puede realizar una acción sobre un objeto concreto. En este caso, el objeto es `Post`.

Los atributos definidos son:

```php
public const SHOW = 'show';
public const EDIT = 'edit';
public const DELETE = 'delete';
```

El voter sólo funciona cuando recibe un `Post` y uno de esos atributos:

```php
protected function supports(string $attribute, mixed $subject): bool
{
    return $subject instanceof Post
        && \in_array($attribute, [self::SHOW, self::EDIT, self::DELETE], true);
}
```

La regla de autorización compara el usuario autenticado con el autor:

```php
$user = $token->getUser();

if (!$user instanceof User) {
    return false;
}

return $user === $subject->getAuthor();
```

El controlador lo utiliza así:

```php
$this->denyAccessUnlessGranted(PostVoter::SHOW, $post);
```

Y mediante atributo:

```php
#[IsGranted(PostVoter::EDIT, subject: 'post')]
#[IsGranted(PostVoter::DELETE, subject: 'post')]
```

La aplicación aplica dos capas:

1. `access_control` comprueba que el usuario sea administrador para entrar en `/admin`.
2. `PostVoter` comprueba que ese usuario sea el autor de la publicación concreta.

La decisión actual es que un administrador que no sea autor no puede editar ni borrar esa publicación. Es una decisión de diseño que podría cambiarse si `ROLE_ADMIN` debe tener permisos globales.

## Paso 9: restaurar `sanitize_html`

La aplicación convierte el contenido Markdown a HTML. Como el contenido puede haber sido escrito por usuarios, no se debe mostrar directamente después de convertirlo.

La cadena utilizada es:

```twig
{{ post.content|markdown_to_html|sanitize_html }}
```

Se aplica a:

- Contenido de posts públicos.
- Comentarios.
- Vista administrativa del post.

El orden es importante:

1. `markdown_to_html` convierte Markdown a HTML.
2. `sanitize_html` elimina elementos o atributos peligrosos.
3. El navegador recibe HTML permitido.

La configuración del [[HTML Sanitizer]] está en `config/packages/html_sanitizer.yaml`:

```yaml
framework:
    html_sanitizer:
        sanitizers:
            default:
                allow_safe_elements: true
```

Esto ayuda a evitar ataques [[XSS]], en los que un atacante intenta introducir JavaScript dentro de contenido que después verán otros usuarios.

## Paso 10: pruebas automáticas

Se añadieron pruebas para comprobar que la seguridad se mantiene con el tiempo.

### Pruebas de autenticación

`tests/Controller/SecurityControllerTest.php` comprueba:

- La página de login es pública.
- El formulario contiene token CSRF.
- Las credenciales incorrectas no autentican.
- Las credenciales correctas redirigen al blog.
- Un logout con token CSRF inválido devuelve `403`.

### Pruebas del voter

`tests/Security/PostVoterTest.php` comprueba:

- El autor puede ver, editar y borrar su post.
- Otro usuario no puede editarlo.
- Un usuario anónimo no puede verlo.

### Pruebas del panel

`tests/Controller/Admin/BlogControllerTest.php` comprueba:

- Un usuario normal no entra en `/admin`.
- Un administrador puede entrar.
- Un usuario autorizado puede crear, editar y borrar.
- Un token CSRF inválido no borra una publicación.

La suite específica de seguridad obtuvo:

```text
18 tests
41 assertions
OK
```

La suite completa obtuvo:

```text
61 tests
108 assertions
4 skipped
2 errors
```

Los dos errores restantes pertenecen a pruebas existentes de perfil que buscan un botón con el texto `Save changes`, pero las plantillas actuales no ofrecen ese texto exactamente. No corresponden a un fallo de las protecciones de autenticación, autorización o CSRF.

## Relación entre los archivos YAML y la seguridad

Los archivos YAML no contienen toda la lógica de la aplicación, pero conectan los servicios de seguridad.

### `security.yaml`

Define:

- [[Password Hasher]].
- [[Proveedor de usuarios]].
- [[Firewall]].
- Login y logout.
- Reglas `access_control`.

### `csrf.yaml`

Define la protección general de formularios y los identificadores de token usados por login y logout.

### `html_sanitizer.yaml`

Define el [[Sanitizador HTML]] disponible para el filtro `sanitize_html` de Twig.

La idea importante es que YAML configura el comportamiento de Symfony, mientras que las entidades, controladores, voters y plantillas utilizan esa configuración.

## Credenciales de prueba

Para el entorno educativo se utilizan estas credenciales de fixtures:

```text
Usuario administrador: jane_admin
Contraseña: kitten

Usuario administrador alternativo: tom_admin
Contraseña: kitten

Usuario normal: john_user
Contraseña: kitten
```

Estas credenciales sólo son apropiadas para desarrollo y pruebas. Nunca deben mantenerse en una aplicación publicada.

## Conclusión

La aplicación pasó de una base sin protecciones funcionales a una implementación progresiva con [[Autenticacion]], [[Autorizacion]], [[Roles]], [[CSRF]], [[Hash de contraseñas]], [[Voters]] y [[Sanitizacion HTML]].

La estructura permite seguir ampliándola sin mezclar responsabilidades:

- El [[Firewall]] autentica.
- El proveedor encuentra usuarios.
- El [[Hasher]] protege contraseñas.
- `access_control` protege zonas completas.
- El [[Voter]] decide sobre objetos concretos.
- [[CSRF]] protege formularios que cambian datos.
- `sanitize_html` protege la salida HTML generada desde contenido de usuarios.
- Las pruebas automáticas comprueban que estas decisiones siguen funcionando.
