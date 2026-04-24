package com.bookstore.demo.dto.cart;

import com.bookstore.demo.model.Cart;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CartResponse {

    private Long id;
    private List<CartItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CartResponse() {
    }

    public static CartResponse fromEntity(Cart cart) {
        CartResponse dto = new CartResponse();
        dto.setId(cart.getId());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());
        if (cart.getItems() != null) {
            dto.setItems(cart.getItems().stream()
                    .map(CartItemResponse::fromEntity)
                    .collect(Collectors.toList()));
        } else {
            dto.setItems(List.of());
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
