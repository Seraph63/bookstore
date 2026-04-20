package com.bookstore.demo.dto.book;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public class BookUpdateRequest {

    @NotBlank(message = "Titolo e obbligatorio")
    private String titolo;

    private String sottotitolo;

    @NotNull(message = "Autore ID e obbligatorio")
    private Long autoreId;

    @NotNull(message = "Editore ID e obbligatorio")
    private Long editoreId;

    private Integer annoPubblicazione;

    @Pattern(regexp = "^\\d{10}$", message = "ISBN10 deve essere formato da 10 cifre")
    private String isbn10;

    @Pattern(regexp = "^\\d{3}-\\d{10}$", message = "ISBN13 deve essere nel formato 978-xxxxxxxxxx")
    private String isbn13;

    private String formati;

    @NotNull(message = "Prezzo e obbligatorio")
    @DecimalMin(value = "0.01", message = "Prezzo deve essere positivo")
    private BigDecimal prezzo;

    private BigDecimal prezzoOriginale;
    private Integer stock;
    private String copertinaUrl;
    private Long categoriaId;
    private Set<Long> tagIds;
    private String descrizione;

    public BookUpdateRequest() {
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

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Set<Long> getTagIds() {
        return tagIds;
    }

    public void setTagIds(Set<Long> tagIds) {
        this.tagIds = tagIds;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    @Override
    public String toString() {
        return "BookUpdateRequest{" +
                "titolo='" + titolo + '\'' +
                ", isbn10='" + isbn10 + '\'' +
                ", prezzo=" + prezzo +
                ", autoreId=" + autoreId +
                ", editoreId=" + editoreId +
                '}';
    }
}
