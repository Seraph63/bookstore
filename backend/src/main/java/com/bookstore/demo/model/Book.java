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
    private String title;
    
    private String subtitle;

    // Autore/i, Editore, Anno di pubblicazione
    private String authors;
    
    private String publisher;
    
    private Integer pubYear;

    // Codici ISBN
    @Column(name = "isbn_10")
    private String isbn10;
    
    @Column(name = "isbn_13")
    private String isbn13;

    // Formato disponibile: cartaceo, e-book, audiolibro (salvati come stringa separata da virgole o pipe)
    private String formats;

    // Prezzo (Prezzo attuale e Prezzo originale/barrato)
    private Double price;
    
    private Double oldPrice;

    // Disponibilità a magazzino
    private Integer stock;

    // Copertina ad alta risoluzione (URL dell'immagine)
    @Column(length = 500, name = "cover_url")
    private String coverUrl;

    // Valutazione media e numero di recensioni
    private Double rating;
    
    private Integer reviewsCount;

    // Categorie e Tag tematici
    private String categories;
    
    private String tags;

    private String Sku;

    // Descrizione/Trama (usiamo TEXT perché può essere molto lunga)
    @Column(columnDefinition = "TEXT")
    private String description;
}