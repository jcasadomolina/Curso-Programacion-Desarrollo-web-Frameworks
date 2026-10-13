package com.reto4.hibernate.repository;
import com.reto4.hibernate.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // List<Book> findAll();

    @Query("SELECT b FROM Book b JOIN FETCH b.author") // Nueva consulta optimizada que trae el libro y el autor de una sola vez
    List<Book> findAllOptimized();
}
