package com.reto4.hibernate.model;
import jakarta.persistence.*;

@Entity
// Nuevo - Índice para optimizar las consultas por autor
@Table(indexes = @Index(name = "idx_book_author", columnList = "author_id")) 
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    // @ManyToOne(fetch = FetchType.EAGER)    
    @ManyToOne(fetch = FetchType.LAZY)    // Cambiamos EAGER por LAZY para evitar consultas automáticas
    @JoinColumn(name = "author_id")
    private Author author;

    public Book() {}

    public Book(String title, Author author) {
        this.title = title;
        this.author = author;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Author getAuthor() { return author; }
    public void setAuthor(Author author) { this.author = author; }
}
