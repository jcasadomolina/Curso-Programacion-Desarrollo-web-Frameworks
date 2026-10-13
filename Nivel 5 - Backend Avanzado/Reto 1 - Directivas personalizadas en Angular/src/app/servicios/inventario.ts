import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Inventario {
  private apiUrl = 'https://api.escuelajs.co/api/v1/products'; // API pública de Platzi

  constructor(private http: HttpClient) {}

  obtenerDatos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(productosApi => {
        return productosApi.map(prod => ({
          id: prod.id,
          nombre: prod.title,
          categoria: prod.category.name,
          precio: prod.price,
          fecha: prod.creationAt.split('T')[0] 
        }));
      })
    );
  }
}