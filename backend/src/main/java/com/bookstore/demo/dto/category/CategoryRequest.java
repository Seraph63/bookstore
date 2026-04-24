package com.bookstore.demo.dto.category;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequest {

    @NotBlank
    private String descrizione;

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
}
