package com.bookstore.demo.service;

import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.repository.PublisherRepository;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class PublisherImportService {

    private final PublisherRepository publisherRepository;

    public PublisherImportService(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    public void importFromCsv(InputStream inputStream) {
        List<Publisher> publishers = parseCsv(inputStream);
        if (!publishers.isEmpty()) {
            publisherRepository.saveAll(publishers);
        }
    }

    private List<Publisher> parseCsv(InputStream inputStream) {
        List<Publisher> publishers = new ArrayList<>();
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

                if (v.length >= 1) {
                    Publisher publisher = new Publisher();
                    publisher.setNome(clean(v[0]));

                    // Se il CSV ha la sede (v[1])
                    if (v.length > 1) {
                        publisher.setSede(clean(v[1]));
                    } else {
                        publisher.setSede("Sede non specificata");
                    }

                    if (!publisherRepository.existsByNome(publisher.getNome())) {
                        publishers.add(publisher);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'importazione Editori: " + e.getMessage());
        }
        return publishers;
    }

    private String clean(String value) {
        if (value == null)
            return "";
        return value.replace("\"", "").trim();
    }
}