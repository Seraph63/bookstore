package com.bookstore.demo.controller;

import com.bookstore.demo.model.Book;
import com.bookstore.demo.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*") // Permette al frontend Next.js di chiamare l'API
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
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
}