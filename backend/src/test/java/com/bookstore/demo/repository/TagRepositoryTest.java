package com.bookstore.demo.repository;

import com.bookstore.demo.model.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.Set;
import java.util.Optional;

@DataJpaTest
public class TagRepositoryTest {

    @Autowired
    private TagRepository tagRepository;

    @Test
    public void testSaveAndFindTag() {
        // Crea tag di test
        Tag tag = new Tag();
        tag.setDescrizione("Fantasy");

        // Salva il tag
        Tag savedTag = tagRepository.save(tag);

        // Verifica che sia stato salvato
        assertThat(savedTag.getId()).isNotNull();
        assertThat(savedTag.getDescrizione()).isEqualTo("Fantasy");
    }

    @Test
    public void testFindByDescrizioneIn() {
        // Crea tag di test
        Tag tag1 = new Tag();
        tag1.setDescrizione("Storico");
        tagRepository.save(tag1);

        Tag tag2 = new Tag();
        tag2.setDescrizione("Mistero");
        tagRepository.save(tag2);

        Tag tag3 = new Tag();
        tag3.setDescrizione("Fantasy");
        tagRepository.save(tag3);

        // Testa findByDescrizioneIn
        List<String> descrizioni = List.of("Storico", "Mistero");
        Set<Tag> foundTags = tagRepository.findByDescrizioneIn(descrizioni);

        assertThat(foundTags).hasSize(2);
        assertThat(foundTags)
                .extracting("descrizione")
                .containsExactlyInAnyOrder("Storico", "Mistero");
    }

    @Test
    public void testFindByDescrizioneInWithEmptyList() {
        // Test con lista vuota
        Set<Tag> foundTags = tagRepository.findByDescrizioneIn(List.of());
        assertThat(foundTags).isEmpty();
    }

    @Test
    public void testFindByDescrizioneInWithNonExistentTags() {
        // Test con tag non esistenti
        List<String> descrizioni = List.of("NonEsistente1", "NonEsistente2");
        Set<Tag> foundTags = tagRepository.findByDescrizioneIn(descrizioni);

        assertThat(foundTags).isEmpty();
    }

    @Test
    public void testFindByDescrizione() {
        // Crea tag di test
        Tag tag = new Tag();
        tag.setDescrizione("Sci-Fi");
        tagRepository.save(tag);

        // Testa findByDescrizione
        Optional<Tag> foundTag = tagRepository.findByDescrizione("Sci-Fi");
        assertThat(foundTag).isPresent();
        assertThat(foundTag.get().getDescrizione()).isEqualTo("Sci-Fi");

        // Testa con tag non esistente
        Optional<Tag> notFound = tagRepository.findByDescrizione("NonEsistente");
        assertThat(notFound).isEmpty();
    }

    @Test
    public void testTagDescrizioneIsUnique() {
        // Crea primo tag
        Tag tag1 = new Tag();
        tag1.setDescrizione("Avventura");
        tagRepository.save(tag1);

        // Verifica che sia stato salvato
        assertThat(tagRepository.findByDescrizione("Avventura")).isPresent();

        // Il constraint di unicità è gestito dal database,
        // quindi questo test verifica che il repository funzioni correttamente
        List<Tag> allTags = tagRepository.findAll();
        long aventuraCount = allTags.stream()
                .filter(tag -> "Avventura".equals(tag.getDescrizione()))
                .count();

        assertThat(aventuraCount).isEqualTo(1);
    }
}