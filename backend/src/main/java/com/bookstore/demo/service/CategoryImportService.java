package com.bookstore.demo.service;

import com.bookstore.demo.model.Category;
import com.bookstore.demo.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryImportService {

    private final CategoryRepository categoryRepository;

    public CategoryImportService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public void importFromCsv(InputStream inputStream) {
        List<Category> categories = parseCsv(inputStream);
        if (!categories.isEmpty()) {
            categoryRepository.saveAll(categories);
        }
    }

    private List<Category> parseCsv(InputStream inputStream) {
        List<Category> categories = new ArrayList<>();
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
                    Category category = new Category();
                    category.setDescrizione(clean(v[0]));

                    // Evitiamo duplicati durante l'importazione
                    if (!categoryRepository.existsByDescrizione(clean(v[0]))) {
                        categories.add(category);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'importazione Categorie: " + e.getMessage());
        }
        return categories;
    }

    private String clean(String value) {
        if (value == null)
            return "";
        return value.replace("\"", "").trim();
    }
}