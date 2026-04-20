package com.bookstore.demo.service;

import com.bookstore.demo.model.Tag;
import com.bookstore.demo.repository.TagRepository;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class TagImportService {

    private final TagRepository TagRepository;

    public TagImportService(TagRepository TagRepository) {
        this.TagRepository = TagRepository;
    }

    public void importFromCsv(InputStream inputStream) {
        List<Tag> Tag = parseCsv(inputStream);
        if (!Tag.isEmpty()) {
            TagRepository.saveAll(Tag);
        }
    }

    private List<Tag> parseCsv(InputStream inputStream) {
        List<Tag> Tag = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (firstLine || line.isEmpty()) {
                    firstLine = false;
                    continue;
                }

                // CSV ha una sola colonna: descrizione
                String[] v = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                if (v.length >= 1) {
                    Tag tag = new Tag();
                    tag.setDescrizione(clean(v[0]));

                    // Evitiamo duplicati durante l'importazione
                    if (!TagRepository.existsByDescrizione(clean(v[0]))) {
                        Tag.add(tag);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'importazione Categorie: " + e.getMessage());
        }
        return Tag;
    }

    private String clean(String value) {
        if (value == null)
            return "";
        return value.replace("\"", "").trim();
    }
}