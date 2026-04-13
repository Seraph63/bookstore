package com.bookstore.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "books")
@Data // Genera automaticamente Getter, Setter, toString, equals e hashCode
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Titolo e Sottotitolo
    @Column(nullable = false)
    private String titolo;
    
    private String sottotitolo;

    // Autore/i, Editore, Anno di pubblicazione
    private String autore;
    
    private String editore;
    
    @Column(name = "anno_pubblicazione")
    private Integer annoPubblicazione;

    // Codici ISBN
    @Column(name = "isbn_10")
    private String isbn10;
    
    @Column(name = "isbn_13")
    private String isbn13;

    // Formato disponibile: cartaceo, e-book, audiolibro (salvati come stringa separata da virgole o pipe)
    private String formati;

    // Prezzo (Prezzo attuale e Prezzo originale/barrato)
    private Double prezzo;
    
    private Double prezzo_originale;

    // Disponibilità a magazzino
    private Integer stock;

    // Copertina ad alta risoluzione (URL dell'immagine)
    @Column(length = 500, name = "cover_url")
    private String copertina_url;

    // Valutazione media e numero di recensioni
    private Double valutazione_media;
    
    private Integer numero_recensioni;

    // Categorie e Tag tematici
    private String categoria;
    
    private String tags;


    // Descrizione/Trama (usiamo TEXT perché può essere molto lunga)
    @Column(columnDefinition = "TEXT")
    private String descrizione;
}