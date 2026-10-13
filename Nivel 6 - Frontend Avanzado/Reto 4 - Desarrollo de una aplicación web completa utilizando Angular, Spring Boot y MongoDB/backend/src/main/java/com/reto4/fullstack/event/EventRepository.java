package com.reto4.fullstack.event;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.TextCriteria;

public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findAllBy(TextCriteria criteria);
}