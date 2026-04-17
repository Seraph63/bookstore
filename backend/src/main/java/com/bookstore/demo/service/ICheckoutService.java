package com.bookstore.demo.service;

import com.bookstore.demo.model.Order;

public interface ICheckoutService {
    Order checkout(Long userId);
}
