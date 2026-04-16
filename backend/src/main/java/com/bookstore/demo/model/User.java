package com.bookstore.demo.model;

import jakarta.persistence.*; // Fondamentale per @Entity, @Id, @Table
import lombok.Data; // Se usi Lombok, altrimenti scrivi i getter/setter a mano

@Entity
@Table(name = "utenti")
@Data // Genera automaticamente Getter, Setter, toString, equals e hashCode

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String password; // Assicurati che il nome variabile corrisponda a quello usato nel service

    private String nome;
    private String cognome;
    private String email;
    private String ruolo;

}
