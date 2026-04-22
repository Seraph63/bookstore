package com.bookstore.demo.controller;

import com.bookstore.demo.dto.cart.AddToCartRequest;
import com.bookstore.demo.dto.cart.UpdateQuantityRequest;
import com.bookstore.demo.model.*;
import com.bookstore.demo.service.ICartService;
import com.bookstore.demo.service.ICheckoutService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private ICartService cartService;

    @SuppressWarnings("removal")
    @MockBean
    private ICheckoutService checkoutService;

    @Autowired
    private ObjectMapper objectMapper;

    private Cart testCart;
    private Book testBook;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(1L);
        user.setNome("Mario");

        testBook = new Book();
        testBook.setId(1L);
        testBook.setTitolo("Test Book");
        testBook.setPrezzo(10.0);
        testBook.setStock(5);

        testCart = new Cart();
        testCart.setId(1L);
        testCart.setUser(user);
        testCart.setItems(new ArrayList<>());
    }

    @Test
    void testGetCart() throws Exception {
        when(cartService.getCart(1L)).thenReturn(testCart);

        mockMvc.perform(get("/api/cart/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetCartEmpty() throws Exception {
        when(cartService.getCart(1L)).thenReturn(null);

        mockMvc.perform(get("/api/cart/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray());
    }

    @Test
    void testAddItem() throws Exception {
        when(cartService.addItem(eq(1L), eq(1L), eq(1))).thenReturn(testCart);

        AddToCartRequest request = new AddToCartRequest();
        request.setBookId(1L);
        request.setQuantita(1);

        mockMvc.perform(post("/api/cart/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testAddItemStockError() throws Exception {
        when(cartService.addItem(eq(1L), eq(1L), eq(100)))
                .thenThrow(new IllegalArgumentException("Stock insufficiente"));

        AddToCartRequest request = new AddToCartRequest();
        request.setBookId(1L);
        request.setQuantita(100);

        mockMvc.perform(post("/api/cart/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Stock insufficiente"));
    }

    @Test
    void testUpdateQuantity() throws Exception {
        when(cartService.updateItemQuantity(eq(1L), eq(1L), eq(3))).thenReturn(testCart);

        UpdateQuantityRequest request = new UpdateQuantityRequest();
        request.setQuantita(3);

        mockMvc.perform(put("/api/cart/1/items/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testRemoveItem() throws Exception {
        when(cartService.removeItem(1L, 1L)).thenReturn(testCart);

        mockMvc.perform(delete("/api/cart/1/items/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testClearCart() throws Exception {
        mockMvc.perform(delete("/api/cart/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Carrello svuotato"));
    }

    @Test
    void testCheckout() throws Exception {
        Order order = new Order();
        order.setId(1L);
        order.setTotale(30.0);
        order.setStato("COMPLETATO");
        order.setItems(new ArrayList<>());

        when(checkoutService.checkout(1L)).thenReturn(order);

        mockMvc.perform(post("/api/cart/1/checkout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.totale").value(30.0))
                .andExpect(jsonPath("$.stato").value("COMPLETATO"));
    }

    @Test
    void testCheckoutError() throws Exception {
        when(checkoutService.checkout(1L))
                .thenThrow(new IllegalArgumentException("Il carrello è vuoto"));

        mockMvc.perform(post("/api/cart/1/checkout"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Il carrello è vuoto"));
    }
}
