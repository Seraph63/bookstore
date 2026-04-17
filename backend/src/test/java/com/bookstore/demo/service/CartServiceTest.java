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
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private BookRepository bookRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Book testBook;
    private Cart testCart;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setNome("Mario");
        testUser.setCognome("Rossi");
        testUser.setEmail("mario@test.it");

        testBook = new Book();
        testBook.setId(1L);
        testBook.setTitolo("Il Nome della Rosa");
        testBook.setPrezzo(15.0);
        testBook.setStock(10);

        testCart = new Cart();
        testCart.setId(1L);
        testCart.setUser(testUser);
        testCart.setItems(new ArrayList<>());
    }

    @SuppressWarnings("null")
    @Test
    void testAddItemToEmptyCart() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(cartItemRepository.findByCartIdAndBookId(1L, 1L)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        Cart result = cartService.addItem(1L, 1L, 1);

        assertThat(result).isNotNull();
        verify(cartRepository).save(any(Cart.class));
    }

    @SuppressWarnings("null")
    @Test
    void testAddItemIncreasesQuantityIfAlreadyInCart() {
        CartItem existingItem = new CartItem();
        existingItem.setId(1L);
        existingItem.setCart(testCart);
        existingItem.setBook(testBook);
        existingItem.setQuantita(2);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(cartItemRepository.findByCartIdAndBookId(1L, 1L)).thenReturn(Optional.of(existingItem));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        cartService.addItem(1L, 1L, 3);

        assertThat(existingItem.getQuantita()).isEqualTo(5);
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    void testAddItemThrowsWhenStockInsufficient() {
        testBook.setStock(2);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(cartItemRepository.findByCartIdAndBookId(1L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItem(1L, 1L, 5))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Stock insufficiente");
    }

    @Test
    void testAddItemThrowsWhenQuantityZero() {
        assertThatThrownBy(() -> cartService.addItem(1L, 1L, 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("maggiore di zero");
    }

    @SuppressWarnings("null")
    @Test
    void testRemoveItem() {
        CartItem item = new CartItem();
        item.setId(1L);
        item.setCart(testCart);
        item.setBook(testBook);
        item.setQuantita(1);
        testCart.getItems().add(item);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        Cart result = cartService.removeItem(1L, 1L);

        assertThat(result.getItems()).isEmpty();
    }

    @SuppressWarnings("null")
    @Test
    void testClearCart() {
        CartItem item = new CartItem();
        item.setBook(testBook);
        item.setQuantita(1);
        testCart.getItems().add(item);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        cartService.clearCart(1L);

        assertThat(testCart.getItems()).isEmpty();
        verify(cartRepository).save(testCart);
    }

    @Test
    void testUpdateItemQuantity() {
        CartItem item = new CartItem();
        item.setId(1L);
        item.setCart(testCart);
        item.setBook(testBook);
        item.setQuantita(1);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(cartItemRepository.findByCartIdAndBookId(1L, 1L)).thenReturn(Optional.of(item));

        cartService.updateItemQuantity(1L, 1L, 5);

        assertThat(item.getQuantita()).isEqualTo(5);
        verify(cartItemRepository).save(item);
    }
}
