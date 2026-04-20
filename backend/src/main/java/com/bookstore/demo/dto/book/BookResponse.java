package com.bookstore.demo.dto.book;

public class BookResponse {
    // Identificazione
    private Long id;
    private String titolo;
    private String sottotitolo;

    // Autore (flattened)
    private Long autoreId; // ID per il form di modifica
    private String nomeAutore;
    private String cognomeAutore;
    private String biografiaAutore; // Opzionale

    // Editore (flattened)
    private Long editoreId; // ID per il form di modifica
    private String nomeEditore;
    private String sedeEditore; // Opzionale

    // Metadati
    private Integer annoPubblicazione;
    private String isbn10;
    private String isbn13;
    private String formati;

    // Pricing
    private Double prezzo;
    private Double prezzoOriginale;
    private Integer stock;

    // Campi calcolati
    private Boolean disponibile; // stock > 0
    private Double percentualeSconto; // Se prezzoOriginale > prezzo
    private String descrizioneBreve; // Primi 150 caratteri

    // Media
    private String copertinaUrl;
    private Double valutazioneMedia;
    private Integer numeroRecensioni;

    // Categorizzazione
    private Long categoriaId; // ID per il form di modifica
    private String categoria; // Descrizione categoria per visualizzazione
    private String tags; // Descrizioni dei tag concatenate
    private String descrizione;

    // Costruttori, getter, setter...

    public BookResponse() {
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

    public String getNomeAutore() {
        return nomeAutore;
    }

    public void setNomeAutore(String nomeAutore) {
        this.nomeAutore = nomeAutore;
    }

    public String getCognomeAutore() {
        return cognomeAutore;
    }

    public void setCognomeAutore(String cognomeAutore) {
        this.cognomeAutore = cognomeAutore;
    }

    public String getBiografiaAutore() {
        return biografiaAutore;
    }

    public void setBiografiaAutore(String biografiaAutore) {
        this.biografiaAutore = biografiaAutore;
    }

    public Long getAutoreId() {
        return autoreId;
    }

    public void setAutoreId(Long autoreId) {
        this.autoreId = autoreId;
    }

    public String getNomeEditore() {
        return nomeEditore;
    }

    public void setNomeEditore(String nomeEditore) {
        this.nomeEditore = nomeEditore;
    }

    public String getSedeEditore() {
        return sedeEditore;
    }

    public void setSedeEditore(String sedeEditore) {
        this.sedeEditore = sedeEditore;
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

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public Double getPrezzoOriginale() {
        return prezzoOriginale;
    }

    public void setPrezzoOriginale(Double prezzoOriginale) {
        this.prezzoOriginale = prezzoOriginale;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getDisponibile() {
        return disponibile;
    }

    public void setDisponibile(Boolean disponibile) {
        this.disponibile = disponibile;
    }

    public Double getPercentualeSconto() {
        return percentualeSconto;
    }

    public void setPercentualeSconto(Double percentualeSconto) {
        this.percentualeSconto = percentualeSconto;
    }

    public String getDescrizioneBreve() {
        return descrizioneBreve;
    }

    public void setDescrizioneBreve(String descrizioneBreve) {
        this.descrizioneBreve = descrizioneBreve;
    }

    public String getCopertinaUrl() {
        return copertinaUrl;
    }

    public void setCopertinaUrl(String copertinaUrl) {
        this.copertinaUrl = copertinaUrl;
    }

    public Double getValutazioneMedia() {
        return valutazioneMedia;
    }

    public void setValutazioneMedia(Double valutazioneMedia) {
        this.valutazioneMedia = valutazioneMedia;
    }

    public Integer getNumeroRecensioni() {
        return numeroRecensioni;
    }

    public void setNumeroRecensioni(Integer numeroRecensioni) {
        this.numeroRecensioni = numeroRecensioni;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
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

    @Override
    public String toString() {
        return "BookResponse [id=" + id + ", titolo=" + titolo + ", sottotitolo=" + sottotitolo + ", nomeAutore="
                + nomeAutore + ", cognomeAutore=" + cognomeAutore + ", biografiaAutore=" + biografiaAutore
                + ", nomeEditore=" + nomeEditore + ", sedeEditore=" + sedeEditore + ", annoPubblicazione="
                + annoPubblicazione + ", isbn10=" + isbn10 + ", isbn13=" + isbn13 + ", formati=" + formati + ", prezzo="
                + prezzo + ", prezzoOriginale=" + prezzoOriginale + ", stock=" + stock + ", disponibile=" + disponibile
                + ", percentualeSconto=" + percentualeSconto + ", descrizioneBreve=" + descrizioneBreve
                + ", copertinaUrl=" + copertinaUrl + ", valutazioneMedia=" + valutazioneMedia + ", numeroRecensioni="
                + numeroRecensioni + ", categoria=" + categoria + ", tags=" + tags + ", descrizione=" + descrizione
                + "]";
    }

}
