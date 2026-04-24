package com.bookstore.demo.controller;

import com.bookstore.demo.dto.publisher.PublisherResponse;
import com.bookstore.demo.repository.PublisherRepository;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PublisherController {

    private final PublisherRepository publisherRepository;

    public PublisherController(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    @GetMapping("/publishers")
    public List<PublisherResponse> getAllPublishers() {
        return publisherRepository.findAll().stream()
                .map(PublisherResponse::fromEntity)
                .toList();
    }

    @GetMapping("/admin/publishers")
    public List<PublisherResponse> getAllPublishersAdmin() {
        return publisherRepository.findAll().stream()
                .map(PublisherResponse::fromEntity)
                .toList();
    }

    @GetMapping("/admin/publishers/{id}")
    public PublisherResponse getPublisherById(@PathVariable @NonNull Long id) {
        return publisherRepository.findById(id)
                .map(PublisherResponse::fromEntity)
                .orElse(null);
    }
}