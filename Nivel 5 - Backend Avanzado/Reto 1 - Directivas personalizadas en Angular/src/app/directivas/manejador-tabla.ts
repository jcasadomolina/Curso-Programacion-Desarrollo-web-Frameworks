import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appManejadorTabla]',
  standalone: true
})
export class ManejadorTabla implements OnChanges {

  @Input() appManejadorTabla: any[] = [];
  @Input() filtros: any = {};
  @Input() ordenConfig: {
    columna: string, 
    direccion: 'asc' | 'desc'} = {
      columna: '', 
      direccion: 'asc'};
  @Output() datosProcesados = new EventEmitter<any[]>();

  ngOnChanges(changes: SimpleChanges) {
    // Lógica para manejar los cambios en la tabla
    if (changes['appManejadorTabla'] || changes['filtros'] || changes['ordenConfig']) {
      this.actualizarDatos();
    }
  }

  /**
   * Función para actualizar los datos mostrados en la tabla según los filtros y el ordenamiento aplicados.
   * @returns resultado
   */
  private actualizarDatos() {
    if (!this.appManejadorTabla) return;

    let resultado = [...this.appManejadorTabla];

    // Lógica de filtrado
    if (this.filtros) {
      resultado = resultado.filter(item => {
        let coincide = true;

        // Filtro por categoria
        if (this.filtros.categoria && item.categoria !== this.filtros.categoria) coincide = false;

        // Filtro por precio mínimo
        if (this.filtros.precioMin && item.precio < this.filtros.precioMin) coincide = false;

        // Filtro por rango de fechas
        const fechaItem = new Date(item.fecha).getTime();
        if (this.filtros.fechaInicio && fechaItem < new Date(this.filtros.fechaInicio).getTime()) coincide = false;

        // Filtro por fecha fin
        if (this.filtros.fechaFin && fechaItem > new Date(this.filtros.fechaFin).getTime()) coincide = false;

        return coincide;
      })

    }

    // Lógica de ordenamiento
    if (this.ordenConfig.columna && this.ordenConfig.direccion) {
      resultado.sort((a, b) => {
        const valorA = a[this.ordenConfig.columna];
        const valorB = b[this.ordenConfig.columna];

        if (valorA < valorB) return this.ordenConfig.direccion === 'asc' ? -1 : 1;
        else if (valorA > valorB) return this.ordenConfig.direccion === 'asc' ? 1 : -1;
        else return 0;
      });
    }

    this.datosProcesados.emit(resultado);
  }

}