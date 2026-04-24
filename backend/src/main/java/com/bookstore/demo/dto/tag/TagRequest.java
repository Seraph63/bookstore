package com.bookstore.demo.dto.tag;

import jakarta.validation.constraints.NotBlank;

public class TagRequest {

    @NotBlank
    private String descrizione;

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
}
