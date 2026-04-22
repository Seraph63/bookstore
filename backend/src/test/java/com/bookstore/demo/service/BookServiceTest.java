package com.bookstore.demo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.bookstore.demo.dto.book.BookCreateRequest;
import com.bookstore.demo.dto.book.BookUpdateRequest;
import com.bookstore.demo.dto.book.BookResponse;
import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Category;
import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.model.Tag;
import com.bookstore.demo.repository.AuthorRepository;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.CategoryRepository;
import com.bookstore.demo.repository.PublisherRepository;
import com.bookstore.demo.repository.TagRepository;
import com.bookstore.demo.repository.FormatoRepository;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

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

    private BookService bookService;

    private Author testAuthor;
    private Publisher testPublisher;
    private Category testCategory;
    private Tag testTag1;
    private Tag testTag2;

    @BeforeEach
    void setUp() {
        bookService = new BookService(bookRepository, authorRepository, publisherRepository,
                categoryRepository, tagRepository, formatoRepository);

        // Crea oggetti di test
        testAuthor = new Author();
        testAuthor.setId(1L);
        testAuthor.setNome("Test");
        testAuthor.setCognome("Author");

        testPublisher = new Publisher();
        testPublisher.setId(1L);
        testPublisher.setNome("Test Publisher");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setDescrizione("Test Category");

        testTag1 = new Tag();
        testTag1.setId(1L);
        testTag1.setDescrizione("Fantasy");

        testTag2 = new Tag();
        testTag2.setId(2L);
        testTag2.setDescrizione("Avventura");
    }

    @Test
    public void testCreateBookWithTags() {
        // Prepara request
        BookCreateRequest request = new BookCreateRequest();
        request.setTitolo("Test Book");
        request.setAutoreId(1L);
        request.setEditoreId(1L);
        request.setCategoriaId(1L);
        request.setTagIds(Set.of(1L, 2L));
        request.setIsbn10("1234567890");
        request.setPrezzo(BigDecimal.valueOf(19.99));
        request.setStock(10);

        // Mock repository calls
        when(authorRepository.findById(1L)).thenReturn(Optional.of(testAuthor));
        when(publisherRepository.findById(1L)).thenReturn(Optional.of(testPublisher));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(tagRepository.findById(1L)).thenReturn(Optional.of(testTag1));
        when(tagRepository.findById(2L)).thenReturn(Optional.of(testTag2));
        when(bookRepository.existsByIsbn10("1234567890")).thenReturn(false);

        // Mock saved book
        Book savedBook = new Book();
        savedBook.setId(1L);
        savedBook.setTitolo("Test Book");
        savedBook.setAutore(testAuthor);
        savedBook.setEditore(testPublisher);
        savedBook.setCategoria(testCategory);
        savedBook.setTag(Set.of(testTag1, testTag2));
        savedBook.setIsbn10("1234567890");
        savedBook.setPrezzo(19.99);
        savedBook.setStock(10);

        when(bookRepository.save(any(Book.class))).thenReturn(savedBook);

        // Execute
        BookResponse response = bookService.createBook(request);

        // Verify
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitolo()).isEqualTo("Test Book");
        assertThat(response.getTags()).contains("Fantasy").contains("Avventura");

        verify(tagRepository).findById(1L);
        verify(tagRepository).findById(2L);
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    public void testCreateBookWithoutTags() {
        // Prepara request senza tag
        BookCreateRequest request = new BookCreateRequest();
        request.setTitolo("Test Book No Tags");
        request.setAutoreId(1L);
        request.setEditoreId(1L);
        request.setCategoriaId(1L);
        request.setIsbn10("1234567891");
        request.setPrezzo(BigDecimal.valueOf(19.99));
        request.setStock(10);

        // Mock repository calls
        when(authorRepository.findById(1L)).thenReturn(Optional.of(testAuthor));
        when(publisherRepository.findById(1L)).thenReturn(Optional.of(testPublisher));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(bookRepository.existsByIsbn10("1234567891")).thenReturn(false);

        // Mock saved book
        Book savedBook = new Book();
        savedBook.setId(1L);
        savedBook.setTitolo("Test Book No Tags");
        savedBook.setAutore(testAuthor);
        savedBook.setEditore(testPublisher);
        savedBook.setCategoria(testCategory);
        savedBook.setTag(new HashSet<>()); // Set vuoto
        savedBook.setIsbn10("1234567891");
        savedBook.setPrezzo(19.99);
        savedBook.setStock(10);

        when(bookRepository.save(any(Book.class))).thenReturn(savedBook);

        // Execute
        BookResponse response = bookService.createBook(request);

        // Verify
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitolo()).isEqualTo("Test Book No Tags");
        assertThat(response.getTags()).isNull(); // Nessun tag

        verify(bookRepository).save(any(Book.class));
    }

    @Test
    public void testCreateBookWithInvalidTag() {
        // Prepara request con tag non esistente
        BookCreateRequest request = new BookCreateRequest();
        request.setTitolo("Test Book");
        request.setAutoreId(1L);
        request.setEditoreId(1L);
        request.setCategoriaId(1L);
        request.setTagIds(Set.of(999L)); // Tag non esistente
        request.setIsbn10("1234567892");
        request.setPrezzo(BigDecimal.valueOf(19.99));
        request.setStock(10);

        // Mock repository calls
        when(authorRepository.findById(1L)).thenReturn(Optional.of(testAuthor));
        when(publisherRepository.findById(1L)).thenReturn(Optional.of(testPublisher));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(tagRepository.findById(999L)).thenReturn(Optional.empty()); // Tag non trovato
        // bookRepository.existsByIsbn10 non viene chiamato perché l'eccezione viene
        // lanciata prima

        // Execute & Verify
        assertThatThrownBy(() -> bookService.createBook(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Tag con ID 999 non trovato");
    }

    @Test
    public void testUpdateBookWithDifferentTags() {
        // Prepara existing book
        Book existingBook = new Book();
        existingBook.setId(1L);
        existingBook.setTitolo("Existing Book");
        existingBook.setTag(Set.of(testTag1)); // Solo un tag

        // Prepara update request con tag diversi
        BookUpdateRequest request = new BookUpdateRequest();
        request.setTitolo("Updated Book");
        request.setAutoreId(1L);
        request.setEditoreId(1L);
        request.setCategoriaId(1L);
        request.setTagIds(Set.of(1L, 2L)); // Aggiungi secondo tag
        request.setIsbn10("1234567890");
        request.setPrezzo(BigDecimal.valueOf(24.99));
        request.setStock(15);

        // Mock repository calls
        when(bookRepository.findById(1L)).thenReturn(Optional.of(existingBook));
        when(authorRepository.findById(1L)).thenReturn(Optional.of(testAuthor));
        when(publisherRepository.findById(1L)).thenReturn(Optional.of(testPublisher));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(tagRepository.findById(1L)).thenReturn(Optional.of(testTag1));
        when(tagRepository.findById(2L)).thenReturn(Optional.of(testTag2));

        // Mock updated book
        Book updatedBook = new Book();
        updatedBook.setId(1L);
        updatedBook.setTitolo("Updated Book");
        updatedBook.setAutore(testAuthor);
        updatedBook.setEditore(testPublisher);
        updatedBook.setCategoria(testCategory);
        updatedBook.setTag(Set.of(testTag1, testTag2)); // Due tag
        updatedBook.setIsbn10("1234567890");
        updatedBook.setPrezzo(24.99);
        updatedBook.setStock(15);

        when(bookRepository.save(any(Book.class))).thenReturn(updatedBook);

        // Execute
        BookResponse response = bookService.updateBook(1L, request);

        // Verify
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitolo()).isEqualTo("Updated Book");
        assertThat(response.getTags()).contains("Fantasy").contains("Avventura");

        verify(tagRepository).findById(1L);
        verify(tagRepository).findById(2L);
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    public void testConvertToResponseWithMultipleTags() {
        // Prepara book con tag multipli
        Book book = new Book();
        book.setId(1L);
        book.setTitolo("Multi-tag Book");
        book.setAutore(testAuthor);
        book.setEditore(testPublisher);
        book.setCategoria(testCategory);
        book.setTag(Set.of(testTag1, testTag2));
        book.setPrezzo(29.99);
        book.setStock(5);

        // Mock repository call
        when(bookRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(book));

        // Execute
        BookResponse response = bookService.getBookById(1L);

        // Verify tags are concatenated correctly (order may vary due to Set)
        assertThat(response.getTags()).contains("Fantasy").contains("Avventura");
        assertThat(response.getCategoriaId()).isEqualTo(1L);
        assertThat(response.getCategoria()).isEqualTo("Test Category");
    }

    @Test
    public void testConvertToResponseWithoutTags() {
        // Prepara book senza tag
        Book book = new Book();
        book.setId(1L);
        book.setTitolo("No-tag Book");
        book.setAutore(testAuthor);
        book.setEditore(testPublisher);
        book.setCategoria(testCategory);
        book.setTag(new HashSet<>()); // Set vuoto
        book.setPrezzo(19.99);
        book.setStock(3);

        // Mock repository call
        when(bookRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(book));

        // Execute
        BookResponse response = bookService.getBookById(1L);

        // Verify no tags
        assertThat(response.getTags()).isNull();
        assertThat(response.getCategoriaId()).isEqualTo(1L);
        assertThat(response.getCategoria()).isEqualTo("Test Category");
    }
}