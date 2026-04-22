package com.bookstore.demo.service;

import com.bookstore.demo.model.Category;
import com.bookstore.demo.repository.CategoryRepository;
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
class CategoryImportServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryImportService categoryImportService;

    private InputStream csv(String content) {
        return new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void importFromCsv_withValidRows_savesNewCategories() {
        String csvContent = "descrizione\nFantascienza\nRomanzi\n";
        when(categoryRepository.existsByDescrizione("Fantascienza")).thenReturn(false);
        when(categoryRepository.existsByDescrizione("Romanzi")).thenReturn(false);

        categoryImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Category>> captor = ArgumentCaptor.forClass(List.class);
        verify(categoryRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(2);
    }

    @Test
    void importFromCsv_skipsDuplicates() {
        String csvContent = "descrizione\nFantascienza\n";
        when(categoryRepository.existsByDescrizione("Fantascienza")).thenReturn(true);

        categoryImportService.importFromCsv(csv(csvContent));

        verify(categoryRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_withHeaderOnly_doesNotCallSaveAll() {
        String csvContent = "descrizione\n";

        categoryImportService.importFromCsv(csv(csvContent));

        verify(categoryRepository, never()).saveAll(anyList());
    }

    @Test
    void importFromCsv_setsDescrizioneFromFirstColumn() {
        String csvContent = "descrizione\nAvventura\n";
        when(categoryRepository.existsByDescrizione("Avventura")).thenReturn(false);

        categoryImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Category>> captor = ArgumentCaptor.forClass(List.class);
        verify(categoryRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getDescrizione()).isEqualTo("Avventura");
    }

    @Test
    void importFromCsv_withQuotedValues_stripsQuotes() {
        String csvContent = "descrizione\n\"Horror\"\n";
        when(categoryRepository.existsByDescrizione("Horror")).thenReturn(false);

        categoryImportService.importFromCsv(csv(csvContent));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Category>> captor = ArgumentCaptor.forClass(List.class);
        verify(categoryRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getDescrizione()).isEqualTo("Horror");
    }
}
