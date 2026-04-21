package com.bookstore.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final DataImportTransactionService dataImportService;

    public DatabaseInitializer(DataImportTransactionService dataImportService) {
        this.dataImportService = dataImportService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> Avvio importazione automatica dati...");

        try {
            // CRITICO: Usa un'unica transazione per evitare problemi di isolamento
            dataImportService.importAllData();

            System.out.println(">>> Database popolato con successo all'avvio!");

        } catch (Exception e) {
            System.err.println("Errore durante l'inizializzazione: " + e.getMessage());
            e.printStackTrace();
            // Non blocchiamo l'avvio dell'app se mancano i file, ma lo segnaliamo
        }
    }
}
