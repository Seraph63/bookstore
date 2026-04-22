package com.bookstore.demo.repository;

import com.bookstore.demo.model.Book;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT b FROM Book b JOIN FETCH b.autore JOIN FETCH b.editore LEFT JOIN FETCH b.formato LEFT JOIN FETCH b.tag WHERE b.id = :id")
    Optional<Book> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT b FROM Book b JOIN FETCH b.autore JOIN FETCH b.editore")
    List<Book> findAllWithDetails();

    @Query(value = "SELECT b FROM Book b JOIN FETCH b.autore JOIN FETCH b.editore", countQuery = "SELECT COUNT(b) FROM Book b")
    Page<Book> findAllWithDetails(Pageable pageable);

    // Metodo per verificare esistenza ISBN duplicati
    boolean existsByIsbn10(String isbn10);

    boolean existsByIsbn13(String isbn13);

    // Metodo per trovare libro per ISBN13
    Optional<Book> findByIsbn13(String isbn13);

}