package com.example.demo.service;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImplementacion implements ProductoService {

    private final ProductoRepository repository;

    public ProductoServiceImplementacion(ProductoRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Producto> obtenerTodos() {
        return repository.findAll(); 
    }

    @Override
    public Optional<Producto> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public Producto guardar(Producto producto) {
        return repository.save(producto);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}