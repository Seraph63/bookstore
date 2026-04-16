package com.bookstore.demo.controller;

import com.bookstore.demo.model.Book;
import com.bookstore.demo.repository.BookRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAllWithDetails(); // Invece di findAll(), usiamo il metodo personalizzato per evitare

    }

    // GET /api/books/:id - Dettaglio singolo libro
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable @NonNull Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/books/search?q=... - Ricerca e suggerimenti
    @GetMapping("/search")
    public List<Book> search(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return bookRepository.searchBooks(query);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveBook(@Valid @RequestBody @NonNull Book book) {
        // Se il libro non ha tutti i campi o l'ISBN esiste già,
        // Spring lancerà automaticamente un'eccezione o restituirà 400 Bad Request
        bookRepository.save(book);
        return ResponseEntity.ok("Libro salvato con successo");
    }
}