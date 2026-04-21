package com.bookstore.demo.service;

import com.bookstore.demo.model.Formato;
import com.bookstore.demo.repository.FormatoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class FormatoImportService {

    private final FormatoRepository formatoRepository;

    public FormatoImportService(FormatoRepository formatoRepository) {
        this.formatoRepository = formatoRepository;
    }

    @Transactional
    public void importFromCsv(InputStream inputStream) {
        List<Formato> formati = parseCsv(inputStream);
        if (!formati.isEmpty()) {
            formatoRepository.saveAll(formati);
        }
    }

    private List<Formato> parseCsv(InputStream inputStream) {
        List<Formato> formati = new ArrayList<>();
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
                    Formato formato = new Formato();
                    formato.setDescrizione(clean(v[0]));

                    // Evitiamo duplicati durante l'importazione
                    if (!formatoRepository.existsByDescrizione(clean(v[0]))) {
                        formati.add(formato);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'importazione Formati: " + e.getMessage());
        }
        return formati;
    }

    private String clean(String value) {
        if (value == null)
            return "";
        return value.replace("\"", "").trim();
    }
}