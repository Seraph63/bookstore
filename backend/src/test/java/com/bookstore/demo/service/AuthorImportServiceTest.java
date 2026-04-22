package com.bookstore.demo.service;

import com.bookstore.demo.model.Author;
import com.bookstore.demo.repository.AuthorRepository;
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
class AuthorImportServiceTest {

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private AuthorImportService authorImportService;

    private InputStream csv(String content) {
        return new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void importFromCsv_withValidRows_savesNewAuthors() {
        String csvContent = "nome,cognome,biografia\nUmberto,Eco,Semiologo e scrittore\nItalo,Calvino,Narratore italiano\n";
        when(authorRepository.existsByNomeAndCognome("Umberto", "Eco")).thenReturn(false);
        when(authorRepository.existsByNomeAndCognome("Italo", "Calvino")).thenReturn(false);

        authorImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Author>> captor = ArgumentCaptor.forClass(List.class);
        verify(authorRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(2);
        assertThat(captor.getValue().get(0).getNome()).isEqualTo("Umberto");
        assertThat(captor.getValue().get(0).getCognome()).isEqualTo("Eco");
        assertThat(captor.getValue().get(1).getNome()).isEqualTo("Italo");
    }

    @Test
    void importFromCsv_skipsDuplicates() {
        String csvContent = "nome,cognome\nUmberto,Eco\n";
        when(authorRepository.existsByNomeAndCognome("Umberto", "Eco")).thenReturn(true);

        authorImportService.importFromCsv(csv(csvContent));

        verify(authorRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withoutBiografiaColumn_setsDefaultBiografia() {
        String csvContent = "nome,cognome\nUmberto,Eco\n";
        when(authorRepository.existsByNomeAndCognome("Umberto", "Eco")).thenReturn(false);

        authorImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Author>> captor = ArgumentCaptor.forClass(List.class);
        verify(authorRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getBiografia()).isEqualTo("Biografia non disponibile");
    }

    @Test
    void importFromCsv_withHeaderOnly_doesNotCallSaveAll() {
        String csvContent = "nome,cognome,biografia\n";

        authorImportService.importFromCsv(csv(csvContent));

        verify(authorRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withEmptyLines_skipsEmptyLines() {
        String csvContent = "nome,cognome\nUmberto,Eco\n\n";
        when(authorRepository.existsByNomeAndCognome("Umberto", "Eco")).thenReturn(false);

        authorImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Author>> captor = ArgumentCaptor.forClass(List.class);
        verify(authorRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(1);
    }

    @Test
    void importFromCsv_withQuotedFields_stripsQuotes() {
        String csvContent = "nome,cognome\n\"Umberto\",\"Eco\"\n";
        when(authorRepository.existsByNomeAndCognome("Umberto", "Eco")).thenReturn(false);

        authorImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Author>> captor = ArgumentCaptor.forClass(List.class);
        verify(authorRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getNome()).isEqualTo("Umberto");
    }
}
