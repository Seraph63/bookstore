package com.bookstore.demo.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "libri")
public class Book {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "autore_id", nullable = false)
    private Author autore;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "editore_id", nullable = false)
    private Publisher editore;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titolo;

    private String sottotitolo;
    private Integer anno_pubblicazione;

    @Column(nullable = false, unique = true)
    private String isbn10;

    @Column(nullable = false, unique = true)
    private String isbn13;

    @Column(nullable = false)
    private Double prezzo;

    private Double prezzo_originale;
    private Integer stock;

    @Column(length = 500)
    private String copertinaUrl;

    private Double valutazione_media;
    private Integer numero_recensioni;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE })
    @JoinTable(name = "libro_tag", joinColumns = @JoinColumn(name = "libro_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tag = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE })
    @JoinTable(name = "libro_formato", joinColumns = @JoinColumn(name = "libro_id"), inverseJoinColumns = @JoinColumn(name = "formato_id"))
    private Set<Formato> formato = new HashSet<>();

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

    public Set<Formato> getFormato() {
        return formato;
    }

    public void setFormato(Set<Formato> formato) {
        this.formato = formato;
    }

    // Metodi utility per gestire la relazione
    public void addFormato(Formato formato) {
        this.formato.add(formato);
        formato.getLibri().add(this);
    }

    public void removeFormato(Formato formato) {
        this.formato.remove(formato);
        formato.getLibri().remove(this);
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