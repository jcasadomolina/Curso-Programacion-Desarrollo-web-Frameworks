package com.reto3.microservicio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.reto3.microservicio.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
}
