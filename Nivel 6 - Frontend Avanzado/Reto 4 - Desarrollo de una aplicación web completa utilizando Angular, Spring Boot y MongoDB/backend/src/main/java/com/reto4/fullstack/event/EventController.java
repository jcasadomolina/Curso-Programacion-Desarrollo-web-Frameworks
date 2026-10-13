package com.reto4.fullstack.event;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reto4.fullstack.event.EventDtos.EventRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    public EventController(EventService eventService) { this.eventService = eventService; }
    @GetMapping public List<Event> findAll(@RequestParam(required = false) String search) { return eventService.findAll(search); }
    @GetMapping("/{id}") public Event findById(@PathVariable String id) { return eventService.get(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Event create(@Valid @RequestBody EventRequest request, Authentication authentication) { return eventService.create(request, authentication); }
    @PutMapping("/{id}") public Event update(@PathVariable String id, @Valid @RequestBody EventRequest request, Authentication authentication) { return eventService.update(id, request, authentication); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable String id, Authentication authentication) { eventService.delete(id, authentication); }
}