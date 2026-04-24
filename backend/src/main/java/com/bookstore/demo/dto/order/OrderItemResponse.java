package com.bookstore.demo.dto.order;

import com.bookstore.demo.dto.book.BookSummaryResponse;
import com.bookstore.demo.model.OrderItem;

public class OrderItemResponse {

    private Long id;
    private BookSummaryResponse book;
    private Integer quantita;
    private Double prezzoUnitario;

    public OrderItemResponse() {
    }

    public static OrderItemResponse fromEntity(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(item.getId());
        dto.setQuantita(item.getQuantita());
        dto.setPrezzoUnitario(item.getPrezzoUnitario());
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

    public Double getPrezzoUnitario() {
        return prezzoUnitario;
    }

    public void setPrezzoUnitario(Double prezzoUnitario) {
        this.prezzoUnitario = prezzoUnitario;
    }
}
