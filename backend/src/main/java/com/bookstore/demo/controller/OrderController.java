package com.bookstore.demo.controller;

import com.bookstore.demo.dto.order.OrderResponse;
import com.bookstore.demo.model.Order;
import com.bookstore.demo.model.OrderItem;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.repository.OrderItemRepository;
import com.bookstore.demo.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final BookRepository bookRepository;

    public OrderController(OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            BookRepository bookRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.bookRepository = bookRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrders(@PathVariable Long userId) {
        List<OrderResponse> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<Map<String, Long>> getOrderCount(@PathVariable Long userId) {
        long count = orderRepository.findByUserIdOrderByCreatedAtDesc(userId).size();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/items/{itemId}")
    @Transactional
    public ResponseEntity<?> updateItemQuantity(@PathVariable Long itemId,
            @RequestBody Map<String, Integer> body) {
        Integer newQuantity = body.get("quantita");
        if (newQuantity == null || newQuantity < 1) {
            return ResponseEntity.badRequest().body(Map.of("message", "La quantità deve essere almeno 1"));
        }

        Optional<OrderItem> itemOpt = orderItemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var item = itemOpt.get();
        int oldQuantity = item.getQuantita();
        int diff = newQuantity - oldQuantity;

        // Verifica stock disponibile se si aumenta
        if (diff > 0) {
            var book = item.getBook();
            if (book.getStock() == null || book.getStock() < diff) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Stock insufficiente per \"" + book.getTitolo() +
                                "\". Disponibili: " + (book.getStock() != null ? book.getStock() : 0)));
            }
            book.setStock(book.getStock() - diff);
            bookRepository.save(book);
        } else if (diff < 0) {
            // Restituisci stock se si diminuisce
            var book = item.getBook();
            book.setStock((book.getStock() != null ? book.getStock() : 0) - diff);
            bookRepository.save(book);
        }

        item.setQuantita(newQuantity);
        orderItemRepository.save(item);

        // Ricalcola totale ordine
        Order order = item.getOrder();
        BigDecimal calcoloTotale = order.getItems().stream()
                .map(i -> BigDecimal.valueOf(i.getPrezzoUnitario()).multiply(BigDecimal.valueOf(i.getQuantita())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotale(calcoloTotale.doubleValue());
        orderRepository.save(order);

        return ResponseEntity.ok(OrderResponse.fromEntity(order));
    }

    @DeleteMapping("/items/{itemId}")
    @Transactional
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId) {
        Optional<OrderItem> itemOpt = orderItemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var item = itemOpt.get();
        // Restituisci stock
        var book = item.getBook();
        book.setStock((book.getStock() != null ? book.getStock() : 0) + item.getQuantita());
        bookRepository.save(book);

        Order order = item.getOrder();
        order.getItems().remove(item);
        orderItemRepository.delete(item);

        if (order.getItems().isEmpty()) {
            // Ordine vuoto, elimina l'ordine
            orderRepository.delete(order);
            return ResponseEntity.ok(Map.of("deleted", true, "orderId", order.getId()));
        } else {
            // Ricalcola totale
            BigDecimal calcoloTotale = order.getItems().stream()
                    .map(i -> BigDecimal.valueOf(i.getPrezzoUnitario()).multiply(BigDecimal.valueOf(i.getQuantita())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            order.setTotale(calcoloTotale.doubleValue());
            orderRepository.save(order);
            return ResponseEntity.ok(OrderResponse.fromEntity(order));
        }
    }
}
