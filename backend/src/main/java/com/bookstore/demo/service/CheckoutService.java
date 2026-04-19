package com.bookstore.demo.service;

import com.bookstore.demo.model.*;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.CartRepository;
import com.bookstore.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class CheckoutService implements ICheckoutService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;

    public CheckoutService(CartRepository cartRepository, OrderRepository orderRepository,
            BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public Order checkout(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carrello non trovato"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Il carrello è vuoto");
        }

        // Ri-verifica stock e calcola totale
        double totale = 0;
        for (CartItem cartItem : cart.getItems()) {
            @SuppressWarnings("null")
            Book book = bookRepository.findById(cartItem.getBook().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Libro non più disponibile: " + cartItem.getBook().getTitolo()));

            if (book.getStock() == null || book.getStock() < cartItem.getQuantita()) {
                throw new IllegalArgumentException(
                        "Stock insufficiente per \"" + book.getTitolo() +
                                "\". Disponibili: " + (book.getStock() != null ? book.getStock() : 0) +
                                ", richiesti: " + cartItem.getQuantita());
            }

            totale += book.getPrezzo() * cartItem.getQuantita();
        }

        // Crea ordine
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setTotale(totale);
        order.setStato("COMPLETATO");
        order.setItems(new ArrayList<>());

        // Crea order items e riduci stock
        for (CartItem cartItem : cart.getItems()) {
            Book book = cartItem.getBook();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantita(cartItem.getQuantita());
            orderItem.setPrezzoUnitario(book.getPrezzo());
            order.getItems().add(orderItem);

            // Riduzione stock
            book.setStock(book.getStock() - cartItem.getQuantita());
            bookRepository.save(book);
        }

        Order savedOrder = orderRepository.save(order);

        // Svuota il carrello
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }
}
