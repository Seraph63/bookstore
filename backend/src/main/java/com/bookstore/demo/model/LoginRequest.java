package com.bookstore.demo.model;

public class LoginRequest {
    private String username;
    private String password;

    // Getter e Setter (Indispensabili per Spring!)
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}