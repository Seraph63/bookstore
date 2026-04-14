package com.bookstore.demo.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.UserRepository;
import com.bookstore.demo.repository.BookRepository;
import java.util.List;

@Component
public class UserImportService implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserImportService(UserRepository userRepository, BookRepository bookRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        initUsers();
    }

    @SuppressWarnings("null")
    public void initUsers() {
        if (userRepository.count() == 0) {
            System.out.println("⏳ Creazione utenti di test...");

            User user1 = new User();
            user1.setNome("Serafino");
            user1.setCognome("Corriero");
            user1.setEmail("sercorrie@email.it");
            user1.setPassword(passwordEncoder.encode("password123"));
            user1.setRuolo("ADMIN");

            User user2 = new User();
            user2.setNome("Luigi");
            user2.setCognome("Verdi");
            user2.setEmail("luigi.verdi@email.it");
            user2.setPassword(passwordEncoder.encode("password123"));
            user2.setRuolo("USER");

            userRepository.saveAll(List.of(user1, user2));
            System.out.println("✅ Utenti di test creati: mario.rossi@email.it e luigi.verdi@email.it");
        }
    }
}
