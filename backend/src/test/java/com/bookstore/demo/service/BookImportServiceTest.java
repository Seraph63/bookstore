package com.bookstore.demo.service;

import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Category;
import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.repository.AuthorRepository;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.CategoryRepository;
import com.bookstore.demo.repository.FormatoRepository;
import com.bookstore.demo.repository.PublisherRepository;
import com.bookstore.demo.repository.TagRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
public class BookImportServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private PublisherRepository publisherRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private FormatoRepository formatoRepository;

    @InjectMocks
    private BookImportService bookImportService;

    @Test
    void testImportCsvWithRealRows() throws Exception {
        Author mockAuthor = new Author();
        mockAuthor.setId(1L);
        mockAuthor.setNome("Test");
        mockAuthor.setCognome("Author");

        Publisher mockPublisher = new Publisher();
        mockPublisher.setId(1L);
        mockPublisher.setNome("Test Publisher");
        mockPublisher.setSede("Roma");

        Category mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setDescrizione("Ragazzi");

        when(formatoRepository.count()).thenReturn(1L);
        when(authorRepository.findById(1L)).thenReturn(Optional.of(mockAuthor));
        when(publisherRepository.findById(1L)).thenReturn(Optional.of(mockPublisher));
        when(categoryRepository.findById(0L)).thenReturn(Optional.of(mockCategory));

        String csvContent = "header_dummy\n"
                + "\"Il Piccolo Principe\",\"\",\"1\",\"1\",1943,\"8845296539\",\"978-8845296536\",\"Cartaceo\",7.65,9.00,500,\"https://picsum.photos/seed/9/400/600\",4.9,12000,\"Ragazzi\",\"Poesia|Favola\",\"Un pilota cade nel deserto.\"\n"
                + "\"Moby Dick\",\"La Balena Bianca\",\"1\",\"1\",1851,\"8845915441\",\"978-8845915444\",\"Cartaceo|Audiobook\",18.70,22.00,12,\"https://picsum.photos/seed/10/400/600\",4.5,900,\"Classico\",\"Avventura|Mare\",\"La caccia folle del Capitano Achab.\"\n"
                + "\"Don Chisciotte\",\"\",\"1\",\"1\",1605,\"8806223123\",\"978-8806223120\",\"Cartaceo\",24.00,24.00,8,\"https://picsum.photos/seed/11/400/600\",4.6,1100,\"Classico\",\"Satira|Cavalleria\",\"Le avventure del cavaliere errante.\"";

        InputStream inputStream = new ByteArrayInputStream(csvContent.getBytes(StandardCharsets.UTF_8));

        bookImportService.importFromCsv(inputStream);

        verify(bookRepository, times(3)).save(any(Book.class));
    }
}
