package com.bookstore.demo.dto.formato;

import com.bookstore.demo.model.Formato;

public class FormatoResponse {

    private Long id;
    private String descrizione;

    public FormatoResponse() {
    }

    public static FormatoResponse fromEntity(Formato formato) {
        FormatoResponse dto = new FormatoResponse();
        dto.setId(formato.getId());
        dto.setDescrizione(formato.getDescrizione());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
}
