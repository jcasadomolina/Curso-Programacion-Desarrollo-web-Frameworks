package com.reto3.microservicio.service;

import java.util.List;
import java.util.Optional;

import com.reto3.microservicio.model.Customer;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Optional<Customer> getCustomerById(Long id);
    Customer saveCustomer(Customer customer);
    void deleteCustomer(Long id);
    
}
