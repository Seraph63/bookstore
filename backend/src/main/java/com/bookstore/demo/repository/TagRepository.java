package com.bookstore.demo.repository;

import com.bookstore.demo.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * Ricerca un categoria per nome esatto.
     * Molto utile per l'importazione CSV e per evitare duplicati.
     */
    Optional<Tag> findByDescrizione(String descrizione);

    /**
     * Verifica se esiste già una categoria con questo nome.
     * Utilizzato dal PublisherImportService che abbiamo creato.
     */
    boolean existsByDescrizione(String descrizione);

    /**
     * Ricerca tag per liste di descrizioni.
     * Utilizzato per importazioni e bulk operations.
     */
    java.util.Set<Tag> findByDescrizioneIn(java.util.Collection<String> descrizioni);

}