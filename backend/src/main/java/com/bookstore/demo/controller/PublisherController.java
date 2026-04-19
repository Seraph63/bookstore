package com.bookstore.demo.controller;

import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.repository.PublisherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PublisherController {

    @Autowired
    private PublisherRepository publisherRepository;

    @GetMapping("/publishers")
    public List<Publisher> getAllPublishers() {
        return publisherRepository.findAll();
    }

    @GetMapping("/admin/publishers")
    public List<Publisher> getAllPublishersAdmin() {
        return publisherRepository.findAll();
    }

    @GetMapping("/admin/publishers/{id}")
    public Publisher getPublisherById(@PathVariable @NonNull Long id) {
        return publisherRepository.findById(id).orElse(null);
    }
}