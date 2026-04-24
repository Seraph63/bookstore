package com.bookstore.demo.dto.book;

import com.bookstore.demo.model.Book;

public class BookSummaryResponse {

    private Long id;
    private String titolo;
    private Double prezzo;
    private String copertinaUrl;
    private AutoreSummary autore;

    public BookSummaryResponse() {
    }

    public static BookSummaryResponse fromEntity(Book book) {
        BookSummaryResponse dto = new BookSummaryResponse();
        dto.setId(book.getId());
        dto.setTitolo(book.getTitolo());
        dto.setPrezzo(book.getPrezzo());
        dto.setCopertinaUrl(book.getCopertinaUrl());
        if (book.getAutore() != null) {
            AutoreSummary autore = new AutoreSummary();
            autore.setNome(book.getAutore().getNome());
            autore.setCognome(book.getAutore().getCognome());
            dto.setAutore(autore);
        }
        return dto;
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

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public String getCopertinaUrl() {
        return copertinaUrl;
    }

    public void setCopertinaUrl(String copertinaUrl) {
        this.copertinaUrl = copertinaUrl;
    }

    public AutoreSummary getAutore() {
        return autore;
    }

    public void setAutore(AutoreSummary autore) {
        this.autore = autore;
    }

    public static class AutoreSummary {
        private String nome;
        private String cognome;

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public String getCognome() {
            return cognome;
        }

        public void setCognome(String cognome) {
            this.cognome = cognome;
        }
    }
}
