package com.bookstore.demo.repository;

import com.bookstore.demo.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {

    /**
     * Ricerca un editore per nome esatto.
     * Molto utile per l'importazione CSV e per evitare duplicati.
     */
    Optional<Publisher> findByNome(String nome);

    /**
     * Verifica se esiste già un editore con questo nome.
     * Utilizzato dal PublisherImportService che abbiamo creato.
     */
    boolean existsByNome(String nome);

    /**
     * Ricerca editori per sede (es. tutti gli editori di "Milano").
     */
    java.util.List<Publisher> findBySedeIgnoreCase(String sede);
}