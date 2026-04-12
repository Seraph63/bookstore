package com.bookstore.demo.model;

import jakarta.persistence.*; // Fondamentale per @Entity, @Id, @Table
import lombok.Data; // Se usi Lombok, altrimenti scrivi i getter/setter a mano


@Entity
@Table(name = "users")
@Data // Genera automaticamente Getter, Setter, toString, equals e hashCode

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String nome;
    private String cognome;
    private String username;
    private String ruolo; // Esempio: "USER", "ADMIN"

}
