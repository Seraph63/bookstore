package com.bookstore.demo.service;

import com.bookstore.demo.model.Book;
import com.bookstore.demo.repository.BookRepository;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookImportService {

    List<Book> books = new ArrayList<>();
    private final BookRepository bookRepository;

    // Iniettiamo il repository
    public BookImportService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public void importFromCsv(InputStream inputStream) {
        List<Book> books = parseCsv(inputStream);
        if (!books.isEmpty()) {
            bookRepository.saveAll(books); // Fondamentale per il test!
        }
    }

    public List<Book> parseCsv(InputStream inputStream) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (firstLine || line.isEmpty()) {
                    firstLine = false;
                    continue;
                }

                // Regex per gestire virgole dentro le virgolette
                String[] v = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                // Verifichiamo di avere abbastanza colonne (almeno fino alla descrizione)
                if (v.length >= 17) {
                    Book book = new Book();

                    // titolo,sottotitolo,autore,editore,anno_pubblicazione,
                    // ISBN10,ISBN13,formati,prezzo,prezzo_originale,stock,copertina_url,
                    // valutazione_media,numero_recensioni,categoria,tags,Descrizione

                    // Campi Testuali
                    book.setTitolo(clean(v[0]));
                    book.setSottotitolo(clean(v[1]));
                    book.setAutore(clean(v[2]));
                    book.setEditore(clean(v[3]));
                    book.setAnnoPubblicazione(parseToInt(v[4]));
                    book.setIsbn10(clean(v[5]));
                    book.setIsbn13(clean(v[6]));
                    book.setFormati(clean(v[7]));
                    book.setPrezzo(parseToDouble(v[8]));
                    book.setPrezzo_originale(parseToDouble(v[9]));
                    book.setStock(parseToInt(v[10]));
                    book.setCopertina_url(clean(v[11]));
                    book.setValutazione_media(parseToDouble(v[12]));
                    book.setNumero_recensioni(parseToInt(v[13]));
                    book.setCategoria(clean(v[14]));
                    book.setTags(clean(v[15]));
                    book.setDescrizione(clean(v[16]));

                    books.add(book);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'importazione CSV: " + e.getMessage());
        }
        return books;
    }

    private String clean(String value) {
        return (value == null) ? "" : value.replace("\"", "").trim();
    }

    private Double parseToDouble(String value) {
        try {
            return Double.parseDouble(clean(value).replace(",", "."));
        } catch (Exception e) {
            return 0.0;
        }
    }

    private Integer parseToInt(String value) {
        try {
            return Integer.parseInt(clean(value));
        } catch (Exception e) {
            return 0;
        }
    }
}