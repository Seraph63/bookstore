package com.bookstore.demo.controller;

import com.bookstore.demo.service.AuthorImportService;
import com.bookstore.demo.service.PublisherImportService;
import com.bookstore.demo.service.BookImportService;
import com.bookstore.demo.service.UserImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class ImportController {

    private final AuthorImportService authorImportService;
    private final PublisherImportService publisherImportService;
    private final BookImportService bookImportService;
    private final UserImportService userImportService;

    public ImportController(AuthorImportService authorImportService,
            PublisherImportService publisherImportService,
            BookImportService bookImportService,
            UserImportService userImportService) {
        this.authorImportService = authorImportService;
        this.publisherImportService = publisherImportService;
        this.bookImportService = bookImportService;
        this.userImportService = userImportService;
    }

    @PostMapping("/all")
    public ResponseEntity<String> importAllData(
            @RequestParam("authors") MultipartFile authorsFile,
            @RequestParam("publishers") MultipartFile publishersFile,
            @RequestParam("books") MultipartFile booksFile,
            @RequestParam("users") MultipartFile usersFile) {

        try {
            // 1. PRIMO PASSO: Importazione Autori
            authorImportService.importFromCsv(authorsFile.getInputStream());

            // 2. SECONDO PASSO: Importazione Editori
            publisherImportService.importFromCsv(publishersFile.getInputStream());

            // 3. TERZO PASSO: Importazione Libri (dipende dai primi due)
            bookImportService.importFromCsv(booksFile.getInputStream());

            // 3. QUARTO PASSO: Importazione Utenti
            userImportService.importFromCsv(usersFile.getInputStream());
            return ResponseEntity.ok("Importazione completata con successo in ordine sequenziale!");

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Errore durante la sequenza di importazione: " + e.getMessage());
        }
    }
}