package com.bookstore.demo.dto.publisher;

import com.bookstore.demo.model.Publisher;

public class PublisherResponse {

    private Long id;
    private String nome;
    private String sede;

    public PublisherResponse() {
    }

    public static PublisherResponse fromEntity(Publisher publisher) {
        PublisherResponse dto = new PublisherResponse();
        dto.setId(publisher.getId());
        dto.setNome(publisher.getNome());
        dto.setSede(publisher.getSede());
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

    public String getSede() {
        return sede;
    }

    public void setSede(String sede) {
        this.sede = sede;
    }
}
