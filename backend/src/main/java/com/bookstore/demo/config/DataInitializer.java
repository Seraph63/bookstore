package com.bookstore.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.UserRepository;

import com.bookstore.demo.model.Book;
import com.bookstore.demo.repository.BookRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(BookRepository bookRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. CREAZIONE UTENTI DI TEST
        initUsers();
        // Popola il DB solo se è vuoto
        if (bookRepository.count() == 0) {
            System.out.println("⏳ Avvio importazione CSV...");

            var resource = new ClassPathResource("books.csv");

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

                String line;
                br.readLine(); // Salta la riga dell'intestazione (header)

                while ((line = br.readLine()) != null) {
                    if (line.isBlank())
                        continue;

                    // Regex avanzata per dividere per virgola ma ignorare quelle tra virgolette
                    String[] v = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

                    if (v.length >= 17) {
                        Book b = new Book();

                        String isbn10 = clean(v[5]);

                        b.setTitle(clean(v[0]));
                        b.setSku("SKU-" + b.getIsbn10());
                        b.setSubtitle(clean(v[1]));
                        b.setAuthors(clean(v[2]));
                        b.setPublisher(clean(v[3]));
                        b.setPubYear(Integer.parseInt(v[4].trim()));
                        b.setIsbn10(clean(v[5]));
                        b.setIsbn13(clean(v[6]));
                        b.setFormats(clean(v[7]));
                        b.setPrice(Double.parseDouble(v[8].trim()));
                        b.setOldPrice(Double.parseDouble(v[9].trim()));
                        b.setStock(Integer.parseInt(v[10].trim()));
                        b.setCoverUrl(clean(v[11]));
                        b.setRating(Double.parseDouble(v[12].trim()));
                        b.setReviewsCount(Integer.parseInt(v[13].trim()));
                        b.setCategories(clean(v[14]));
                        b.setTags(clean(v[15]));
                        b.setDescription(clean(v[16]));

                        // Se l'ISBN10 esiste, usa quello, altrimenti usa un hash del titolo o un UUID
                        if (isbn10 != null && !isbn10.isEmpty() && !isbn10.equalsIgnoreCase("null")) {
                            b.setSku("SKU-" + isbn10);
                        } else {
                            b.setSku("SKU-" + System.nanoTime()); // Fallback unico se l'ISBN manca
                        }

                        bookRepository.save(b);
                    }
                }
            }
            System.out.println("✅ Importazione completata con successo!");
        } else {
            System.out.println("ℹ️ Il database contiene già dei dati. Salto l'importazione.");
        }
    }

    private void initUsers() {
        if (userRepository.count() == 0) {
            System.out.println("⏳ Creazione utenti di test...");

            User user1 = new User();
            user1.setNome("Mario");
            user1.setCognome("Rossi");
            user1.setEmail("mario.rossi@email.it");
            user1.setPassword(passwordEncoder.encode("password123"));

            User user2 = new User();
            user2.setNome("Luigi");
            user2.setCognome("Verdi");
            user2.setEmail("luigi.verdi@email.it");
            user2.setPassword(passwordEncoder.encode("password123"));

            userRepository.saveAll(List.of(user1, user2));
            System.out.println("✅ Utenti di test creati: mario.rossi@email.it e luigi.verdi@email.it");
        }
    }

    // Rimuove le virgolette esterne e gli spazi bianchi
    private String clean(String s) {
        if (s == null || s.isEmpty())
            return "";
        return s.replace("\"", "").trim();
    }
}