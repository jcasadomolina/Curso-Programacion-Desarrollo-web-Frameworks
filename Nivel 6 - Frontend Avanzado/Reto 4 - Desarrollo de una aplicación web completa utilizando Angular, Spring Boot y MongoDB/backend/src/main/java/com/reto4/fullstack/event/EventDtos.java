package com.reto4.fullstack.event;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public final class EventDtos {
    private EventDtos() { }
    public record EventRequest(@NotBlank String title, @NotBlank String category, @NotBlank String date, @NotBlank String time, @NotBlank String location, @NotBlank String instructor, @Min(1) int capacity, @Min(0) int registered, @NotBlank String status) { }
}