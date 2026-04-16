package com.bookstore.demo.service;

import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserImportService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Iniettiamo il repository per gli utenti
    public UserImportService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public void importFromCsv(InputStream inputStream) {
        List<User> users = parseCsv(inputStream);
        if (!users.isEmpty()) {
            userRepository.saveAll(users);
        }
    }

    private List<User> parseCsv(InputStream inputStream) {
        List<User> users = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (firstLine || line.isEmpty()) {
                    firstLine = false;
                    continue;
                }

                // Regex per gestire virgole dentro le virgolette (come negli altri servizi)
                String[] v = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                if (v.length >= 3) { // Assumiamo almeno Nome, Cognome, Email
                    User user = new User();
                    user.setNome(clean(v[0]));
                    user.setCognome(clean(v[1]));
                    user.setUsername(clean(v[2]));
                    user.setEmail(clean(v[3]));
                    user.setPassword(hashPassword(clean(v[4])));
                    user.setRuolo(clean(v[5]));

                    // Evitiamo duplicati basandoci sull'email (campo unique solitamente)
                    if (!userRepository.existsByEmail(user.getEmail())) {
                        users.add(user);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'importazione Utenti: " + e.getMessage());
        }
        return users;
    }

    // Metodi di utility coerenti con il tuo esempio
    private String clean(String value) {
        return (value == null) ? "" : value.replace("\"", "").trim();
    }

    private int parseToInt(String value) {
        try {
            return Integer.parseInt(clean(value));
        } catch (Exception e) {
            return 0;
        }
    }
}