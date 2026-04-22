package com.bookstore.demo.service;

import com.bookstore.demo.model.Tag;
import com.bookstore.demo.repository.TagRepository;
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
class TagImportServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagImportService tagImportService;

    private InputStream csv(String content) {
        return new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void importFromCsv_withValidRows_savesNewTags() {
        String csvContent = "descrizione\nFantasy\nAvventura\n";
        when(tagRepository.existsByDescrizione("Fantasy")).thenReturn(false);
        when(tagRepository.existsByDescrizione("Avventura")).thenReturn(false);

        tagImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Tag>> captor = ArgumentCaptor.forClass(List.class);
        verify(tagRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(2);
        assertThat(captor.getValue().get(0).getDescrizione()).isEqualTo("Fantasy");
    }

    @Test
    void importFromCsv_skipsDuplicates() {
        String csvContent = "descrizione\nFantasy\n";
        when(tagRepository.existsByDescrizione("Fantasy")).thenReturn(true);

        tagImportService.importFromCsv(csv(csvContent));

        verify(tagRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withHeaderOnly_doesNotCallSaveAll() {
        String csvContent = "descrizione\n";

        tagImportService.importFromCsv(csv(csvContent));

        verify(tagRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withQuotedValues_stripsQuotes() {
        String csvContent = "descrizione\n\"Thriller\"\n";
        when(tagRepository.existsByDescrizione("Thriller")).thenReturn(false);

        tagImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Tag>> captor = ArgumentCaptor.forClass(List.class);
        verify(tagRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getDescrizione()).isEqualTo("Thriller");
    }

    @Test
    void importFromCsv_withEmptyLines_skipsEmptyLines() {
        String csvContent = "descrizione\nFantasy\n\nStorico\n";
        when(tagRepository.existsByDescrizione("Fantasy")).thenReturn(false);
        when(tagRepository.existsByDescrizione("Storico")).thenReturn(false);

        tagImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Tag>> captor = ArgumentCaptor.forClass(List.class);
        verify(tagRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(2);
    }
}
