package com.bookstore.demo.service;

import com.bookstore.demo.model.User;
import com.bookstore.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("mario");
        user.setEmail("mario@test.it");
        user.setNome("Mario");
        user.setCognome("Rossi");
        user.setRuolo("USER");
        user.setAttivo(true);
        user.setPassword("secret");
    }

    // --- getAllUsers ---

    @Test
    void getAllUsers_returnsAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<User> result = userService.getAllUsers();

        assertThat(result).hasSize(1).contains(user);
    }

    // --- getUserById ---

    @Test
    void getUserById_whenExists_returnsUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(1L);

        assertThat(result).isPresent().contains(user);
    }

    @Test
    void getUserById_whenNotExists_returnsEmpty() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(99L);

        assertThat(result).isEmpty();
    }

    // --- createUser ---

    @Test
    void createUser_whenUsernameAndEmailUnique_savesUser() {
        when(userRepository.existsByUsername("mario")).thenReturn(false);
        when(userRepository.existsByEmail("mario@test.it")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.createUser(user);

        assertThat(result).isEqualTo(user);
        verify(userRepository).save(user);
    }

    @Test
    void createUser_whenUsernameDuplicate_throwsException() {
        when(userRepository.existsByUsername("mario")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(user))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Username già esistente");

        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_whenEmailDuplicate_throwsException() {
        when(userRepository.existsByUsername("mario")).thenReturn(false);
        when(userRepository.existsByEmail("mario@test.it")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(user))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email già esistente");

        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_setsDefaultRuoloWhenNull() {
        user.setRuolo(null);
        when(userRepository.existsByUsername("mario")).thenReturn(false);
        when(userRepository.existsByEmail("mario@test.it")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        userService.createUser(user);

        assertThat(user.getRuolo()).isEqualTo("USER");
    }

    @Test
    void createUser_setsAttivoTrueWhenNull() {
        user.setAttivo(null);
        when(userRepository.existsByUsername("mario")).thenReturn(false);
        when(userRepository.existsByEmail("mario@test.it")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        userService.createUser(user);

        assertThat(user.getAttivo()).isTrue();
    }

    // --- updateUser ---

    @Test
    void updateUser_whenNotFound_throwsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUser(99L, user))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Utente non trovato");
    }

    @Test
    void updateUser_updatesFieldsAndSaves() {
        User existing = new User();
        existing.setId(1L);
        existing.setUsername("old_mario");
        existing.setEmail("old@test.it");
        existing.setRuolo("USER");
        existing.setAttivo(true);

        User details = new User();
        details.setUsername("new_mario");
        details.setEmail("new@test.it");
        details.setNome("Mario");
        details.setCognome("Bianchi");
        details.setRuolo("ADMIN");
        details.setAttivo(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByUsernameAndIdNot("new_mario", 1L)).thenReturn(false);
        when(userRepository.existsByEmailAndIdNot("new@test.it", 1L)).thenReturn(false);
        when(userRepository.save(existing)).thenReturn(existing);

        User result = userService.updateUser(1L, details);

        assertThat(result.getUsername()).isEqualTo("new_mario");
        assertThat(result.getRuolo()).isEqualTo("ADMIN");
        assertThat(result.getAttivo()).isFalse();
    }

    @Test
    void updateUser_whenUsernameTakenByOther_throwsException() {
        User existing = new User();
        existing.setId(1L);
        existing.setUsername("mario");

        User details = new User();
        details.setUsername("taken");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByUsernameAndIdNot("taken", 1L)).thenReturn(true);

        assertThatThrownBy(() -> userService.updateUser(1L, details))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Username già esistente");
    }

    // --- deleteUser ---

    @Test
    void deleteUser_whenExists_deletes() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_whenNotExists_throwsException() {
        when(userRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> userService.deleteUser(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Utente non trovato");

        verify(userRepository, never()).deleteById(any());
    }

    // --- toggleUserActive ---

    @Test
    void toggleUserActive_fromTrueToFalse() {
        user.setAttivo(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.toggleUserActive(1L);

        assertThat(result.getAttivo()).isFalse();
    }

    @Test
    void toggleUserActive_fromFalseToTrue() {
        user.setAttivo(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.toggleUserActive(1L);

        assertThat(result.getAttivo()).isTrue();
    }

    @Test
    void toggleUserActive_whenNotFound_throwsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.toggleUserActive(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Utente non trovato");
    }
}
