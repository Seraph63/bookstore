package com.bookstore.demo.service;

import com.bookstore.demo.model.Cart;

public interface ICartService {
    Cart getCart(Long userId);

    Cart getOrCreateCart(Long userId);

    Cart addItem(Long userId, Long bookId, int quantita);

    Cart updateItemQuantity(Long userId, Long bookId, int nuovaQuantita);

    Cart removeItem(Long userId, Long bookId);

    void clearCart(Long userId);
}
