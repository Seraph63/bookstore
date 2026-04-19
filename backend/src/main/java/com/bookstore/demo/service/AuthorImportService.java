package com.bookstore.demo.service;

import com.bookstore.demo.model.Author;
import com.bookstore.demo.repository.AuthorRepository;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuthorImportService {

    private final AuthorRepository authorRepository;

    public AuthorImportService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public void importFromCsv(InputStream inputStream) {
        List<Author> authors = parseCsv(inputStream);
        if (!authors.isEmpty()) {
            authorRepository.saveAll(authors);
        }
    }

    private List<Author> parseCsv(InputStream inputStream) {
        List<Author> authors = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (firstLine || line.isEmpty()) {
                    firstLine = false;
                    continue;
                }

                // Stessa regex del tuo BookImportService per gestire le virgole tra virgolette
                String[] v = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                if (v.length >= 2) {
                    Author author = new Author();
                    author.setNome(clean(v[0]));
                    author.setCognome(clean(v[1]));

                    // Se il CSV ha la colonna biografia (v[2]), la carichiamo
                    if (v.length > 2) {
                        author.setBiografia(clean(v[2]));
                    } else {
                        author.setBiografia("Biografia non disponibile");
                    }

                    // Evitiamo duplicati durante l'importazione
                    if (!authorRepository.existsByNomeAndCognome(author.getNome(), author.getCognome())) {
                        authors.add(author);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'importazione Autori: " + e.getMessage());
        }
        return authors;
    }

    private String clean(String value) {
        if (value == null)
            return "";
        return value.replace("\"", "").trim();
    }
}