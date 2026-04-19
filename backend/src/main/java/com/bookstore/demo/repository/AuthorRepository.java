package com.bookstore.demo.repository;

import com.bookstore.demo.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    /**
     * Ricerca un autore per nome e cognome.
     * Utile per i controlli di unicità prima del salvataggio.
     */
    Optional<Author> findByNomeAndCognome(String nome, String cognome);

    /**
     * Verifica se esiste già un autore con lo stesso nome e cognome.
     */
    boolean existsByNomeAndCognome(String nome, String cognome);
}