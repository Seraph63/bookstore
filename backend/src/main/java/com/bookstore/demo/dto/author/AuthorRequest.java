package com.bookstore.demo.dto.author;

import jakarta.validation.constraints.NotBlank;

public class AuthorRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String cognome;

    private String biografia;

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
