package com.bookstore.demo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.bookstore.demo.model.Tag;
import com.bookstore.demo.repository.TagRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class TagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private TagRepository tagRepository;

    private Tag createSampleTag() {
        Tag tag = new Tag();
        tag.setId(1L);
        tag.setDescrizione("Fantasy");
        return tag;
    }

    @Test
    public void testGetAllTags() throws Exception {
        // Prepara dati mock
        Tag tag1 = createSampleTag();
        Tag tag2 = new Tag();
        tag2.setId(2L);
        tag2.setDescrizione("Sci-Fi");

        List<Tag> mockTags = Arrays.asList(tag1, tag2);

        when(tagRepository.findAll()).thenReturn(mockTags);

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/tag"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].descrizione").value("Fantasy"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].descrizione").value("Sci-Fi"));
    }

    @Test
    public void testGetAllTagsWhenEmpty() throws Exception {
        // Prepara lista vuota
        when(tagRepository.findAll()).thenReturn(Arrays.asList());

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/tag"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testGetTagById() throws Exception {
        // Prepara dati mock
        Tag mockTag = createSampleTag();
        when(tagRepository.findById(1L)).thenReturn(Optional.of(mockTag));

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/tag/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.descrizione").value("Fantasy"));
    }

    @Test
    public void testGetTagByIdNotFound() throws Exception {
        // Mock tag non trovato
        when(tagRepository.findById(999L)).thenReturn(Optional.empty());

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/tag/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetTagByIdInvalidFormat() throws Exception {
        // Test con ID non valido
        mockMvc.perform(get("/api/tag/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testCorsEnabled() throws Exception {
        // Testa che CORS sia abilitato
        Tag mockTag = createSampleTag();
        when(tagRepository.findAll()).thenReturn(Arrays.asList(mockTag));

        mockMvc.perform(get("/api/tag")
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }
}
