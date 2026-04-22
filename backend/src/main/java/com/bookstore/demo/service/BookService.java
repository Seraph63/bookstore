package com.bookstore.demo.service;

import com.bookstore.demo.dto.book.BookCreateRequest;
import com.bookstore.demo.dto.book.BookUpdateRequest;
import com.bookstore.demo.dto.book.BookResponse;
import com.bookstore.demo.model.Author;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Publisher;
import com.bookstore.demo.model.Category;
import com.bookstore.demo.model.Tag;
import com.bookstore.demo.model.Formato;
import com.bookstore.demo.repository.AuthorRepository;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.PublisherRepository;
import com.bookstore.demo.repository.TagRepository;
import com.bookstore.demo.repository.CategoryRepository;
import com.bookstore.demo.repository.FormatoRepository;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService implements IBookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final FormatoRepository formatoRepository;

    public BookService(BookRepository bookRepository,
            AuthorRepository authorRepository,
            PublisherRepository publisherRepository,
            CategoryRepository categoryRepository,
            TagRepository tagRepository,
            FormatoRepository formatoRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.formatoRepository = formatoRepository;
    }

    @Transactional
    public BookResponse createBook(BookCreateRequest request) {
        // Valida che autore, editore e categoria esistano

        Author author = authorRepository.findById(request.getAutoreId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Autore con ID " + request.getAutoreId() + " non trovato"));

        Publisher publisher = publisherRepository.findById(request.getEditoreId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Editore con ID " + request.getEditoreId() + " non trovato"));

        Category category = categoryRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoria con ID " + request.getCategoriaId() + " non trovata"));

        // Gestione multipli tag IDs
        Set<Tag> tags = new HashSet<>();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            for (Long tagId : request.getTagIds()) {

                Tag tag = tagRepository.findById(tagId)
                        .orElseThrow(() -> new IllegalArgumentException("Tag con ID " + tagId + " non trovato"));
                tags.add(tag);
            }
        }

        // Gestione multipli formati IDs
        Set<Formato> formati = new HashSet<>();
        if (request.getFormatiIds() != null && !request.getFormatiIds().isEmpty()) {
            for (Long formatoId : request.getFormatiIds()) {

                Formato formato = formatoRepository.findById(formatoId)
                        .orElseThrow(
                                () -> new IllegalArgumentException("Formato con ID " + formatoId + " non trovato"));
                formati.add(formato);
            }
        }
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
        book.setCategoria(category);
        book.setAnno_pubblicazione(request.getAnnoPubblicazione());
        book.setIsbn10(request.getIsbn10());
        book.setIsbn13(request.getIsbn13());
        book.setFormato(formati);
        book.setPrezzo(request.getPrezzo().doubleValue());
        book.setPrezzo_originale(
                request.getPrezzoOriginale() != null ? request.getPrezzoOriginale().doubleValue() : null);
        book.setStock(request.getStock());
        book.setCopertinaUrl(request.getCopertinaUrl());
        book.setTag(tags); // Assegna il Set di tag
        book.setDescrizione(request.getDescrizione());

        // Salva nel database
        Book savedBook = bookRepository.save(book);

        // Converte a DTO Response
        return convertToResponse(savedBook);
    }

    @Transactional(readOnly = true)
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
    public BookResponse updateBook(Long id, BookUpdateRequest request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Libro con ID " + id + " non trovato"));

        // Valida che autore, editore e categoria esistano

        Author author = authorRepository.findById(request.getAutoreId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Autore con ID " + request.getAutoreId() + " non trovato"));

        Publisher publisher = publisherRepository.findById(request.getEditoreId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Editore con ID " + request.getEditoreId() + " non trovato"));

        Category category = categoryRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoria con ID " + request.getCategoriaId() + " non trovata"));

        // Gestione multipli tag IDs
        Set<Tag> tags = new HashSet<>();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            for (Long tagId : request.getTagIds()) {

                Tag tag = tagRepository.findById(tagId)
                        .orElseThrow(() -> new IllegalArgumentException("Tag con ID " + tagId + " non trovato"));
                tags.add(tag);
            }
        }

        // Gestione multipli formati IDs
        Set<Formato> formati = new HashSet<>();
        if (request.getFormatiIds() != null && !request.getFormatiIds().isEmpty()) {
            for (Long formatoId : request.getFormatiIds()) {

                Formato formato = formatoRepository.findById(formatoId)
                        .orElseThrow(
                                () -> new IllegalArgumentException("Formato con ID " + formatoId + " non trovato"));
                formati.add(formato);
            }
        }

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
        book.setCategoria(category); // Ora usa l'oggetto Category
        book.setAnno_pubblicazione(request.getAnnoPubblicazione());
        book.setIsbn10(request.getIsbn10());
        book.setIsbn13(request.getIsbn13());
        book.setFormato(formati); // Ora usa il Set di Formato
        book.setPrezzo(request.getPrezzo().doubleValue());
        book.setPrezzo_originale(
                request.getPrezzoOriginale() != null ? request.getPrezzoOriginale().doubleValue() : null);
        book.setStock(request.getStock());
        book.setCopertinaUrl(request.getCopertinaUrl());
        book.setTag(tags); // Assegna il Set di tag
        book.setDescrizione(request.getDescrizione());

        // Salva le modifiche
        Book updatedBook = bookRepository.save(book);

        // Converte a DTO Response
        return convertToResponse(updatedBook);
    }

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
        response.setPrezzo(book.getPrezzo());
        response.setPrezzoOriginale(book.getPrezzo_originale());
        response.setStock(book.getStock());
        response.setDisponibile(book.getStock() != null && book.getStock() > 0);
        response.setCopertinaUrl(book.getCopertinaUrl());
        response.setValutazioneMedia(book.getValutazione_media());
        response.setNumeroRecensioni(book.getNumero_recensioni());

        // Gestione categoria - ora è un oggetto
        if (book.getCategoria() != null) {
            response.setCategoriaId(book.getCategoria().getId());
            response.setCategoria(book.getCategoria().getDescrizione());
        }

        // Gestione tag - ora è un Set di oggetti
        if (book.getTag() != null && !book.getTag().isEmpty()) {
            // Concatena tutte le descrizioni dei tag
            String tagDescriptions = book.getTag().stream()
                    .map(Tag::getDescrizione)
                    .collect(Collectors.joining(", "));
            response.setTags(tagDescriptions);
        }

        // Gestione formati - ora è un Set di oggetti
        if (book.getFormato() != null && !book.getFormato().isEmpty()) {
            // Concatena tutte le descrizioni dei tag
            String formatoDescriptions = book.getFormato().stream()
                    .map(Formato::getDescrizione)
                    .collect(Collectors.joining(", "));
            response.setFormati(formatoDescriptions);
        }

        response.setDescrizione(book.getDescrizione());

        // Campi calcolati
        if (book.getPrezzo_originale() != null && book.getPrezzo() < book.getPrezzo_originale()) {
            double sconto = ((book.getPrezzo_originale() - book.getPrezzo()) / book.getPrezzo_originale()) * 100;
            response.setPercentualeSconto(Math.round(sconto * 100.0) / 100.0);
        }

        return response;
    }
}
