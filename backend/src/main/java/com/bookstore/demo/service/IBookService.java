package com.bookstore.demo.service;

import com.bookstore.demo.dto.book.BookCreateRequest;
import com.bookstore.demo.dto.book.BookUpdateRequest;
import com.bookstore.demo.dto.book.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IBookService {

    BookResponse createBook(BookCreateRequest request);

    BookResponse getBookById(Long id);

    Page<BookResponse> getAllBooks(Pageable pageable);

    BookResponse updateBook(Long id, BookUpdateRequest request);

    void deleteBook(Long id);
}