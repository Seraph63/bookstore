package com.bookstore.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public Map<String, String> welcome() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Online");
        response.put("message", "Benvenuti nel sistema Backend di BookStore API");
        response.put("version", "1.0.0-SPRING");
        response.put("environment", "Docker/Development");
        return response;
    }
}