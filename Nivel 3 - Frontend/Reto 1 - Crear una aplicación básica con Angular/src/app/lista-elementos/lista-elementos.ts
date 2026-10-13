import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-lista-elementos',
  styleUrl: './lista-elementos.css',
  templateUrl: './lista-elementos.html',
})
export class ListaElementos {
  public lista: string[] = [];

  ngOnInit(){
    console.log("Lista cargada");
  }

  // Añadir elementos a la lista
  addElement(element: string) {
    if (!this.lista) {
      this.lista = [];
    }
    this.lista.push(element);
  }
  
}


