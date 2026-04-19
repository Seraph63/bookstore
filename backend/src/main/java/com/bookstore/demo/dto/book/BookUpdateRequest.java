package com.bookstore.demo.dto.book;

public class BookUpdateRequest {

    private Long id;
    private String titolo;
    private String autoreId;
    private String editoreId;
    private String isbn10;
    private String isbn13;
    private String copertinaUrl;
    private Integer stock;
    private Double prezzo;

    // 1. COSTRUTTORE VUOTO (obbligatorio per Jackson)
    public BookUpdateRequest() {
    }

    @Override
    public String toString() {
        return "BookCreateRequest{" +
                "titolo='" + titolo + '\'' +
                ", isbn10='" + isbn10 + '\'' +
                ", prezzo=" + prezzo +
                ", autoreId=" + autoreId +
                ", editoreId=" + editoreId +
                '}';
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAutore() {
        return autoreId;
    }

    public void setAutore(String autoreId) {
        this.autoreId = autoreId;
    }

    public String getEditore() {
        return editoreId;
    }

    public void setEditore(String editoreId) {
        this.editoreId = editoreId;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
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

    public String getcopertinaUrl() {
        return copertinaUrl;
    }

    public void setcopertinaUrl(String copertinaUrl) {
        this.copertinaUrl = copertinaUrl;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

}
