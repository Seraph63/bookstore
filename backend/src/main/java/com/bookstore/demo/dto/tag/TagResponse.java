package com.bookstore.demo.dto.tag;

import com.bookstore.demo.model.Tag;

public class TagResponse {

    private Long id;
    private String descrizione;

    public TagResponse() {
    }

    public static TagResponse fromEntity(Tag tag) {
        TagResponse dto = new TagResponse();
        dto.setId(tag.getId());
        dto.setDescrizione(tag.getDescrizione());
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
