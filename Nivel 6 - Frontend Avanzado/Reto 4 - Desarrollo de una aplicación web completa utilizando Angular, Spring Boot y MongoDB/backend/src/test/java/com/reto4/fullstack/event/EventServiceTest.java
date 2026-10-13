package com.reto4.fullstack.event;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import com.reto4.fullstack.event.EventDtos.EventRequest;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {
    @Mock private EventRepository eventRepository;
    private EventService eventService;
    private Authentication owner;
    private EventRequest request;

    @BeforeEach
    void setUp() {
        eventService = new EventService(eventRepository);
        owner = new UsernamePasswordAuthenticationToken("owner@example.com", null);
        request = new EventRequest("Open Mat", "Entrenamiento", "2026-10-20", "18:00", "Tatami", "Maya", 20, 3, "Publicado");
    }

    @Test
    void createsEventWithAuthenticatedOwner() {
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));
        Event result = eventService.create(request, owner);
        assertEquals("owner@example.com", result.getOwnerEmail());
        assertEquals("Open Mat", result.getTitle());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void rejectsRegistrationsAboveCapacity() {
        EventRequest invalid = new EventRequest("Full", "Taller", "2026-10-20", "18:00", "Sala", "Maya", 2, 3, "Publicado");
        assertThrows(ResponseStatusException.class, () -> eventService.create(invalid, owner));
    }

    @Test
    void preventsUserFromChangingAnotherUsersEvent() {
        Event event = new Event(); event.setId("event-1"); event.setOwnerEmail("other@example.com");
        when(eventRepository.findById("event-1")).thenReturn(Optional.of(event));
        assertThrows(ResponseStatusException.class, () -> eventService.update("event-1", request, owner));
    }
}