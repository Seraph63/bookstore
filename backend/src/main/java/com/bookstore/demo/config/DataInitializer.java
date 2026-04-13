package com.bookstore.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.bookstore.demo.model.Book;
import com.bookstore.demo.repository.BookRepository;
import com.bookstore.demo.service.BookImportService;
import com.bookstore.demo.service.UserImportService;
import java.io.InputStream;
import java.util.List;
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookImportService bookImportService;

    @Autowired
    private UserImportService userImportService;

    @Override
    public void run(String... args) throws Exception {
        userImportService.initUsers();
        if (bookRepository.count() == 0) {
            InputStream is = getClass().getResourceAsStream("/books.csv");
            if (is != null) {
                List<Book> books = bookImportService.parseCsv(is);
                if (books != null) {
                    bookRepository.saveAll(books);
                    System.out.println("Libri importati con successo!");
                }
            }
        }
    }
}