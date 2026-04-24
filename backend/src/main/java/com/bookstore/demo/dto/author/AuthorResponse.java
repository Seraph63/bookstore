package com.bookstore.demo.dto.author;

import com.bookstore.demo.model.Author;

public class AuthorResponse {

    private Long id;
    private String nome;
    private String cognome;
    private String biografia;

    public AuthorResponse() {
    }

    public static AuthorResponse fromEntity(Author author) {
        AuthorResponse dto = new AuthorResponse();
        dto.setId(author.getId());
        dto.setNome(author.getNome());
        dto.setCognome(author.getCognome());
        dto.setBiografia(author.getBiografia());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }
}
