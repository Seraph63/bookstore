package com.bookstore.demo.dto.auth;

public class LoginRequest {
    private String email;
    private String password;

    // Costruttore vuoto (necessario per Jackson)
    public LoginRequest() {
    }

    // Getter e Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}