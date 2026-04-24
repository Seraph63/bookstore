package com.bookstore.demo.dto.cart;

import com.bookstore.demo.dto.book.BookSummaryResponse;
import com.bookstore.demo.model.CartItem;

public class CartItemResponse {

    private Long id;
    private BookSummaryResponse book;
    private Integer quantita;

    public CartItemResponse() {
    }

    public static CartItemResponse fromEntity(CartItem item) {
        CartItemResponse dto = new CartItemResponse();
        dto.setId(item.getId());
        dto.setQuantita(item.getQuantita());
        if (item.getBook() != null) {
            dto.setBook(BookSummaryResponse.fromEntity(item.getBook()));
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BookSummaryResponse getBook() {
        return book;
    }

    public void setBook(BookSummaryResponse book) {
        this.book = book;
    }

    public Integer getQuantita() {
        return quantita;
    }

    public void setQuantita(Integer quantita) {
        this.quantita = quantita;
    }
}
