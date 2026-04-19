package com.bookstore.demo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
// addFilters = false evita che Spring Security blocchi la chiamata simulata
@AutoConfigureMockMvc(addFilters = false)
@SuppressWarnings("null")

public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testLoginSuccess() throws Exception {
        // 1. Arrange: Prepariamo l'utente con password HASHATA
        User mockUser = new User();
        mockUser.setEmail("mario@test.it");
        // Generiamo l'hash corretto per "password123"
        mockUser.setPassword(passwordEncoder.encode("password123")); 
        
        when(userRepository.findByEmail("mario@test.it")).thenReturn(Optional.of(mockUser));

        // 2. Act & Assert
        String loginJson = "{\"email\":\"mario@test.it\", \"password\":\"password123\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(loginJson))
                .andDo(print()) // Ora vedrai il JSON dell'utente nel body!
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("mario@test.it"));
    }
    @Test
    void testLoginFailureUserNotFound() throws Exception {
        // 1. Arrange: Simuliamo che l'email non sia presente nel DB
        when(userRepository.findByEmail("non.esiste@test.it")).thenReturn(Optional.empty());

        // 2. Act & Assert: Inviamo la richiesta
        String loginJson = "{\"email\":\"non.esiste@test.it\", \"password\":\"qualunque\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(loginJson))
                .andExpect(status().isUnauthorized()) // Verifica codice 401
                .andExpect(jsonPath("$.error").value("Account non trovato")); // Verifica il messaggio
    }

    @Test
    void testLoginFailureWrongPassword() throws Exception {
        // 1. Arrange: Prepariamo un utente mockato nel DB
        User mockUser = new User();
        mockUser.setEmail("mario@test.it");
        mockUser.setPassword(passwordEncoder.encode("password_giusta")); // Password hashata
        
        when(userRepository.findByEmail("mario@test.it")).thenReturn(Optional.of(mockUser));

        // 2. Act & Assert: Inviamo la password SBAGLIATA
        String loginJson = "{\"email\":\"mario@test.it\", \"password\":\"password_errata\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(loginJson))
                .andExpect(status().isUnauthorized()) // Verifica codice 401
                .andExpect(jsonPath("$.error").value("Password errata")); // Verifica il messaggio
    }
    @Test
    void testRegisterNewUser() throws Exception {
        // 1. Arrange: Prepariamo i dati della richiesta (JSON)
        String registerJson = """
            {
                "nome": "Luca",
                "cognome": "Bianchi",
                "email": "luca.bianchi@test.it",
                "password": "passwordSicura123"
            }
            """;

        // Simuliamo che l'email non sia già presente
        when(userRepository.findByEmail("luca.bianchi@test.it")).thenReturn(Optional.empty());
        
        // Mockiamo il salvataggio restituendo l'utente stesso
        when(userRepository.save(any(User.class))).thenAnswer(i -> (User) i.getArguments()[0]);

        // 2. Act & Assert: Eseguiamo la chiamata POST
        mockMvc.perform(post("/api/auth/register")
                .contentType("application/json")
                .content(registerJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("luca.bianchi@test.it"))
                .andExpect(jsonPath("$.nome").value("Luca"));

        // 3. Verifica aggiuntiva: Verifichiamo che la password sia stata criptata
        // Recuperiamo l'argomento passato a userRepository.save()
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        
        User savedUser = userCaptor.getValue();
        assertThat(savedUser).isNotNull();
        String passwordSalvata = savedUser.getPassword();
        
        // La password salvata NON deve essere uguale a "passwordSicura123"
        assertThat(passwordSalvata).isNotEqualTo("passwordSicura123");
        // Deve però essere una password valida per l'encoder (inizia tipicamente con $2a$)
        assertThat(passwordEncoder.matches("passwordSicura123", passwordSalvata)).isTrue();
    }
}