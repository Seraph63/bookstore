package com.bookstore.demo.repository;

import com.bookstore.demo.model.Book;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Ricerca per titolo o autore (navigando attraverso il campo autore_id)
    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.titolo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.autore.nome) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.autore.cognome) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);

    @Query("SELECT b FROM Book b JOIN FETCH b.autore JOIN FETCH b.editore")
    List<Book> findAllWithDetails();

}