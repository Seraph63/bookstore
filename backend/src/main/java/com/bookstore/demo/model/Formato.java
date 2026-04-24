package com.bookstore.demo.model;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "formati")
public class Formato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String descrizione;

    // Relazione molti-a-molti con Book
    @ManyToMany(mappedBy = "formato", fetch = FetchType.LAZY)
    private Set<Book> libri = new HashSet<>();

    public Formato() {
    }

    public Formato(String descrizione) {
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
        libro.getFormato().add(this);
    }

    public void removeBook(Book libro) {
        this.libri.remove(libro);
        libro.getFormato().remove(this);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Formato formato = (Formato) obj;
        return id != null && id.equals(formato.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Formato{" +
                "id=" + id +
                ", descrizione='" + descrizione + '\'' +
                '}';
    }
}