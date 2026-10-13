package com.reto4.hibernate.service;

import com.reto4.hibernate.model.Author;
import com.reto4.hibernate.model.Book;
import com.reto4.hibernate.repository.AuthorRepository;
import com.reto4.hibernate.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @Transactional
    public void loadDatabase() {
        for (int i = 1; i <= 500; i++) {
            Author author = new Author("Author Name " + i);
            authorRepository.save(author);

            Book book1 = new Book("Book Title A" + i, author);
            Book book2 = new Book("Book Title B" + i, author);
            
            bookRepository.save(book1);
            bookRepository.save(book2);
        }
    }

    @Transactional(readOnly = true)
    public List<String> processBooksAndAuthors() {
        List<Book> books = bookRepository.findAll();
        List<String> report = new ArrayList<>();
        
        for (Book book : books) {
            report.add(book.getTitle() + " written by " + book.getAuthor().getName());
        }
        
        return report;
    }
}
