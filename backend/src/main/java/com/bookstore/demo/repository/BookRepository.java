package com.bookstore.demo.repository;
import com.bookstore.demo.model.Book;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // Ricerca per titolo o autore (case-insensitive)
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(concat('%', :query, '%')) OR " +
           "LOWER(b.authors) LIKE LOWER(concat('%', :query, '%')) OR " +
           "LOWER(b.isbn13) LIKE LOWER(concat('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);

}