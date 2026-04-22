package com.bookstore.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final DataImportTransactionService dataImportService;

    public DatabaseInitializer(DataImportTransactionService dataImportService) {
        this.dataImportService = dataImportService;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Avvio importazione automatica dati...");
        try {
            dataImportService.importAllData();
            log.info("Database popolato con successo all'avvio!");
        } catch (Exception e) {
            log.error("Errore durante l'inizializzazione: {}", e.getMessage(), e);
        }
    }
}
