# Documentación del Proyecto: Reto 1 - [[Directiva]] [[Angular]]

Este proyecto implementa una [[directiva personalizada]] en [[Angular]], diseñada para facilitar el [[filtrado]] y [[ordenamiento dinámico]] de [[colecciones de datos]] dentro de [[tablas]].

## [[Directiva]]: [[ManejadorTabla]]

La [[directiva]] [[appManejadorTabla]] está diseñada para procesar [[arrays]] de [[datos complejos]] (como una lista de productos o registros) aplicando [[filtros]] y [[ordenamientos]] de manera [[reactiva]].

### [[Características]]
- **[[Filtrado]]:** Soporta [[filtrado]] por múltiples [[criterios]] simultáneamente ([[categoría]], [[precio mínimo]] y [[rango de fechas]]).
- **[[Ordenamiento]]:** Permite ordenar la lista basándose en una [[columna]] específica en orden [[ascendente]] o [[descendente]].
- **[[Reactividad]]:** Utiliza [[OnChanges]] para actualizar los resultados automáticamente cuando cambian los [[datos de entrada]], los [[filtros]] o la [[configuración de ordenamiento]].
- **[[Comunicación]]:** Emite los [[datos procesados]] a través del [[evento]] [[@Output() datosProcesados]].

### [[Funcionamiento]]
La [[directiva]] actúa como un [[procesador de datos]] intermedio. Recibe los datos originales y las [[reglas de negocio]] ([[filtros]] y [[orden]]) a través de [[@Input()]], ejecuta la [[lógica de procesamiento]] interna en [[actualizarDatos()]] y emite el nuevo [[array]] resultante para que el [[componente padre]] pueda actualizar la [[vista]].

### [[Implementación]]

Para utilizar esta [[directiva]] en tus propios proyectos, sigue estos pasos:

1. **[[Importación]]:** Asegúrate de importar la [[directiva]] en tu [[componente]] o [[módulo]] (es una [[directiva standalone]]).
2. **Aplicación en el [[Template]]:**
   ```html
   <div [appManejadorTabla]="listaDatos" 
        [filtros]="misFiltros" 
        [ordenConfig]="miOrden" 
        (datosProcesados)="actualizarTabla($event)">
   </div>
   ```

3. **Configuración de [[Inputs]]:**
   - [[appManejadorTabla]]: El [[array]] de objetos a procesar.
   - [[filtros]]: [[Objeto]] con las propiedades: `categoria`, `precioMin`, `fechaInicio`, `fechaFin`.
   - [[ordenConfig]]: [[Objeto]] con `{ columna: string, direccion: 'asc' | 'desc' }`.

4. **Captura de [[resultados]]:**
   Utiliza el [[evento]] [[(datosProcesados)]] para recibir el [[array filtrado y ordenado]] y asignarlo a la variable que [[renderiza]] tu [[tabla]]:
   ```typescript
   datosFiltrados: any[] = [];
   
   actualizarTabla(nuevosDatos: any[]) {
     this.datosFiltrados = nuevosDatos;
   }
   ```
