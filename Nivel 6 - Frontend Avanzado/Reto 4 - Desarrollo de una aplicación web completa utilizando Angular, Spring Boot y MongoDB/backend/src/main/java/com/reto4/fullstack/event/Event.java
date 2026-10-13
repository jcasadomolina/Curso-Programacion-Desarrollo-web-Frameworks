package com.reto4.fullstack.event;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "events")
@CompoundIndex(name = "event_status_date_idx", def = "{'status': 1, 'date': 1}")
@CompoundIndex(name = "event_owner_date_idx", def = "{'ownerEmail': 1, 'date': 1}")
public class Event {
    @Id
    private String id;
    @TextIndexed(weight = 4)
    private String title;
    @TextIndexed(weight = 2)
    private String category;
    private String date;
    private String time;
    private String location;
    @TextIndexed(weight = 2)
    private String instructor;
    private int capacity;
    private int registered;
    private String status;
    private String ownerEmail;
    private Instant createdAt;

    public Event() { }
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getDate() { return date; }
    public String getTime() { return time; }
    public String getLocation() { return location; }
    public String getInstructor() { return instructor; }
    public int getCapacity() { return capacity; }
    public int getRegistered() { return registered; }
    public String getStatus() { return status; }
    public String getOwnerEmail() { return ownerEmail; }
    public Instant getCreatedAt() { return createdAt; }
    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCategory(String category) { this.category = category; }
    public void setDate(String date) { this.date = date; }
    public void setTime(String time) { this.time = time; }
    public void setLocation(String location) { this.location = location; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public void setRegistered(int registered) { this.registered = registered; }
    public void setStatus(String status) { this.status = status; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}