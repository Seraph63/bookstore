package com.bookstore.demo.config;

import com.bookstore.demo.service.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.io.InputStream;

@Service
public class DataImportTransactionService {

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
            System.out.println("Autori importati.");
        }
    }

    @Transactional
    public void importEditori() throws Exception {
        try (InputStream is = new ClassPathResource("data/publishers.csv").getInputStream()) {
            publisherImportService.importFromCsv(is);
            System.out.println("Editori importati.");
        }
    }

    @Transactional
    public void importCategorie() throws Exception {
        try (InputStream is = new ClassPathResource("data/categories.csv").getInputStream()) {
            categoryImportService.importFromCsv(is);
            System.out.println("Categorie importate.");
        }
    }

    @Transactional
    public void importTags() throws Exception {
        try (InputStream is = new ClassPathResource("data/tags.csv").getInputStream()) {
            tagImportService.importFromCsv(is);
            System.out.println("Tags importati.");
        }
    }

    @Transactional
    public void importFormati() throws Exception {
        try (InputStream is = new ClassPathResource("data/formats.csv").getInputStream()) {
            System.out.println(">>> Inizio importazione formati...");
            formatoImportService.importFromCsv(is);

            // CRITICO: Forza il flush per assicurarsi che i formati siano committati
            // nel database prima dell'importazione dei libri
            entityManager.flush();
            System.out.println("🔧 FLUSH eseguito dopo importazione formati");

            System.out.println(">>> Formati importati con successo.");
        } catch (Exception e) {
            System.err.println(">>> ERRORE durante l'importazione formati: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void importUtenti() throws Exception {
        try (InputStream is = new ClassPathResource("data/users.csv").getInputStream()) {
            userImportService.importFromCsv(is);
            System.out.println("Utenti importati.");
        }
    }

    @Transactional
    public void importLibri() throws Exception {
        try (InputStream is = new ClassPathResource("data/books.csv").getInputStream()) {
            System.out.println(">>> Inizio importazione libri...");
            System.out.println("🔍 DataImportTransactionService: chiamando BookImportService...");
            bookImportService.importFromCsv(is);

            // CRITICO: Forza il flush per committare tutte le relazioni many-to-many
            entityManager.flush();
            System.out.println("🔧 FLUSH eseguito dopo importazione libri");

            System.out.println("🔍 DataImportTransactionService: BookImportService completato");
            System.out.println(">>> Libri importati con successo.");
        }
    }

    /**
     * SOLUZIONE FINALE: Importa tutti i dati in un'unica transazione
     * per evitare problemi di isolamento transazionale
     */
    @Transactional
    public void importAllData() throws Exception {
        System.out.println("🚀 AVVIO importazione completa in unica transazione");

        // 1. Importa entità base (senza dipendenze)
        importAutori();
        importEditori();
        importCategorie();
        importTags();

        // 2. CRITICO: Importa formati PRIMA dei libri
        importFormati();
        System.out.println("🔧 Formati importati - ora visibili nella stessa transazione");

        // 3. Importa utenti
        importUtenti();

        // 4. Importa libri (che dipendono da formati, autori, editori, categorie)
        importLibri();

        System.out.println("✅ Importazione completa terminata con successo in unica transazione!");
    }
}