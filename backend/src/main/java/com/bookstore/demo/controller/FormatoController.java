package com.bookstore.demo.controller;

import com.bookstore.demo.dto.formato.FormatoResponse;
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
    public List<FormatoResponse> getAllFormato() {
        return formatoRepository.findAll().stream()
                .map(FormatoResponse::fromEntity)
                .toList();
    }

    // GET /api/formati/{id} - Dettaglio singolo formato
    @GetMapping("/{id}")
    public ResponseEntity<FormatoResponse> getFormatoById(@PathVariable @NonNull Long id) {
        return formatoRepository.findById(id)
                .map(FormatoResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}