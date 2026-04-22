package com.bookstore.demo.service;

import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.repository.PublisherRepository;
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
class PublisherImportServiceTest {

    @Mock
    private PublisherRepository publisherRepository;

    @InjectMocks
    private PublisherImportService publisherImportService;

    private InputStream csv(String content) {
        return new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void importFromCsv_withValidRows_savesNewPublishers() {
        String csvContent = "nome,sede\nMondadori,Milano\nEinaudi,Torino\n";
        when(publisherRepository.existsByNome("Mondadori")).thenReturn(false);
        when(publisherRepository.existsByNome("Einaudi")).thenReturn(false);

        publisherImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Publisher>> captor = ArgumentCaptor.forClass(List.class);
        verify(publisherRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(2);
        assertThat(captor.getValue().get(0).getNome()).isEqualTo("Mondadori");
        assertThat(captor.getValue().get(0).getSede()).isEqualTo("Milano");
    }

    @Test
    void importFromCsv_withoutSedeColumn_setsDefaultSede() {
        String csvContent = "nome\nRizzoli\n";
        when(publisherRepository.existsByNome("Rizzoli")).thenReturn(false);

        publisherImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Publisher>> captor = ArgumentCaptor.forClass(List.class);
        verify(publisherRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getSede()).isEqualTo("Sede non specificata");
    }

    @Test
    void importFromCsv_skipsDuplicates() {
        String csvContent = "nome,sede\nMondadori,Milano\n";
        when(publisherRepository.existsByNome("Mondadori")).thenReturn(true);

        publisherImportService.importFromCsv(csv(csvContent));

        verify(publisherRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withHeaderOnly_doesNotCallSaveAll() {
        String csvContent = "nome,sede\n";

        publisherImportService.importFromCsv(csv(csvContent));

        verify(publisherRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withQuotedFields_stripsQuotes() {
        String csvContent = "nome,sede\n\"Bompiani\",\"Roma\"\n";
        when(publisherRepository.existsByNome("Bompiani")).thenReturn(false);

        publisherImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Publisher>> captor = ArgumentCaptor.forClass(List.class);
        verify(publisherRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getNome()).isEqualTo("Bompiani");
        assertThat(captor.getValue().get(0).getSede()).isEqualTo("Roma");
    }
}
