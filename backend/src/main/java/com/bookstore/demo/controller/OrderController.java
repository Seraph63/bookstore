package com.bookstore.demo.controller;

import com.bookstore.demo.model.Order;
import com.bookstore.demo.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<Map<String, Long>> getOrderCount(@PathVariable Long userId) {
        long count = orderRepository.findByUserIdOrderByCreatedAtDesc(userId).size();
        return ResponseEntity.ok(Map.of("count", count));
    }
}
