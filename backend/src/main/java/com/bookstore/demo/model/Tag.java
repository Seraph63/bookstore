package com.bookstore.demo.model;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String descrizione;

    // Relazione molti-a-molti con Book
    @ManyToMany(mappedBy = "tag", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Book> libri = new HashSet<>();

    public Tag() {
    }

    public Tag(String descrizione) {
        this.descrizione = descrizione;
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

    public Set<Book> getLibri() {
        return libri;
    }

    public void setLibri(Set<Book> libri) {
        this.libri = libri;
    }

    // Metodi utility per gestire la relazione
    public void addBook(Book libro) {
        this.libri.add(libro);
        libro.getTag().add(this);
    }

    public void removeBook(Book libro) {
        this.libri.remove(libro);
        libro.getTag().remove(this);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Tag tag = (Tag) obj;
        return id != null && id.equals(tag.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Tag{" +
                "id=" + id +
                ", descrizione='" + descrizione + '\'' +
                '}';
    }
}