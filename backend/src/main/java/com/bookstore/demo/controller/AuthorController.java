package com.bookstore.demo.controller;

import com.bookstore.demo.model.Author;
import com.bookstore.demo.repository.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @GetMapping("/admin/authors")
    public List<Author> getAllAuthorsAdmin() {
        return authorRepository.findAll();
    }

    @GetMapping("/admin/authors/{id}")
    public Author getAuthorById(@PathVariable @NonNull Long id) {
        return authorRepository.findById(id).orElse(null);
    }
}