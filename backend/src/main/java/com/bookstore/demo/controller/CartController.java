package com.bookstore.demo.controller;

import com.bookstore.demo.dto.cart.AddToCartRequest;
import com.bookstore.demo.model.Cart;
import com.bookstore.demo.model.Order;
import com.bookstore.demo.dto.cart.UpdateQuantityRequest;
import com.bookstore.demo.service.ICartService;
import com.bookstore.demo.service.ICheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final ICartService cartService;
    private final ICheckoutService checkoutService;

    public CartController(ICartService cartService, ICheckoutService checkoutService) {
        this.cartService = cartService;
        this.checkoutService = checkoutService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCart(userId);
        if (cart == null) {
            return ResponseEntity.ok(Map.of("items", java.util.Collections.emptyList()));
        }
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<?> addItem(@PathVariable Long userId, @RequestBody AddToCartRequest request) {
        try {
            Cart cart = cartService.addItem(userId, request.getBookId(), request.getQuantita());
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{userId}/items/{bookId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestBody UpdateQuantityRequest request) {
        try {
            Cart cart = cartService.updateItemQuantity(userId, bookId, request.getQuantita());
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/items/{bookId}")
    public ResponseEntity<?> removeItem(@PathVariable Long userId,
            @PathVariable Long bookId) {
        try {
            Cart cart = cartService.removeItem(userId, bookId);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Carrello svuotato"));
    }

    @PostMapping("/{userId}/checkout")
    public ResponseEntity<?> checkout(@PathVariable Long userId) {
        try {
            Order order = checkoutService.checkout(userId);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
