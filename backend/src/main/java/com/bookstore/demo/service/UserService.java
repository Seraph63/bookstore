package com.bookstore.demo.service;

import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) throws RuntimeException {
        // Validazione username univoco
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username già esistente");
        }

        // Validazione email univoca (se specificata)
        if (user.getEmail() != null && !user.getEmail().isEmpty() &&
                userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email già esistente");
        }

        // Imposta valori di default se non specificati
        if (user.getRuolo() == null || user.getRuolo().isEmpty()) {
            user.setRuolo("USER");
        }
        if (user.getAttivo() == null) {
            user.setAttivo(true);
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) throws RuntimeException {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        log.debug("Aggiornamento utente {}: username='{}', ruolo='{}', attivo={}",
                id, userDetails.getUsername(), userDetails.getRuolo(), userDetails.getAttivo());

        // Validazione e aggiornamento username
        String newUsername = userDetails.getUsername();
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            newUsername = newUsername.trim();
            if (!newUsername.equals(user.getUsername()) &&
                    userRepository.existsByUsernameAndIdNot(newUsername, id)) {
                throw new RuntimeException("Username già esistente");
            }
            user.setUsername(newUsername);
        } else if (newUsername != null) {
            log.debug("Username vuoto ricevuto, mantengo quello esistente: {}", user.getUsername());
        }

        // Validazione e aggiornamento email
        String newEmail = userDetails.getEmail();
        if (newEmail != null && !newEmail.trim().isEmpty()) {
            newEmail = newEmail.trim();
            if (!newEmail.equals(user.getEmail()) &&
                    userRepository.existsByEmailAndIdNot(newEmail, id)) {
                throw new RuntimeException("Email già esistente");
            }
            user.setEmail(newEmail);
        } else if (newEmail != null) {
            user.setEmail(null);
        }

        // Aggiorna altri campi
        if (userDetails.getNome() != null) {
            user.setNome(userDetails.getNome().trim());
        }
        if (userDetails.getCognome() != null) {
            user.setCognome(userDetails.getCognome().trim());
        }

        // Aggiorna ruolo sempre se fornito
        if (userDetails.getRuolo() != null) {
            user.setRuolo(userDetails.getRuolo());
        }

        // Aggiorna stato attivo sempre se fornito
        if (userDetails.getAttivo() != null) {
            user.setAttivo(userDetails.getAttivo());
        }

        // Aggiorna la password solo se fornita
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }

        User savedUser = userRepository.save(user);
        log.debug("Utente {} salvato - ruolo: {}, attivo: {}", id, savedUser.getRuolo(), savedUser.getAttivo());
        return savedUser;
    }

    public void deleteUser(Long id) throws RuntimeException {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utente non trovato");
        }
        userRepository.deleteById(id);
    }

    public User toggleUserActive(Long id) throws RuntimeException {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        user.setAttivo(!user.getAttivo());
        return userRepository.save(user);
    }
}