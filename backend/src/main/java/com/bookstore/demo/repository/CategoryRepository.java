package com.bookstore.demo.repository;

import com.bookstore.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Ricerca un categoria per nome esatto.
     * Molto utile per l'importazione CSV e per evitare duplicati.
     */
    Optional<Category> findByDescrizione(String descrizione);

    /**
     * Verifica se esiste già una categoria con questo nome.
     * Utilizzato dal PublisherImportService che abbiamo creato.
     */
    boolean existsByDescrizione(String descrizione);

}