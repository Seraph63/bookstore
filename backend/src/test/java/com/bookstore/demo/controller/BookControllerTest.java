package com.bookstore.demo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.bookstore.demo.dto.book.BookResponse;
import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.service.IBookService;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@SuppressWarnings("null")
public class BookControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private IBookService bookService;

        @MockBean
        private BookRepository bookRepository;

        // Test dati di esempio
        private BookResponse createSampleBookResponse() {
                BookResponse response = new BookResponse();
                response.setId(1L);
                response.setTitolo("Il nome della rosa");
                response.setSottotitolo("Romanzo");
                response.setNomeAutore("Umberto");
                response.setCognomeAutore("Eco");
                response.setNomeEditore("Bompiani");
                response.setAnnoPubblicazione(1980);
                response.setIsbn10("1234567890");
                response.setIsbn13("1234567890123");
                response.setPrezzo(19.99);
                response.setPrezzoOriginale(24.99);
                response.setStock(100);
                response.setDisponibile(true);
                response.setCategoriaId(1L); // ID categoria
                response.setCategoria("Fiction"); // Descrizione categoria  
                response.setPercentualeSconto(20.0);
                return response;
        }

        private Book createSampleBook() {
                Book book = new Book();
                book.setId(1L);
                book.setTitolo("Il nome della rosa");

                Author author = new Author();
                author.setId(1L);
                author.setNome("Umberto");
                author.setCognome("Eco");
                book.setAutore(author);

                Publisher publisher = new Publisher();
                publisher.setId(1L);
                publisher.setNome("Bompiani");
                book.setEditore(publisher);

                return book;
        }

        @Test
        void testGetAllBooks() throws Exception {
                // Arrange
                BookResponse book1 = createSampleBookResponse();
                BookResponse book2 = createSampleBookResponse();
                book2.setId(2L);
                book2.setTitolo("La divina commedia");

                Page<BookResponse> mockPage = new PageImpl<>(
                                Arrays.asList(book1, book2),
                                PageRequest.of(0, 12),
                                2);

                when(bookService.getAllBooks(any())).thenReturn(mockPage);

                // Act & Assert
                mockMvc.perform(get("/api/books")
                                .param("page", "0")
                                .param("size", "12"))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.content").isArray())
                                .andExpect(jsonPath("$.content[0].id").value(1))
                                .andExpect(jsonPath("$.content[0].titolo").value("Il nome della rosa"))
                                .andExpect(jsonPath("$.content[1].titolo").value("La divina commedia"))
                                .andExpect(jsonPath("$.totalElements").value(2));
        }

        @Test
        void testGetBookById_Success() throws Exception {
                // Arrange
                BookResponse mockResponse = createSampleBookResponse();
                when(bookService.getBookById(1L)).thenReturn(mockResponse);

                // Act & Assert
                mockMvc.perform(get("/api/books/1"))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1))
                                .andExpect(jsonPath("$.titolo").value("Il nome della rosa"))
                                .andExpect(jsonPath("$.nomeAutore").value("Umberto"))
                                .andExpect(jsonPath("$.cognomeAutore").value("Eco"));
        }

        @Test
        void testGetBookById_NotFound() throws Exception {
                // Arrange
                when(bookService.getBookById(999L))
                                .thenThrow(new IllegalArgumentException("Libro con ID 999 non trovato"));

                // Act & Assert
                mockMvc.perform(get("/api/books/999"))
                                .andDo(print())
                                .andExpect(status().isNotFound());
        }

        @Test
        void testSearchBooks() throws Exception {
                // Arrange
                Book book1 = createSampleBook();
                List<Book> mockResults = Arrays.asList(book1);
                when(bookRepository.searchBooks("tolkien")).thenReturn(mockResults);

                // Act & Assert
                mockMvc.perform(get("/api/books/search")
                                .param("q", "tolkien"))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$[0].id").value(1))
                                .andExpect(jsonPath("$[0].titolo").value("Il nome della rosa"));
        }

        @Test
        void testCreateBook_Success() throws Exception {
                // Arrange
                String requestJson = """
                                {
                                    "titolo": "Il nuovo libro",
                                    "sottotitolo": "Un sottotitolo",
                                    "autoreId": 1,
                                    "editoreId": 1,
                                    "annoPubblicazione": 2024,
                                    "isbn10": "1234567890",
                                    "isbn13": "978-1234567890",
                                    "prezzo": 19.99,
                                    "prezzoOriginale": 24.99,
                                    "stock": 100,
                                    "categoria": "Fiction",
                                    "descrizione": "Una descrizione del libro"
                                }
                                """;

                BookResponse mockResponse = createSampleBookResponse();
                mockResponse.setTitolo("Il nuovo libro");

                when(bookService.createBook(any())).thenReturn(mockResponse);

                // Act & Assert
                mockMvc.perform(post("/api/books")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                                .andDo(print())
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.titolo").value("Il nuovo libro"))
                                .andExpect(jsonPath("$.nomeAutore").value("Umberto"));
        }

        @Test
        void testCreateBook_ValidationError() throws Exception {
                // Arrange - JSON con titolo mancante
                String invalidJson = """
                                {
                                    "autoreId": 1,
                                    "editoreId": 1,
                                    "prezzo": 19.99
                                }
                                """;

                // Act & Assert
                mockMvc.perform(post("/api/books")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(invalidJson))
                                .andDo(print())
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testUpdateBook_Success() throws Exception {
                // Arrange
                String requestJson = """
                                {
                                    "titolo": "Titolo aggiornato",
                                    "autoreId": 1,
                                    "editoreId": 1,
                                    "prezzo": 22.99
                                }
                                """;

                BookResponse mockResponse = createSampleBookResponse();
                mockResponse.setTitolo("Titolo aggiornato");
                mockResponse.setPrezzo(22.99);

                when(bookService.updateBook(eq(1L), any())).thenReturn(mockResponse);

                // Act & Assert
                mockMvc.perform(put("/api/books/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.titolo").value("Titolo aggiornato"))
                                .andExpect(jsonPath("$.prezzo").value(22.99));
        }

        @Test
        void testUpdateBook_NotFound() throws Exception {
                // Arrange
                String requestJson = """
                                {
                                    "titolo": "Titolo aggiornato",
                                    "autoreId": 1,
                                    "editoreId": 1,
                                    "prezzo": 22.99
                                }
                                """;

                when(bookService.updateBook(eq(999L), any()))
                                .thenThrow(new IllegalArgumentException("Libro con ID 999 non trovato"));

                // Act & Assert
                mockMvc.perform(put("/api/books/999")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                                .andDo(print())
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testDeleteBook_Success() throws Exception {
                // Arrange
                doNothing().when(bookService).deleteBook(1L);

                // Act & Assert
                mockMvc.perform(delete("/api/books/1"))
                                .andDo(print())
                                .andExpect(status().isNoContent());
        }

        @Test
        void testDeleteBook_NotFound() throws Exception {
                // Arrange
                doThrow(new IllegalArgumentException("Libro con ID 999 non trovato"))
                                .when(bookService).deleteBook(999L);

                // Act & Assert
                mockMvc.perform(delete("/api/books/999"))
                                .andDo(print())
                                .andExpect(status().isNotFound());
        }

        @Test
        void testSearchBooks_EmptyQuery() throws Exception {
                // Act & Assert
                mockMvc.perform(get("/api/books/search")
                                .param("q", ""))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$.length()").value(0));
        }
}