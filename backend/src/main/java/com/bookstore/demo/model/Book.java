package com.bookstore.demo.model;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.validator.constraints.URL;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "libri")
public class Book {

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
    @Column(nullable = false, unique = true)
    @Pattern(regexp = "^\\d{10}$", message = "ISBN10 deve essere formato da 10 cifre")
    private String isbn10;

    @Column(nullable = false, unique = true)
    @Pattern(regexp = "^\\d{3}-\\d{10}$", message = "ISBN13 deve essere nel formato 978-xxxxxxxxxx")
    private String isbn13;

    private String formati;

    @NotNull(message = "Il prezzo è obbligatorio")
    @DecimalMin(value = "0.01", message = "Il prezzo deve essere maggiore di zero")
    @Column(nullable = false)
    private Double prezzo;

    private Double prezzo_originale;
    private Integer stock;

    @Column(length = 500)
    @URL(message = "L'URL della copertina non è valido")
    private String copertinaUrl;

    private Double valutazione_media;
    private Integer numero_recensioni;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE })
    @JoinTable(name = "libro_tag", joinColumns = @JoinColumn(name = "libro_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tag = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    private Category categoria;

    @Column(columnDefinition = "TEXT")
    private String descrizione;

    public Book() {
    }

    public Author getAutore() {
        return autore;
    }

    public void setAutore(Author autore) {
        this.autore = autore;
    }

    public Publisher getEditore() {
        return editore;
    }

    public void setEditore(Publisher editore) {
        this.editore = editore;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }

    public String getSottotitolo() {
        return sottotitolo;
    }

    public void setSottotitolo(String sottotitolo) {
        this.sottotitolo = sottotitolo;
    }

    public Integer getAnno_pubblicazione() {
        return anno_pubblicazione;
    }

    public void setAnno_pubblicazione(Integer anno_pubblicazione) {
        this.anno_pubblicazione = anno_pubblicazione;
    }

    public String getIsbn10() {
        return isbn10;
    }

    public void setIsbn10(String isbn10) {
        this.isbn10 = isbn10;
    }

    public String getIsbn13() {
        return isbn13;
    }

    public void setIsbn13(String isbn13) {
        this.isbn13 = isbn13;
    }

    public String getFormati() {
        return formati;
    }

    public void setFormati(String formati) {
        this.formati = formati;
    }

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public Double getPrezzo_originale() {
        return prezzo_originale;
    }

    public void setPrezzo_originale(Double prezzo_originale) {
        this.prezzo_originale = prezzo_originale;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCopertinaUrl() {
        return copertinaUrl;
    }

    public void setCopertinaUrl(String copertinaUrl) {
        this.copertinaUrl = copertinaUrl;
    }

    public Double getValutazione_media() {
        return valutazione_media;
    }

    public void setValutazione_media(Double valutazione_media) {
        this.valutazione_media = valutazione_media;
    }

    public Integer getNumero_recensioni() {
        return numero_recensioni;
    }

    public void setNumero_recensioni(Integer numero_recensioni) {
        this.numero_recensioni = numero_recensioni;
    }

    public Category getCategoria() {
        return categoria;
    }

    public void setCategoria(Category categoria) {
        this.categoria = categoria;
    }

    public Set<Tag> getTag() {
        return tag;
    }

    public void setTag(Set<Tag> tag) {
        this.tag = tag;
    }

    // Metodi utility per gestire la relazione
    public void addTag(Tag tag) {
        this.tag.add(tag);
        tag.getLibri().add(this);
    }

    public void removeTag(Tag tag) {
        this.tag.remove(tag);
        tag.getLibri().remove(this);
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
}