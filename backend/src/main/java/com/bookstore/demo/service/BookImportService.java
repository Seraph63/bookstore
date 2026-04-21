package com.bookstore.demo.service;

import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.model.Category;
import com.bookstore.demo.model.Tag;
import com.bookstore.demo.model.Formato;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.AuthorRepository;
import com.bookstore.demo.repository.PublisherRepository;
import com.bookstore.demo.repository.CategoryRepository;
import com.bookstore.demo.repository.TagRepository;
import com.bookstore.demo.repository.FormatoRepository;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class BookImportService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final FormatoRepository formatoRepository;

    // Iniettiamo tutti i repository necessari
    public BookImportService(BookRepository bookRepository,
            AuthorRepository authorRepository,
            PublisherRepository publisherRepository,
            CategoryRepository categoryRepository,
            TagRepository tagRepository,
            FormatoRepository formatoRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.formatoRepository = formatoRepository;
    }

    @SuppressWarnings("null")
    public void importFromCsv(InputStream inputStream) {
        System.out.println("🚀 AVVIO BookImportService.importFromCsv()");

        // Controlla se il database ha già dei libri
        long bookCount = bookRepository.count();
        System.out.println("🔢 Libri presenti nel database: " + bookCount);

        // Anche diagnostica sui formati e relazioni
        long formatCount = formatoRepository.count();
        System.out.println("🔢 Formati presenti nel database: " + formatCount);

        // TEMPORANEO: Forza re-importazione per pulire dati inconsistenti
        if (bookCount > 0) {
            System.out.println(
                    "⚠️ OVERRIDE: Forzo re-importazione anche con libri esistenti per risolvere inconsistenze");
            System.out.println("🧹 Pulisco libri esistenti per evitare duplicati...");
            bookRepository.deleteAll();
            System.out.println("✅ Pulizia completata");
            // return; // COMMENTATO PER FORZARE RE-IMPORT
        }

        List<Book> books = parseCsv(inputStream);
        if (!books.isEmpty()) {
            System.out.println("⏳ Importazione di " + books.size() + " libri...");

            // DIAGNOSTICA: Verifichiamo che i formati siano presenti nel database
            System.out.println("🔍 Controllo presenza formati nel database:");
            List<Formato> formatiDisponibili = formatoRepository.findAll();
            System.out.println("   Formati trovati: " + formatiDisponibili.size());
            for (Formato f : formatiDisponibili) {
                System.out.println("   - ID: " + f.getId() + ", Descrizione: " + f.getDescrizione());
            }

            if (formatiDisponibili.isEmpty()) {
                System.err.println("❌ ERRORE: Nessun formato trovato nel database!");
                throw new RuntimeException("Impossibile importare libri: nessun formato disponibile!");
            }

            // Salviamo i libri uno alla volta per assicurarci che le relazioni
            // many-to-many vengano risolte immediatamente
            int count = 0;
            for (Book book : books) {
                try {
                    bookRepository.save(book);
                    count++;
                    if (count % 10 == 0) {
                        System.out.println("📚 Importati " + count + " di " + books.size() + " libri...");
                    }
                } catch (Exception e) {
                    System.err.println("❌ Errore nell'importazione del libro: " + book.getTitolo());
                    System.err.println("   Errore: " + e.getMessage());
                    e.printStackTrace();
                    throw e;
                }
            }

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
                    book.setPrezzo(parseToDouble(v[8]));
                    book.setPrezzo_originale(parseToDouble(v[9]));
                    book.setStock(parseToInt(v[10]));
                    book.setCopertinaUrl(clean(v[11])); // Ora usa il setter corretto
                    book.setValutazione_media(parseToDouble(v[12]));
                    book.setNumero_recensioni(parseToInt(v[13]));
                    // La categoria è già impostata sopra come relazione

                    // Gestione forati tramite ID
                    String formatoIdsString = clean(v[7]);
                    if (formatoIdsString != null && !formatoIdsString.isEmpty()) {
                        Set<Formato> formati = new HashSet<>();
                        String[] formatoIdArray = formatoIdsString.split("\\|");
                        System.out.println(">>> Cercando formati con ID: " + formatoIdsString);
                        for (String formatoIdStr : formatoIdArray) {
                            try {
                                Long formatoId = Long.parseLong(formatoIdStr.trim());
                                System.out.println(">>> Ricerca formato con ID: " + formatoId);
                                Optional<Formato> formatoOpt = formatoRepository.findById(formatoId);
                                if (formatoOpt.isPresent()) {
                                    formati.add(formatoOpt.get());
                                    System.out.println(">>> Formato trovato: " + formatoOpt.get().getDescrizione());
                                } else {
                                    System.err.println(">>> ERRORE: Formato con ID " + formatoId + " non trovato!");
                                    // Lista tutti i formati disponibili per debug
                                    List<Formato> allFormati = formatoRepository.findAll();
                                    System.out.println(">>> Formati disponibili nel database:");
                                    for (Formato f : allFormati) {
                                        System.out
                                                .println("  ID: " + f.getId() + ", Descrizione: " + f.getDescrizione());
                                    }
                                }
                            } catch (NumberFormatException e) {
                                System.err.println("Errore parsing formato ID: " + formatoIdStr);
                            }
                        }
                        book.setFormato(formati);
                    }

                    // Gestione tag tramite ID
                    String tagIdsString = clean(v[15]);
                    if (tagIdsString != null && !tagIdsString.isEmpty()) {
                        Set<Tag> tags = new HashSet<>();
                        String[] tagIdArray = tagIdsString.split("\\|");
                        for (String tagIdStr : tagIdArray) {
                            try {
                                Long tagId = Long.parseLong(tagIdStr.trim());
                                tagRepository.findById(tagId).ifPresent(tags::add);
                            } catch (NumberFormatException e) {
                                System.err.println("Errore parsing tag ID: " + tagIdStr);
                            }
                        }
                        book.setTag(tags);
                    }

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