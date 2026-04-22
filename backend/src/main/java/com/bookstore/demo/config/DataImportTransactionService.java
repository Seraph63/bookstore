package com.bookstore.demo.config;

import com.bookstore.demo.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.io.InputStream;

@Service
public class DataImportTransactionService {

    private static final Logger log = LoggerFactory.getLogger(DataImportTransactionService.class);

    @PersistenceContext
    private EntityManager entityManager;

    private final AuthorImportService authorImportService;
    private final PublisherImportService publisherImportService;
    private final UserImportService userImportService;
    private final BookImportService bookImportService;
    private final CategoryImportService categoryImportService;
    private final TagImportService tagImportService;
    private final FormatoImportService formatoImportService;

    public DataImportTransactionService(AuthorImportService authorImportService,
            PublisherImportService publisherImportService,
            UserImportService userImportService,
            BookImportService bookImportService,
            CategoryImportService categoryImportService,
            TagImportService tagImportService,
            FormatoImportService formatoImportService) {
        this.authorImportService = authorImportService;
        this.publisherImportService = publisherImportService;
        this.userImportService = userImportService;
        this.bookImportService = bookImportService;
        this.categoryImportService = categoryImportService;
        this.tagImportService = tagImportService;
        this.formatoImportService = formatoImportService;
    }

    @Transactional
    public void importAutori() throws Exception {
        try (InputStream is = new ClassPathResource("data/authors.csv").getInputStream()) {
            authorImportService.importFromCsv(is);
            log.info("Autori importati.");
        }
    }

    @Transactional
    public void importEditori() throws Exception {
        try (InputStream is = new ClassPathResource("data/publishers.csv").getInputStream()) {
            publisherImportService.importFromCsv(is);
            log.info("Editori importati.");
        }
    }

    @Transactional
    public void importCategorie() throws Exception {
        try (InputStream is = new ClassPathResource("data/categories.csv").getInputStream()) {
            categoryImportService.importFromCsv(is);
            log.info("Categorie importate.");
        }
    }

    @Transactional
    public void importTags() throws Exception {
        try (InputStream is = new ClassPathResource("data/tags.csv").getInputStream()) {
            tagImportService.importFromCsv(is);
            log.info("Tags importati.");
        }
    }

    @Transactional
    public void importFormati() throws Exception {
        try (InputStream is = new ClassPathResource("data/formats.csv").getInputStream()) {
            formatoImportService.importFromCsv(is);
            // Forza il flush per assicurarsi che i formati siano visibili nella stessa
            // transazione
            entityManager.flush();
            log.info("Formati importati.");
        } catch (Exception e) {
            log.error("Errore durante l'importazione formati: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public void importUtenti() throws Exception {
        try (InputStream is = new ClassPathResource("data/users.csv").getInputStream()) {
            userImportService.importFromCsv(is);
            log.info("Utenti importati.");
        }
    }

    @Transactional
    public void importLibri() throws Exception {
        try (InputStream is = new ClassPathResource("data/books.csv").getInputStream()) {
            bookImportService.importFromCsv(is);
            // Forza il flush per committare tutte le relazioni many-to-many
            entityManager.flush();
            log.info("Libri importati.");
        }
    }

    /**
     * Importa tutti i dati in un'unica transazione per evitare problemi di
     * isolamento transazionale.
     */
    @Transactional
    public void importAllData() throws Exception {
        log.info("Avvio importazione completa in unica transazione...");

        importAutori();
        importEditori();
        importCategorie();
        importTags();
        importFormati();
        importUtenti();
        importLibri();

        log.info("Importazione completa terminata con successo.");
    }
}