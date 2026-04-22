package com.bookstore.demo.controller;

import com.bookstore.demo.model.Order;
import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class OrderControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @SuppressWarnings("removal")
        @MockBean
        private OrderRepository orderRepository;

        @Test
        void testGetOrders() throws Exception {
                User user = new User();
                user.setId(1L);

                Order order = new Order();
                order.setId(1L);
                order.setUser(user);
                order.setTotale(25.50);
                order.setStato("COMPLETATO");
                order.setItems(new ArrayList<>());

                when(orderRepository.findByUserIdOrderByCreatedAtDesc(1L))
                                .thenReturn(List.of(order));

                mockMvc.perform(get("/api/orders/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].id").value(1))
                                .andExpect(jsonPath("$[0].totale").value(25.50))
                                .andExpect(jsonPath("$[0].stato").value("COMPLETATO"));
        }

        @Test
        void testGetOrdersEmpty() throws Exception {
                when(orderRepository.findByUserIdOrderByCreatedAtDesc(1L))
                                .thenReturn(List.of());

                mockMvc.perform(get("/api/orders/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$").isEmpty());
        }

        @Test
        void testGetOrderCount() throws Exception {
                User user = new User();
                user.setId(1L);

                Order order = new Order();
                order.setId(1L);
                order.setUser(user);
                order.setTotale(10.0);
                order.setStato("COMPLETATO");
                order.setItems(new ArrayList<>());

                when(orderRepository.findByUserIdOrderByCreatedAtDesc(1L))
                                .thenReturn(List.of(order));

                mockMvc.perform(get("/api/orders/1/count"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.count").value(1));
        }

        @Test
        void testGetOrderCountZero() throws Exception {
                when(orderRepository.findByUserIdOrderByCreatedAtDesc(1L))
                                .thenReturn(List.of());

                mockMvc.perform(get("/api/orders/1/count"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.count").value(0));
        }
}
