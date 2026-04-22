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

import com.bookstore.demo.model.Formato;
import com.bookstore.demo.repository.FormatoRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)

public class FormatoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private FormatoRepository formatoRepository;

    private Formato createSampleFormato() {
        Formato formato = new Formato();
        formato.setId(1L);
        formato.setDescrizione("Cartaceo");
        return formato;
    }

    @Test
    public void testGetAllFormati() throws Exception {
        // Prepara dati mock
        Formato formato1 = createSampleFormato();
        Formato formato2 = new Formato();
        formato2.setId(2L);
        formato2.setDescrizione("E-book");

        List<Formato> mockFormati = Arrays.asList(formato1, formato2);

        when(formatoRepository.findAll()).thenReturn(mockFormati);

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/formati"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].descrizione").value("Cartaceo"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].descrizione").value("E-book"));
    }

    @Test
    public void testGetAllFormatiWhenEmpty() throws Exception {
        // Prepara lista vuota
        when(formatoRepository.findAll()).thenReturn(Arrays.asList());

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/formati"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testGetFormatoById() throws Exception {
        // Prepara dati mock
        Formato mockFormato = createSampleFormato();
        when(formatoRepository.findById(1L)).thenReturn(Optional.of(mockFormato));

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/formati/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.descrizione").value("Cartaceo"));
    }

    @Test
    public void testGetFormatoByIdNotFound() throws Exception {
        // Mock formato non trovato
        when(formatoRepository.findById(999L)).thenReturn(Optional.empty());

        // Esegue la richiesta e verifica la risposta
        mockMvc.perform(get("/api/formati/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetFormatoByIdInvalidFormat() throws Exception {
        // Test con ID non valido
        mockMvc.perform(get("/api/formati/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testCorsEnabled() throws Exception {
        // Testa che CORS sia abilitato
        Formato mockFormato = createSampleFormato();
        when(formatoRepository.findAll()).thenReturn(Arrays.asList(mockFormato));

        mockMvc.perform(get("/api/formati")
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }
}
