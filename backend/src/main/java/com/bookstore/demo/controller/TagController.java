package com.bookstore.demo.controller;

import com.bookstore.demo.model.Tag;
import com.bookstore.demo.repository.TagRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Tag")
@CrossOrigin(origins = "*")
public class TagController {

    private final TagRepository TagRepository;

    public TagController(TagRepository TagRepository) {
        this.TagRepository = TagRepository;
    }

    // GET /api/Tag - Lista tutte le categorie
    @GetMapping
    public List<Tag> getAllTag() {
        return TagRepository.findAll();
    }

    // GET /api/Tag/{id} - Dettaglio singola categoria
    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable @NonNull Long id) {
        return TagRepository.findById(id)
                .map(tag -> ResponseEntity.ok().body(tag))
                .orElse(ResponseEntity.notFound().build());
    }
}