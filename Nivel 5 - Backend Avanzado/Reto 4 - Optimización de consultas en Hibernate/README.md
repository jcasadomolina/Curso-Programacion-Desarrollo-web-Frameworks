# Informe de optimizacion de consultas [[Hibernate]]

## 1. Objetivo

El objetivo de este trabajo es analizar las consultas [[SQL]] generadas por [[Hibernate]] en la aplicacion base y aplicar cambios que reduzcan el numero de accesos a la [[base de datos]] y el tiempo de ejecucion.

La prueba utiliza:

- 500 autores.
- 2 libros por autor.
- 1500 entidades `Book` y `Author` insertadas en total.
- Una consulta de lectura que obtiene los libros y el nombre de su autor.
- [[H2]] en memoria.

Las metricas se obtuvieron mediante `hibernate.generate_statistics=true`. El detalle de las sentencias [[SQL]] y de sus parametros se conserva en `target/hibernate-performance.log`.

## 2. Problema detectado en la version base

La version original utilizaba:

```java
List<Book> books = bookRepository.findAll();
```

Ademas, la relacion entre `Book` y `Author` estaba configurada con `FetchType.EAGER`. Al recorrer los libros y acceder a `book.getAuthor().getName()`, [[Hibernate]] ejecutaba:

1. Una consulta para obtener los 500 libros.
2. 500 consultas adicionales para recuperar los autores.

Este comportamiento corresponde al patron **[[N+1]]**: una consulta inicial para la coleccion y una consulta adicional por cada elemento relacionado.

De forma simplificada, la consulta principal era:

```sql
SELECT b.id, b.title, b.author_id
FROM book b;
```

Y despues se repetia para cada autor:

```sql
SELECT a.id, a.name
FROM author a
WHERE a.id = ?;
```

## 3. Consultas optimizadas

### 3.1 [[JOIN FETCH]]

Se sustituyo el `findAll()` por una consulta [[JPQL]] que recupera libros y autores en una sola operacion:

```java
@Query("SELECT b FROM Book b JOIN FETCH b.author")
List<Book> findAllOptimized();
```

La consulta [[SQL]] equivalente obtiene los datos mediante un `[[INNER JOIN]]`:

```sql
SELECT b.id, b.title, a.id, a.name
FROM book b
JOIN author a ON a.id = b.author_id;
```

Con este cambio desaparecen las 500 consultas individuales de autores. El recorrido posterior de la coleccion no provoca nuevos accesos a la [[base de datos]] porque la asociacion ya fue cargada por el `[[JOIN FETCH]]`.

### 3.2 `FetchType.LAZY`

La relacion se cambio a [[carga diferida]]:

```java
@ManyToOne(fetch = FetchType.LAZY)
```

`LAZY` evita cargar autores cuando no son necesarios. En el caso de esta prueba, el `[[JOIN FETCH]]` decide explicitamente que los autores si deben cargarse para esta consulta concreta. Esta combinacion evita cargas automaticas en otras operaciones y permite escoger la estrategia apropiada por consulta.

### 3.3 [[Batch JDBC]] y ordenacion de escrituras

Se añadieron estas propiedades de [[Hibernate]]:

```yaml
hibernate:
  jdbc:
    batch_size: 50
    order_inserts: true
    order_updates: true
```

Su finalidad es agrupar operaciones compatibles y ordenar las inserciones o actualizaciones para mejorar el uso de [[JDBC]]. Estas opciones preparan el proceso de carga masiva, aunque la reduccion observada en esta prueba de inserciones con identificadores `IDENTITY` se explica principalmente por la eliminacion de las consultas [[N+1]] durante la lectura.

### 3.4 [[Indice de base de datos]] sobre la relacion

La entidad `Book` incorpora un indice sobre `author_id`:

```java
@Table(indexes = @Index(name = "idx_book_author", columnList = "author_id"))
```

El [[indice de base de datos]] beneficia consultas que filtran o relacionan libros por autor. En la consulta global de esta prueba no se puede atribuir una mejora independiente al indice, por lo que no se incluye como causa directa de la diferencia medida.

## 4. Comparativa de metricas

| Metrica | Version base | Version optimizada | Variacion | Mejora |
| --- | ---: | ---: | ---: | ---: |
| Entidades insertadas | 1500 | 1500 | 0 | Se mantiene |
| Entidades actualizadas | 0 | 0 | 0 | Se mantiene |
| Entidades eliminadas | 0 | 0 | 0 | Se mantiene |
| Entidades cargadas | 1500 | 1500 | 0 | Se mantiene |
| Entidades recuperadas | 500 | 0 | -500 | Se eliminan las recuperaciones adicionales |
| Consultas ejecutadas | 1 | 1 | 0 | Misma consulta logica |
| Sentencias preparadas | 2001 | 1501 | -500 | 24,99% menos |
| Transacciones | 2 | 2 | 0 | Se mantiene |
| Tiempo maximo de consulta | 233 ms | 36 ms | -197 ms | 84,55% menos |

### Calculos

- Sentencias preparadas reducidas: `2001 - 1501 = 500`.
- Reduccion relativa de sentencias: `500 / 2001 x 100 = 24,99%`.
- Tiempo reducido: `233 - 36 = 197 ms`.
- Reduccion relativa del tiempo: `197 / 233 x 100 = 84,55%`.
- El tiempo maximo optimizado representa aproximadamente el `15,45%` del tiempo original.

## 5. Impacto en el rendimiento

La optimizacion elimina el patron [[N+1]] y reduce el trabajo de [[Hibernate]] durante la fase de lectura:

- Se pasa de 501 consultas [[SQL]] de lectura potenciales a una consulta con `JOIN`.
- Se eliminan 500 recuperaciones individuales de autores.
- Se preparan 500 sentencias menos.
- El tiempo maximo registrado baja de 233 ms a 36 ms.
- La cantidad de datos funcionales recuperados se mantiene: siguen procesandose los 500 libros y sus autores.
- La carga de datos conserva las mismas 1500 inserciones, por lo que la comparacion mantiene el mismo volumen de trabajo.

La mejora medida en tiempo es especialmente significativa para este escenario. En una [[base de datos]] remota, donde cada ida y vuelta tiene un coste de red, eliminar 500 consultas adicionales tendria normalmente un impacto aun mayor.

## 6. Conclusion

La optimizacion mas importante es reemplazar `findAll()` junto con la carga automatica de autores por `findAllOptimized()` con `JOIN FETCH` y una relacion `LAZY` por defecto. Los resultados demuestran que la aplicacion mantiene el mismo resultado funcional, pero realiza 500 sentencias preparadas menos y reduce el tiempo maximo de consulta en 197 ms.

La configuracion de estadisticas y el archivo `target/hibernate-performance.log` permiten repetir la prueba y comparar futuras modificaciones. El informe [[Markdown]] generado por la aplicacion se encuentra en `target/hibernate-performance-optimized.md`.
