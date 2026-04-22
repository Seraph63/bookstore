package com.bookstore.demo.service;

import com.bookstore.demo.model.Book;
import com.bookstore.demo.model.Cart;
import com.bookstore.demo.model.CartItem;
import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.CartItemRepository;
import com.bookstore.demo.repository.CartRepository;
import com.bookstore.demo.repository.UserRepository;

import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService implements ICartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
            BookRepository bookRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public Cart getCart(Long userId) {
        return cartRepository.findByUserId(userId).orElse(null);
    }

    public Cart getOrCreateCart(@Nullable Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    @Transactional
    public Cart addItem(Long userId, Long bookId, int quantita) {
        if (quantita <= 0) {
            throw new IllegalArgumentException("La quantità deve essere maggiore di zero");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Libro non trovato"));

        Cart cart = getOrCreateCart(userId);

        // Controlla se il libro è già nel carrello
        CartItem existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId)
                .orElse(null);

        int nuovaQuantita = existingItem != null ? existingItem.getQuantita() + quantita : quantita;

        // Verifica stock
        if (book.getStock() == null || book.getStock() < nuovaQuantita) {
            throw new IllegalArgumentException("Stock insufficiente. Disponibili: " +
                    (book.getStock() != null ? book.getStock() : 0));
        }

        if (existingItem != null) {
            existingItem.setQuantita(nuovaQuantita);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setBook(book);
            newItem.setQuantita(quantita);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateItemQuantity(Long userId, Long bookId, int nuovaQuantita) {
        if (nuovaQuantita <= 0) {
            return removeItem(userId, bookId);
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carrello non trovato"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Libro non trovato"));

        // Verifica stock
        if (book.getStock() == null || book.getStock() < nuovaQuantita) {
            throw new IllegalArgumentException("Stock insufficiente. Disponibili: " +
                    (book.getStock() != null ? book.getStock() : 0));
        }

        CartItem item = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId)
                .orElseThrow(() -> new IllegalArgumentException("Item non trovato nel carrello"));

        item.setQuantita(nuovaQuantita);
        cartItemRepository.save(item);

        return cartRepository.findByUserId(userId).orElse(cart);
    }

    @Transactional
    public Cart removeItem(Long userId, Long bookId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carrello non trovato"));

        cart.getItems().removeIf(item -> item.getBook().getId().equals(bookId));
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }
}
