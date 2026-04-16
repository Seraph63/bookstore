package com.bookstore.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "libri")
@Data // Genera automaticamente Getter, Setter, toString, equals e hashCode
@NoArgsConstructor
@AllArgsConstructor

public class Book {

    // RELAZIONI NORMALIZZATE
    @ManyToOne(fetch = FetchType.EAGER)
    @NotNull(message = "L'autore è obbligatorio")
    @JoinColumn(name = "autore_id", nullable = false)
    private Author autore;

    @NotNull(message = "L'editore è obbligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "editore_id", nullable = false)
    private Publisher editore;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il titolo è obbligatorio")
    @Column(nullable = false)
    private String titolo;

    private String sottotitolo;

    private Integer anno_pubblicazione;

    @NotBlank(message = "L'ISBN10 è obbligatorio")
    @Column(nullable = false, unique = true) // L'ISBN deve essere unico
    private String isbn10;

    private String isbn13;

    // Formato disponibile: cartaceo, e-book, audiolibro (salvati come stringa
    // separata da virgole o pipe)
    private String formati;

    @NotNull(message = "Il prezzo è obbligatorio")
    @DecimalMin(value = "0.01", message = "Il prezzo deve essere maggiore di zero")
    @Column(nullable = false)
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

    @Column(columnDefinition = "TEXT")
    private String descrizione;
}