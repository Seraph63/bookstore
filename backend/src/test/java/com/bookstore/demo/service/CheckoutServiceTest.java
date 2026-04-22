package com.bookstore.demo.service;

import com.bookstore.demo.model.*;
import com.bookstore.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CheckoutServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private CheckoutService checkoutService;

    private User testUser;
    private Book testBook1;
    private Book testBook2;
    private Cart testCart;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setNome("Mario");
        testUser.setEmail("mario@test.it");

        testBook1 = new Book();
        testBook1.setId(1L);
        testBook1.setTitolo("Il Nome della Rosa");
        testBook1.setPrezzo(15.0);
        testBook1.setStock(10);

        testBook2 = new Book();
        testBook2.setId(2L);
        testBook2.setTitolo("1984");
        testBook2.setPrezzo(12.0);
        testBook2.setStock(5);

        testCart = new Cart();
        testCart.setId(1L);
        testCart.setUser(testUser);
        testCart.setItems(new ArrayList<>());
    }

    @Test
    void testCheckoutSuccess() {
        CartItem item1 = new CartItem();
        item1.setBook(testBook1);
        item1.setQuantita(2);
        item1.setCart(testCart);

        CartItem item2 = new CartItem();
        item2.setBook(testBook2);
        item2.setQuantita(1);
        item2.setCart(testCart);

        testCart.getItems().add(item1);
        testCart.getItems().add(item2);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook1));
        when(bookRepository.findById(2L)).thenReturn(Optional.of(testBook2));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(100L);
            return o;
        });

        Order order = checkoutService.checkout(1L);

        assertThat(order).isNotNull();
        assertThat(order.getTotale()).isEqualTo(42.0); // 15*2 + 12*1
        assertThat(order.getStato()).isEqualTo("COMPLETATO");
        assertThat(order.getItems()).hasSize(2);

        // Verifica riduzione stock
        assertThat(testBook1.getStock()).isEqualTo(8);
        assertThat(testBook2.getStock()).isEqualTo(4);

        // Verifica carrello svuotato
        verify(cartRepository).save(testCart);
    }

    @Test
    void testCheckoutEmptyCartThrows() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));

        assertThatThrownBy(() -> checkoutService.checkout(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("vuoto");
    }

    @Test
    void testCheckoutInsufficientStockThrows() {
        testBook1.setStock(1);

        CartItem item = new CartItem();
        item.setBook(testBook1);
        item.setQuantita(5);
        item.setCart(testCart);
        testCart.getItems().add(item);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook1));

        assertThatThrownBy(() -> checkoutService.checkout(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Stock insufficiente");
    }

    @Test
    void testCheckoutCartNotFoundThrows() {
        when(cartRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkoutService.checkout(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Carrello non trovato");
    }
}
