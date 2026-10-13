package com.reto4.fullstack.event;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.mongodb.core.query.TextCriteria;

import com.reto4.fullstack.event.EventDtos.EventRequest;

@Service
public class EventService {
    private final EventRepository events;
    public EventService(EventRepository events) { this.events = events; }

    public List<Event> findAll(String search) {
        if (search == null || search.isBlank()) return events.findAll();
        String value = search.trim();
        return events.findAllBy(TextCriteria.forDefaultLanguage().matching(value));
    }

    public Event create(EventRequest request, Authentication authentication) {
        validateCapacity(request);
        Event event = new Event(); copy(request, event); event.setOwnerEmail(authentication.getName()); event.setCreatedAt(Instant.now());
        return events.save(event);
    }

    public Event update(String id, EventRequest request, Authentication authentication) {
        validateCapacity(request);
        Event event = get(id); checkPermission(event, authentication); copy(request, event);
        return events.save(event);
    }

    public void delete(String id, Authentication authentication) { Event event = get(id); checkPermission(event, authentication); events.delete(event); }
    public Event get(String id) { return events.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado")); }

    private void checkPermission(Event event, Authentication authentication) {
        boolean admin = authentication.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (!admin && !event.getOwnerEmail().equalsIgnoreCase(authentication.getName())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes modificar este evento");
    }
    private void validateCapacity(EventRequest request) { if (request.registered() > request.capacity()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las inscripciones superan la capacidad"); }
    private void copy(EventRequest request, Event event) { event.setTitle(request.title().trim()); event.setCategory(request.category().trim()); event.setDate(request.date()); event.setTime(request.time()); event.setLocation(request.location().trim()); event.setInstructor(request.instructor().trim()); event.setCapacity(request.capacity()); event.setRegistered(request.registered()); event.setStatus(request.status().trim()); }
}