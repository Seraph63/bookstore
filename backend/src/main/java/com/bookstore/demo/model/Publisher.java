package com.bookstore.demo.model;

import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "editori")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome dell'editore è obbligatorio")
    @Column(nullable = false, unique = true) // 'unique = true' evita duplicati nel DB
    private String nome;

    @NotBlank(message = "La sede è obbligatoria")
    @Column(nullable = false)
    private String sede;

    @OneToMany(mappedBy = "editore")
    @JsonIgnore
    private List<Book> books;
}
