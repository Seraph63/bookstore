package com.bookstore.demo.controller;

import com.bookstore.demo.dto.book.BookCreateRequest;
import com.bookstore.demo.dto.book.BookResponse;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.service.IBookService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookRepository bookRepository;
    private final IBookService bookService;

    public BookController(BookRepository bookRepository, IBookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    @GetMapping
    public Page<BookResponse> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        size = Math.min(size, 100);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("titolo").ascending());
        return bookService.getAllBooks(pageable);
    }

    // GET /api/books/:id - Dettaglio singolo libro
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable @NonNull Long id) {
        try {
            BookResponse response = bookService.getBookById(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build(); // 404 NOT FOUND
        }
    }

    // GET /api/books/search?q=... - Ricerca e suggerimenti
    @GetMapping("/search")
    public List<Book> search(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return bookRepository.searchBooks(query);
    }

    // CREATE - POST /api/books
    @PostMapping
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookCreateRequest request) {
        try {
            BookResponse response = bookService.createBook(request);
            return ResponseEntity.status(201).body(response); // 201 CREATED
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // 400 BAD REQUEST
        }
    }

    // UPDATE - PUT /api/books/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id,
            @Valid @RequestBody BookCreateRequest request) {
        try {
            BookResponse response = bookService.updateBook(id, request);
            return ResponseEntity.ok(response); // 200 OK
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // 400 BAD REQUEST
        }
    }

    // DELETE - DELETE /api/books/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build(); // 204 NO CONTENT
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build(); // 404 NOT FOUND
        }
    }
}
