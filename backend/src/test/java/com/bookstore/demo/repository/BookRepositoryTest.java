package com.bookstore.demo.repository;

import com.bookstore.demo.model.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;

@SuppressWarnings("null")
@SpringBootTest
public class BookRepositoryTest {
    @Autowired
    private BookRepository bookRepository;

    @Test
    public void testSearchBooks() {
        // 1. Arrange: Creiamo i dati
        Book b1 = new Book();
        b1.setTitolo("Il linguaggio Java");
        
        Book b2 = new Book();
        b2.setTitolo("Spring Boot in Action");

        // Salvataggio (con cast per evitare il warning di VS Code)
        bookRepository.saveAll((Iterable<Book>) List.of(b1, b2));

        // 2. Act: Eseguiamo la ricerca tramite il metodo searchBooks
        List<Book> result = bookRepository.searchBooks("java");

        // 3. Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitolo()).isEqualTo("Il linguaggio Java");
    }
}
