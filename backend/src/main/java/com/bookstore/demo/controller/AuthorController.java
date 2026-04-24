package com.bookstore.demo.controller;

import com.bookstore.demo.dto.author.AuthorResponse;
import com.bookstore.demo.repository.AuthorRepository;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthorController {

    private final AuthorRepository authorRepository;

    public AuthorController(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @GetMapping("/authors")
    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(AuthorResponse::fromEntity)
                .toList();
    }

    @GetMapping("/admin/authors")
    public List<AuthorResponse> getAllAuthorsAdmin() {
        return authorRepository.findAll().stream()
                .map(AuthorResponse::fromEntity)
                .toList();
    }

    @GetMapping("/admin/authors/{id}")
    public AuthorResponse getAuthorById(@PathVariable @NonNull Long id) {
        return authorRepository.findById(id)
                .map(AuthorResponse::fromEntity)
                .orElse(null);
    }
}