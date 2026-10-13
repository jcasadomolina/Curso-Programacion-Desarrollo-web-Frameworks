package com.reto3.microservicio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.reto3.microservicio.model.Customer;

import com.reto3.microservicio.service.CustomerService;

@RestController 
@RequestMapping ("/api/customers")
public class CustomerController {
    @Autowired 
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Crear un nuevo cliente
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.saveCustomer(customer);
    }

    // Obtener todos los clientes
    @GetMapping 
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // Obtener un cliente por su ID
    @GetMapping ("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id).orElse(null);
    }

    // Actualizar un cliente existente
    @PutMapping ("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        customer.setId(id);
        return customerService.saveCustomer(customer);
    }

    // Eliminar un cliente por su ID
    @DeleteMapping ("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }
}
