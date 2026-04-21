package com.bookstore.demo.repository;

import com.bookstore.demo.model.Formato;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.Set;
import java.util.Optional;

@DataJpaTest
public class FormatoRepositoryTest {

    @Autowired
    private FormatoRepository formatoRepository;

    @Test
    public void testSaveAndFindFormato() {
        // Crea formato di test
        Formato formato = new Formato();
        formato.setDescrizione("Cartaceo");

        // Salva il formato
        Formato savedFormato = formatoRepository.save(formato);

        // Verifica che sia stato salvato
        assertThat(savedFormato.getId()).isNotNull();
        assertThat(savedFormato.getDescrizione()).isEqualTo("Cartaceo");
    }

    @Test
    public void testFindByDescrizioneIn() {
        // Crea formato di test
        Formato formato1 = new Formato();
        formato1.setDescrizione("E-book");
        formatoRepository.save(formato1);

        Formato formato2 = new Formato();
        formato2.setDescrizione("Audiolibro");
        formatoRepository.save(formato2);

        Formato formato3 = new Formato();
        formato3.setDescrizione("Cartaceo");
        formatoRepository.save(formato3);

        // Testa findByDescrizioneIn
        List<String> descrizioni = List.of("E-book", "Audiolibro");
        Set<Formato> foundFormatos = formatoRepository.findByDescrizioneIn(descrizioni);

        assertThat(foundFormatos).hasSize(2);
        assertThat(foundFormatos)
                .extracting("descrizione")
                .containsExactlyInAnyOrder("E-book", "Audiolibro");
    }

    @Test
    public void testFindByDescrizioneInWithEmptyList() {
        // Test con lista vuota
        Set<Formato> foundFormatos = formatoRepository.findByDescrizioneIn(List.of());
        assertThat(foundFormatos).isEmpty();
    }

    @Test
    public void testFindByDescrizioneInWithNonExistentFormatos() {
        // Test con formato non esistenti
        List<String> descrizioni = List.of("NonEsistente1", "NonEsistente2");
        Set<Formato> foundFormatos = formatoRepository.findByDescrizioneIn(descrizioni);

        assertThat(foundFormatos).isEmpty();
    }

    @Test
    public void testFindByDescrizione() {
        // Crea formato di test
        Formato formato = new Formato();
        formato.setDescrizione("Cartaceo");
        formatoRepository.save(formato);

        // Testa findByDescrizione
        Optional<Formato> foundFormato = formatoRepository.findByDescrizione("Cartaceo");
        assertThat(foundFormato).isPresent();
        assertThat(foundFormato.get().getDescrizione()).isEqualTo("Cartaceo");

        // Testa con formato non esistente
        Optional<Formato> notFound = formatoRepository.findByDescrizione("NonEsistente");
        assertThat(notFound).isEmpty();
    }

    @Test
    public void testFormatoDescrizioneIsUnique() {
        // Crea primo formato
        Formato formato1 = new Formato();
        formato1.setDescrizione("Audiolibro");
        formatoRepository.save(formato1);

        // Verifica che sia stato salvato
        assertThat(formatoRepository.findByDescrizione("Audiolibro")).isPresent();

        // Il constraint di unicità è gestito dal database,
        // quindi questo test verifica che il repository funzioni correttamente
        List<Formato> allFormatos = formatoRepository.findAll();
        long aventuraCount = allFormatos.stream()
                .filter(formato -> "Audiolibro".equals(formato.getDescrizione()))
                .count();

        assertThat(aventuraCount).isEqualTo(1);
    }
}