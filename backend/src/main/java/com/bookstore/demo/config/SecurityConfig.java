package com.bookstore.demo.config;

import org.springframework.security.config.Customizer;

import java.util.Arrays;

import org.springframework.http.HttpMethod;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.bookstore.demo.repository.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disabilitato per semplicità nei test
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Auth: sempre pubblici
                        .requestMatchers("/api/auth/**").permitAll()

                        // Catalogo: solo lettura pubblica, scrittura autenticata
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/authors").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/publishers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tag").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/formati/**").permitAll()

                        // Scrittura catalogo: autenticata
                        .requestMatchers("/api/books/**").authenticated()
                        .requestMatchers("/api/authors/**").authenticated()
                        .requestMatchers("/api/publishers/**").authenticated()

                        // Utenti: registrazione pubblica, tutto il resto autenticato
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .requestMatchers("/api/users/**").authenticated()

                        // Carrello e ordini: sempre autenticati
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()

                        .anyRequest().authenticated() // Tutto il resto protetto
                )
                .httpBasic(Customizer.withDefaults()); // Permette test rapidi

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Cripta le password nel DB
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return (email) -> userRepository.findByEmail(email)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRuolo() != null ? user.getRuolo() : "USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato: " + email));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Indirizzo Next.js
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}