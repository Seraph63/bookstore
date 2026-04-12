package com.bookstore.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bookstore.demo.repository.UserRepository;
import com.bookstore.demo.model.User;
import com.bookstore.demo.model.LoginRequest;
import com.bookstore.demo.model.RegisterRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest regRequest) {
        // Verifica se l'email esiste già
        if (userRepository.findByEmail(regRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email già registrata"));
        }

        // Crea il nuovo utente dai dati della richiesta
        User newUser = new User();
        newUser.setNome(regRequest.getNome());
        newUser.setCognome(regRequest.getCognome());
        newUser.setEmail(regRequest.getEmail());

        // Cripta la password prima di salvare!
        newUser.setPassword(passwordEncoder.encode(regRequest.getPassword()));

        userRepository.save(newUser);

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Ora puoi usare i getter della classe invece di .get("email")
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPassword())) {
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(401).body(Map.of("error", "Password errata"));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Account non trovato")));
    }
}