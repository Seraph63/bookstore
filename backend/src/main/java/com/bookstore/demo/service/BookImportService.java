package com.bookstore.demo.service;

import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.model.Category;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.AuthorRepository;
import com.bookstore.demo.repository.PublisherRepository;
import com.bookstore.demo.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookImportService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final CategoryRepository categoryRepository;

    // Iniettiamo tutti i repository necessari
    public BookImportService(BookRepository bookRepository,
            AuthorRepository authorRepository,
            PublisherRepository publisherRepository,
            CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.categoryRepository = categoryRepository;
    }

    public void importFromCsv(InputStream inputStream) {
        // Controlla se il database ha già dei libri
        if (bookRepository.count() > 0) {
            System.out.println("ℹ️ Il database contiene già dei libri. Salto l'importazione.");
            return;
        }

        List<Book> books = parseCsv(inputStream);
        if (!books.isEmpty()) {
            System.out.println("⏳ Importazione di " + books.size() + " libri...");
            bookRepository.saveAll(books);
            System.out.println("✅ Importazione libri completata!");
        }
    }

    public List<Book> parseCsv(InputStream inputStream) {
        List<Book> books = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (firstLine || line.isEmpty()) {
                    firstLine = false;
                    continue;
                }

                String[] v = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                if (v.length >= 17) {
                    Book book = new Book();
                    book.setTitolo(clean(v[0]));
                    book.setSottotitolo(clean(v[1]));

                    // 1. Estrazione ID dal CSV
                    Long authorId = parseToLong(v[2]);
                    Long publisherId = parseToLong(v[3]);
                    Long categoriaId = parseToLong(v[14]); // La categoria ora è un ID

                    // 2. Caricamento oggetti dal DB (UNA SOLA VOLTA)
                    // Usiamo orElseThrow per fermare l'import se i dati base
                    // (autori/editori/categorie)
                    // mancano
                    Author autore = authorRepository.findById(authorId)
                            .orElseThrow(() -> new RuntimeException("Autore ID " + authorId + " non trovato!"));

                    Publisher editore = publisherRepository.findById(publisherId)
                            .orElseThrow(() -> new RuntimeException("Editore ID " + publisherId + " non trovato!"));

                    Category categoria = categoryRepository.findById(categoriaId)
                            .orElseThrow(() -> new RuntimeException("Categoria ID " + categoriaId + " non trovata!"));

                    // 3. Associazione al libro (usa i setter definiti in Book.java)
                    book.setAutore(autore);
                    book.setEditore(editore);
                    book.setCategoria(categoria);

                    // 4. Resto dei campi
                    book.setAnno_pubblicazione(parseToInt(v[4]));
                    book.setIsbn10(clean(v[5]));
                    book.setIsbn13(clean(v[6]));
                    book.setFormati(clean(v[7]));
                    book.setPrezzo(parseToDouble(v[8]));
                    book.setPrezzo_originale(parseToDouble(v[9]));
                    book.setStock(parseToInt(v[10]));
                    book.setCopertinaUrl(clean(v[11])); // Ora usa il setter corretto
                    book.setValutazione_media(parseToDouble(v[12]));
                    book.setNumero_recensioni(parseToInt(v[13]));
                    // La categoria è già impostata sopra come relazione
                    book.setTags(clean(v[15]));
                    book.setDescrizione(clean(v[16]));

                    books.add(book);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore importazione: " + e.getMessage());
        }
        return books;
    }

    private String clean(String value) {
        if (value == null)
            return "";
        return value.replace("\"", "") // Rimuove virgolette
                .replace("\r", "") // Rimuove ritorni a capo
                .replace("\n", " ") // Sostituisce invio con spazio
                .trim();
    }

    private long parseToLong(String value) {
        try {
            return Long.parseLong(clean(value));
        } catch (Exception e) {
            return 0L; // Restituisce 0 se l'ID non è valido
        }
    }

    private int parseToInt(String value) {
        try {
            return Integer.parseInt(clean(value));
        } catch (Exception e) {
            return 0;
        }
    }

    private Double parseToDouble(String value) {
        try {
            return Double.parseDouble(clean(value).replace(",", "."));
        } catch (Exception e) {
            return 0.0;
        }
    }
}