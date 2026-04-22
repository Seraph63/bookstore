package com.bookstore.demo.controller;

import com.bookstore.demo.model.Formato;
import com.bookstore.demo.repository.FormatoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formati")
@CrossOrigin(origins = "*")
public class FormatoController {

    private final FormatoRepository formatoRepository;

    public FormatoController(FormatoRepository formatoRepository) {
        this.formatoRepository = formatoRepository;
    }

    // GET /api/formati - Lista tutti i formato
    @GetMapping
    public List<Formato> getAllFormato() {
        return formatoRepository.findAll();
    }

    // GET /api/formati/{id} - Dettaglio singolo formato
    @GetMapping("/{id}")
    public ResponseEntity<Formato> getFormatoById(@PathVariable @NonNull Long id) {
        return formatoRepository.findById(id)
                .map(formato -> ResponseEntity.ok().body(formato))
                .orElse(ResponseEntity.notFound().build());
    }
}