package com.bookstore.demo.config;

import com.bookstore.demo.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.InputStream;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final AuthorImportService authorImportService;
    private final PublisherImportService publisherImportService;
    private final UserImportService userImportService;
    private final BookImportService bookImportService;
    private final CategoryImportService categoryImportService;

    public DatabaseInitializer(AuthorImportService authorImportService,
            PublisherImportService publisherImportService,
            UserImportService userImportService,
            BookImportService bookImportService,
            CategoryImportService categoryImportService) {
        this.authorImportService = authorImportService;
        this.publisherImportService = publisherImportService;
        this.userImportService = userImportService;
        this.bookImportService = bookImportService;
        this.categoryImportService = categoryImportService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> Avvio importazione automatica dati...");

        try {
            // 1. AUTORI
            try (InputStream is = new ClassPathResource("data/authors.csv").getInputStream()) {
                authorImportService.importFromCsv(is);
                System.out.println("Autori importati.");
            }

            // 2. EDITORI
            try (InputStream is = new ClassPathResource("data/publishers.csv").getInputStream()) {
                publisherImportService.importFromCsv(is);
                System.out.println("Editori importati.");
            }
            // 3. CATEGORIE
            try (InputStream is = new ClassPathResource("data/categories.csv").getInputStream()) {
                categoryImportService.importFromCsv(is);
                System.out.println("Categorie importate.");
            }

            // 4. UTENTI
            try (InputStream is = new ClassPathResource("data/users.csv").getInputStream()) {
                userImportService.importFromCsv(is);
                System.out.println("Utenti importati.");
            }

            // 5. LIBRI (Sempre per ultimi!)
            try (InputStream is = new ClassPathResource("data/books.csv").getInputStream()) {
                bookImportService.importFromCsv(is);
                System.out.println("Libri importati.");
            }

            System.out.println(">>> Database popolato con successo all'avvio!");

        } catch (Exception e) {
            System.err.println("Errore durante l'inizializzazione: " + e.getMessage());
            // Non blocchiamo l'avvio dell'app se mancano i file, ma lo segnaliamo
        }
    }
}
