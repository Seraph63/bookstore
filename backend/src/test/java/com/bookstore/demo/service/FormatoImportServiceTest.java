package com.bookstore.demo.service;

import com.bookstore.demo.model.Formato;
import com.bookstore.demo.repository.FormatoRepository;
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
class FormatoImportServiceTest {

    @Mock
    private FormatoRepository formatoRepository;

    @InjectMocks
    private FormatoImportService formatoImportService;

    private InputStream csv(String content) {
        return new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void importFromCsv_withValidRows_savesNewFormati() {
        String csvContent = "descrizione\nCartaceo\nDigitale\n";
        when(formatoRepository.existsByDescrizione("Cartaceo")).thenReturn(false);
        when(formatoRepository.existsByDescrizione("Digitale")).thenReturn(false);

        formatoImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Formato>> captor = ArgumentCaptor.forClass(List.class);
        verify(formatoRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(2);
        assertThat(captor.getValue().get(0).getDescrizione()).isEqualTo("Cartaceo");
    }

    @Test
    void importFromCsv_skipsDuplicates() {
        String csvContent = "descrizione\nCartaceo\n";
        when(formatoRepository.existsByDescrizione("Cartaceo")).thenReturn(true);

        formatoImportService.importFromCsv(csv(csvContent));

        verify(formatoRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withHeaderOnly_doesNotCallSaveAll() {
        String csvContent = "descrizione\n";

        formatoImportService.importFromCsv(csv(csvContent));

        verify(formatoRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withQuotedValues_stripsQuotes() {
        String csvContent = "descrizione\n\"Audiolibro\"\n";
        when(formatoRepository.existsByDescrizione("Audiolibro")).thenReturn(false);

        formatoImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Formato>> captor = ArgumentCaptor.forClass(List.class);
        verify(formatoRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getDescrizione()).isEqualTo("Audiolibro");
    }

    @Test
    void importFromCsv_withEmptyLines_skipsEmptyLines() {
        String csvContent = "descrizione\nCartaceo\n\nDigitale\n";
        when(formatoRepository.existsByDescrizione("Cartaceo")).thenReturn(false);
        when(formatoRepository.existsByDescrizione("Digitale")).thenReturn(false);

        formatoImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Formato>> captor = ArgumentCaptor.forClass(List.class);
        verify(formatoRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(2);
    }
}
