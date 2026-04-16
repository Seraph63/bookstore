package com.bookstore.demo.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "autori")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome è obbligatorio")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Il cognome è obbligatorio")
    @Column(nullable = false)
    private String cognome;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String biografia;

    // Relazione inversa (opzionale): un autore ha molti libri
    @OneToMany(mappedBy = "autore")
    @JsonIgnore
    private List<Book> books;
}
