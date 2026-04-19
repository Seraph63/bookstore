package com.bookstore.demo.service;

import com.bookstore.demo.dto.book.BookCreateRequest;
import com.bookstore.demo.dto.book.BookResponse;
import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.repository.AuthorRepository;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.PublisherRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService implements IBookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;

    public BookService(BookRepository bookRepository,
            AuthorRepository authorRepository,
            PublisherRepository publisherRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
    }

    @Transactional
    public BookResponse createBook(BookCreateRequest request) {
        // Valida che autore e editore esistano
        @SuppressWarnings("null")
        Author author = authorRepository.findById(request.getAutoreId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Autore con ID " + request.getAutoreId() + " non trovato"));

        @SuppressWarnings("null")
        Publisher publisher = publisherRepository.findById(request.getEditoreId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Editore con ID " + request.getEditoreId() + " non trovato"));

        // Controlla duplicati ISBN
        if (bookRepository.existsByIsbn10(request.getIsbn10())) {
            throw new IllegalArgumentException("Un libro con ISBN-10 " + request.getIsbn10() + " esiste già");
        }

        // Crea entità Book
        Book book = new Book();
        book.setTitolo(request.getTitolo());
        book.setSottotitolo(request.getSottotitolo());
        book.setAutore(author);
        book.setEditore(publisher);
        book.setAnno_pubblicazione(request.getAnnoPubblicazione());
        book.setIsbn10(request.getIsbn10());
        book.setIsbn13(request.getIsbn13());
        book.setFormati(request.getFormati());
        book.setPrezzo(request.getPrezzo().doubleValue());
        book.setPrezzo_originale(
                request.getPrezzoOriginale() != null ? request.getPrezzoOriginale().doubleValue() : null);
        book.setStock(request.getStock());
        book.setCopertinaUrl(request.getCopertinaUrl());
        book.setCategoria(request.getCategoria());
        book.setTags(request.getTags());
        book.setDescrizione(request.getDescrizione());

        // Salva nel database
        Book savedBook = bookRepository.save(book);

        // Converte a DTO Response
        return convertToResponse(savedBook);
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new IllegalArgumentException("Libro con ID " + id + " non trovato"));
        return convertToResponse(book);
    }

    public Page<BookResponse> getAllBooks(Pageable pageable) {
        Page<Book> books = bookRepository.findAllWithDetails(pageable);
        return books.map(this::convertToResponse);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookCreateRequest request) {
        @SuppressWarnings("null")
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Libro con ID " + id + " non trovato"));

        // Valida che autore e editore esistano
        @SuppressWarnings("null")
        Author author = authorRepository.findById(request.getAutoreId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Autore con ID " + request.getAutoreId() + " non trovato"));

        @SuppressWarnings("null")
        Publisher publisher = publisherRepository.findById(request.getEditoreId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Editore con ID " + request.getEditoreId() + " non trovato"));

        // Controlla duplicati ISBN (escludendo il libro corrente)
        if (request.getIsbn10() != null && !request.getIsbn10().equals(book.getIsbn10()) &&
                bookRepository.existsByIsbn10(request.getIsbn10())) {
            throw new IllegalArgumentException("Un libro con ISBN-10 " + request.getIsbn10() + " esiste già");
        }

        // Aggiorna i campi del libro
        book.setTitolo(request.getTitolo());
        book.setSottotitolo(request.getSottotitolo());
        book.setAutore(author);
        book.setEditore(publisher);
        book.setAnno_pubblicazione(request.getAnnoPubblicazione());
        book.setIsbn10(request.getIsbn10());
        book.setIsbn13(request.getIsbn13());
        book.setFormati(request.getFormati());
        book.setPrezzo(request.getPrezzo().doubleValue());
        book.setPrezzo_originale(
                request.getPrezzoOriginale() != null ? request.getPrezzoOriginale().doubleValue() : null);
        book.setStock(request.getStock());
        book.setCopertinaUrl(request.getCopertinaUrl());
        book.setCategoria(request.getCategoria());
        book.setTags(request.getTags());
        book.setDescrizione(request.getDescrizione());

        // Salva le modifiche
        Book updatedBook = bookRepository.save(book);

        // Converte a DTO Response
        return convertToResponse(updatedBook);
    }

    @SuppressWarnings("null")
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("Libro con ID " + id + " non trovato");
        }
        bookRepository.deleteById(id);
    }

    // Metodo di utilità per convertire Book -> BookResponse
    private BookResponse convertToResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitolo(book.getTitolo());
        response.setSottotitolo(book.getSottotitolo());
        response.setAutoreId(book.getAutore().getId());
        response.setNomeAutore(book.getAutore().getNome());
        response.setCognomeAutore(book.getAutore().getCognome());
        response.setEditoreId(book.getEditore().getId());
        response.setNomeEditore(book.getEditore().getNome());
        response.setAnnoPubblicazione(book.getAnno_pubblicazione());
        response.setIsbn10(book.getIsbn10());
        response.setIsbn13(book.getIsbn13());
        response.setFormati(book.getFormati());
        response.setPrezzo(book.getPrezzo());
        response.setPrezzoOriginale(book.getPrezzo_originale());
        response.setStock(book.getStock());
        response.setDisponibile(book.getStock() != null && book.getStock() > 0);
        response.setCopertinaUrl(book.getCopertinaUrl());
        response.setValutazioneMedia(book.getValutazione_media());
        response.setNumeroRecensioni(book.getNumero_recensioni());
        response.setCategoria(book.getCategoria());
        response.setTags(book.getTags());
        response.setDescrizione(book.getDescrizione());

        // Campi calcolati
        if (book.getPrezzo_originale() != null && book.getPrezzo() < book.getPrezzo_originale()) {
            double sconto = ((book.getPrezzo_originale() - book.getPrezzo()) / book.getPrezzo_originale()) * 100;
            response.setPercentualeSconto(Math.round(sconto * 100.0) / 100.0);
        }

        return response;
    }
}
