package com.bookstore.demo.repository;

import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;

@DataJpaTest
public class BookRepositoryTest {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private PublisherRepository publisherRepository;

    @SuppressWarnings("null")
    @Test
    public void testSearchBooks() {
        Author author = new Author();
        author.setNome("James");
        author.setCognome("Gosling");
        author = authorRepository.save(author);

        Publisher publisher = new Publisher();
        publisher.setNome("Addison-Wesley");
        publisher.setSede("Boston");
        publisher = publisherRepository.save(publisher);

        Book b1 = new Book();
        b1.setTitolo("Il linguaggio Java");
        b1.setIsbn10("1234567890");
        b1.setIsbn13("978-1234567890");
        b1.setPrezzo(29.99);
        b1.setAnno_pubblicazione(1995);
        b1.setStock(10);
        b1.setCategoria("Informatica");
        b1.setAutore(author);
        b1.setEditore(publisher);

        Book b2 = new Book();
        b2.setTitolo("Spring Boot in Action");
        b2.setIsbn10("0987654321");
        b2.setIsbn13("978-0987654321");
        b2.setPrezzo(35.00);
        b2.setAnno_pubblicazione(2015);
        b2.setStock(5);
        b2.setCategoria("Informatica");
        b2.setAutore(author);
        b2.setEditore(publisher);

        bookRepository.saveAll(List.of(b1, b2));

        List<Book> result = bookRepository.searchBooks("java");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitolo()).isEqualTo("Il linguaggio Java");
    }
}
