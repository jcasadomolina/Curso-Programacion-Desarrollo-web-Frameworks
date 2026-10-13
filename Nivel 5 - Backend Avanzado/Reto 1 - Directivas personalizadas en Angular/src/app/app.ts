import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ManejadorTabla } from './directivas/manejador-tabla';
import {Inventario} from './servicios/inventario';

@Component({
  imports: [CommonModule, FormsModule, ManejadorTabla],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  datosOriginales: any[] = []; 
  datosMostrados: any[] = [];
  categoriasDisponibles: string[] = [];

  constructor(private inventario: Inventario) {}

  ngOnInit() {
    this.cargarDatosDeLaBaseDeDatos();
  }

  cargarDatosDeLaBaseDeDatos() {
    this.inventario.obtenerDatos().subscribe({
      next: (datosDesdeLaApi) => {
        this.datosOriginales = [...datosDesdeLaApi];
        const categoriasSet = new Set(this.datosOriginales.map(item => item.categoria));
        this.categoriasDisponibles = Array.from(categoriasSet).sort();
      },
      error: (error) => {
        console.error('Hubo un error conectando a la base de datos', error);
      }
    });
  }

  // Estado de los filtros
  filtrosActuales = {
    categoria: '',
    precioMin: '',
    fechaInicio: '',
    fechaFin: ''
  };

  // Estado del ordenamiento
  ordenActual: { columna: string, direccion: 'asc' | 'desc'} = {
      columna: '', 
      direccion: 'asc'};

  /**
   * Función para actualizar los datos mostrados en la tabla según los filtros y el ordenamiento aplicados.
   * @param datosFiltrados 
   */    
  actualizarVista(datosFiltrados: any[]) {
    this.datosMostrados = datosFiltrados;
  }

  /**
   * Función para actualizar los filtros actuales. Se utiliza para forzar la detección de cambios en Angular cuando se modifican los filtros.
   */
  actualizarFiltros() {
  this.filtrosActuales = { ...this.filtrosActuales };
}

  /**
   * Función para cambiar el ordenamiento de la tabla según la columna seleccionada. Si la columna ya está ordenada, se invierte la dirección del ordenamiento.
   * @param columna 
   */
  cambiarOrden(columna: string) {
    if (this.ordenActual.columna === columna) {
      this.ordenActual.direccion = this.ordenActual.direccion === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = { columna, direccion: 'asc' };
    }
    this.ordenActual = { ...this.ordenActual }; 
  }
}
