package com.bookstore.demo.dto.publisher;

import jakarta.validation.constraints.NotBlank;

public class PublisherRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String sede;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSede() {
        return sede;
    }

    public void setSede(String sede) {
        this.sede = sede;
    }
}
