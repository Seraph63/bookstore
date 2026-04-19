package com.bookstore.demo.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class BookCreateRequest {

    @NotBlank(message = "Il titolo non può essere vuoto")
    private String titolo;

    private String sottotitolo;

    @NotNull(message = "L'autore deve essere selezionato")
    private Long autoreId;

    @NotNull(message = "L'editore deve essere selezionato")
    private Long editoreId;

    @NotNull(message = "L'anno di pubblicazione è obbligatorio")
    @Min(value = 1900, message = "L'anno di pubblicazione deve essere maggiore di 1900")
    @Max(value = 2030, message = "L'anno di pubblicazione non può essere futuro oltre il 2030")
    private Integer annoPubblicazione;

    @Pattern(regexp = "^[0-9]{10}$", message = "ISBN-10 deve essere composto da 10 cifre")
    private String isbn10;

    @NotBlank(message = "ISBN-13 è obbligatorio")
    @Pattern(regexp = "^978[0-9]{10}$", message = "ISBN-13 deve iniziare con 978 e contenere 13 cifre in totale")
    private String isbn13;

    private String formati;

    @NotNull(message = "Il prezzo è obbligatorio")
    @DecimalMin(value = "0.01", message = "Il prezzo deve essere maggiore di zero")
    private BigDecimal prezzo;

    @DecimalMin(value = "0.00", message = "Il prezzo originale non può essere negativo")
    private BigDecimal prezzoOriginale;

    @NotNull(message = "Lo stock è obbligatorio")
    @Min(value = 0, message = "Lo stock non può essere negativo")
    private Integer stock;

    private String copertinaUrl;

    @NotBlank(message = "La categoria non può essere vuota")
    private String categoria;

    private String tags;
    private String descrizione;

    // Costruttore vuoto
    public BookCreateRequest() {
    }

    // Getters e Setters
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

    public Long getAutoreId() {
        return autoreId;
    }

    public void setAutoreId(Long autoreId) {
        this.autoreId = autoreId;
    }

    public Long getEditoreId() {
        return editoreId;
    }

    public void setEditoreId(Long editoreId) {
        this.editoreId = editoreId;
    }

    public Integer getAnnoPubblicazione() {
        return annoPubblicazione;
    }

    public void setAnnoPubblicazione(Integer annoPubblicazione) {
        this.annoPubblicazione = annoPubblicazione;
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

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public BigDecimal getPrezzoOriginale() {
        return prezzoOriginale;
    }

    public void setPrezzoOriginale(BigDecimal prezzoOriginale) {
        this.prezzoOriginale = prezzoOriginale;
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

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
}