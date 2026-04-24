package com.bookstore.demo.dto.formato;

import jakarta.validation.constraints.NotBlank;

public class FormatoRequest {

    @NotBlank
    private String descrizione;

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
}
