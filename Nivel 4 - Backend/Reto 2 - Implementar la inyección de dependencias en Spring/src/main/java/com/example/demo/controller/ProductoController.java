package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService service;

    // Inyección de dependencias por Constructor (Inyectamos la Interfaz)
    public ProductoController(ProductoService service) {
        this.service = service;
    }

    // Crear un producto enviando un JSON
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return service.guardar(producto);
    }

    // Leer todos los productos
    @GetMapping
    public List<Producto> listarTodos() {
        return service.obtenerTodos();
    }

    // Leer un producto por su ID
    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Long id) {
        // Si no lo encuentra, devuelve nulo
        return service.obtenerPorId(id).orElse(null);
    }

    // Actualizar un producto existente
    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto datosNuevos) {
        datosNuevos.setId(id); // Aseguramos que se actualice el producto correcto
        return service.guardar(datosNuevos);
    }

    // Borrar un producto
    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        service.eliminar(id);
    }
}