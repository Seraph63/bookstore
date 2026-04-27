package com.bookstore.demo.controller;

import com.bookstore.demo.dto.tag.TagResponse;
import com.bookstore.demo.repository.TagRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tag")
@CrossOrigin(origins = "*")
public class TagController {

    private final TagRepository tagRepository;

    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    // GET /api/tag - Lista tutti i tag
    @GetMapping
    public List<TagResponse> getAllTag() {
        return tagRepository.findAll().stream()
                .map(TagResponse::fromEntity)
                .toList();
    }

    // GET /api/tag/{id} - Dettaglio singolo tag
    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> getTagById(@PathVariable @NonNull Long id) {
        return tagRepository.findById(id)
                .map(TagResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}