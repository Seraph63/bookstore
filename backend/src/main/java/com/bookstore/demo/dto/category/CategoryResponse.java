package com.bookstore.demo.dto.category;

import com.bookstore.demo.model.Category;

public class CategoryResponse {

    private Long id;
    private String descrizione;

    public CategoryResponse() {
    }

    public static CategoryResponse fromEntity(Category category) {
        CategoryResponse dto = new CategoryResponse();
        dto.setId(category.getId());
        dto.setDescrizione(category.getDescrizione());
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
