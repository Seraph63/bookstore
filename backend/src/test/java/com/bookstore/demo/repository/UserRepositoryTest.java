package com.bookstore.demo.repository;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import com.bookstore.demo.model.User;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest // Configura un database in memoria per il test
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveUser() {
        // 1. Arrange: Preparazione dei dati
        User user = new User();
        user.setNome("Mario");
        user.setCognome("Rossi");
        user.setEmail("mario.rossi@test.it");
        user.setPassword("password_sicura_123");

        // 2. Act: Azione da testare
        User savedUser = userRepository.save(user);

        // 3. Assert: Verifica dei risultati
        // Verifichiamo che l'ID sia stato generato dal database
        assertThat(savedUser.getId()).isNotNull();

        // Verifichiamo che l'email salvata sia corretta
        assertThat(savedUser.getEmail()).isEqualTo("mario.rossi@test.it");

        // Verifichiamo che l'utente sia effettivamente presente nel database
        User foundUser = userRepository.findByEmail("mario.rossi@test.it").orElse(null);
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getNome()).isEqualTo("Mario");
    }

    @Test
    void testFindByEmail() {
        // 1. Arrange: Prepariamo un utente e salviamolo
        User user = new User();
        user.setNome("Luigi");
        user.setCognome("Verdi");
        user.setEmail("luigi.verdi@test.it");
        user.setPassword("secret123");
        userRepository.save(user);

        // 2. Act: Eseguiamo la ricerca tramite l'email appena salvata
        Optional<User> foundUserOptional = userRepository.findByEmail("luigi.verdi@test.it");

        // 3. Assert: Verifichiamo i risultati
        assertThat(foundUserOptional).isPresent(); // Deve trovare qualcosa

        User foundUser = foundUserOptional.get();
        assertThat(foundUser.getEmail()).isEqualTo("luigi.verdi@test.it");
        assertThat(foundUser.getNome()).isEqualTo("Luigi");
        assertThat(foundUser.getCognome()).isEqualTo("Verdi");
    }

    @Test
    void testFindByEmailNotFound() {
        // Test di "negativo": cosa succede se l'email non esiste?
        Optional<User> foundUser = userRepository.findByEmail("non.esisto@test.it");

        assertThat(foundUser).isNotPresent(); // Deve essere vuoto
    }

    @Test
    void testEmailUniqueness() {
        // 1. Arrange: Salviamo il primo utente
        User user1 = new User();
        user1.setNome("Mario");
        user1.setCognome("Rossi");
        user1.setEmail("mario.rossi@test.it");
        user1.setPassword("pass1");
        userRepository.save(user1);

        // 2. Arrange: Creiamo un secondo utente con la STESSA email
        User user2 = new User();
        user2.setNome("Luigi");
        user2.setCognome("Verdi");
        user2.setEmail("mario.rossi@test.it"); // Email duplicata!
        user2.setPassword("pass2");

        // 3. Act & Assert: Verifichiamo che il salvataggio scateni un'eccezione
        // Usiamo flush() per forzare la scrittura immediata sul DB e scatenare l'errore
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(user2);
        });
    }
}
