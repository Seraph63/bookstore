package com.bookstore.demo.service;

import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserImportServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserImportService userImportService;

    private InputStream csv(String content) {
        return new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
    }

    // CSV format:
    // nome,cognome,username,email,password,ruolo[,attivo[,dataRegistrazione]]
    @Test
    void importFromCsv_withValidRow_savesUser() {
        String csvContent = "nome,cognome,username,email,password,ruolo\nMario,Rossi,mario,mario@test.it,secret,USER\n";
        when(userRepository.existsByUsername("mario")).thenReturn(false);
        when(userRepository.existsByEmail("mario@test.it")).thenReturn(false);

        userImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<User>> captor = ArgumentCaptor.forClass(List.class);
        verify(userRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(1);
        User saved = captor.getValue().get(0);
        assertThat(saved.getNome()).isEqualTo("Mario");
        assertThat(saved.getCognome()).isEqualTo("Rossi");
        assertThat(saved.getUsername()).isEqualTo("mario");
        assertThat(saved.getEmail()).isEqualTo("mario@test.it");
        assertThat(saved.getRuolo()).isEqualTo("USER");
        // Password should be BCrypt-encoded (starts with $2a$)
        assertThat(saved.getPassword()).startsWith("$2a$");
        // Default attivo = true
        assertThat(saved.getAttivo()).isTrue();
    }

    @Test
    void importFromCsv_withExplicitAttivo_parsesAttivoField() {
        String csvContent = "nome,cognome,username,email,password,ruolo,attivo\nMario,Rossi,mario2,mario2@test.it,secret,USER,false\n";
        when(userRepository.existsByUsername("mario2")).thenReturn(false);
        when(userRepository.existsByEmail("mario2@test.it")).thenReturn(false);

        userImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<User>> captor = ArgumentCaptor.forClass(List.class);
        verify(userRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getAttivo()).isFalse();
    }

    @Test
    void importFromCsv_skipsDuplicateUsername() {
        String csvContent = "nome,cognome,username,email,password,ruolo\nMario,Rossi,mario,mario@test.it,secret,USER\n";
        when(userRepository.existsByUsername("mario")).thenReturn(true);

        userImportService.importFromCsv(csv(csvContent));

        verify(userRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_skipsDuplicateEmail() {
        String csvContent = "nome,cognome,username,email,password,ruolo\nMario,Rossi,mario,mario@test.it,secret,USER\n";
        when(userRepository.existsByUsername("mario")).thenReturn(false);
        when(userRepository.existsByEmail("mario@test.it")).thenReturn(true);

        userImportService.importFromCsv(csv(csvContent));

        verify(userRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withHeaderOnly_doesNotCallSaveAll() {
        String csvContent = "nome,cognome,username,email,password,ruolo\n";

        userImportService.importFromCsv(csv(csvContent));

        verify(userRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withRowMissingFields_skipsIncompleteRow() {
        // Only 3 fields — not enough (requires >= 6)
        String csvContent = "nome,cognome,username\nMario,Rossi,mario\n";

        userImportService.importFromCsv(csv(csvContent));

        verify(userRepository, never()).saveAll(anyList());
    }

    @Test
    void hashPassword_returnsNonNullBCryptHash() {
        String hash = userImportService.hashPassword("mypassword");

        assertThat(hash).isNotNull().startsWith("$2a$");
    }

    @Test
    void hashPassword_differentCallsProduceDifferentHashes() {
        // BCrypt uses random salt — two hashes of same password must differ
        String hash1 = userImportService.hashPassword("password");
        String hash2 = userImportService.hashPassword("password");

        assertThat(hash1).isNotEqualTo(hash2);
    }
}
