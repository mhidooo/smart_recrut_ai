package com.smartrecruit.ai.service;

import com.smartrecruit.ai.dto.LoginRequest;
import com.smartrecruit.ai.dto.RegisterRequest;
import com.smartrecruit.ai.dto.UserResponse;
import com.smartrecruit.ai.model.Role;
import com.smartrecruit.ai.model.User;
import com.smartrecruit.ai.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Inscription d'un nouveau candidat
    public UserResponse register(RegisterRequest request) {
        String email = request.email()
                .strip()
                .toLowerCase(Locale.ROOT);

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Le mot de passe dépasse la limite de 72 octets"
            );
        }

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cette adresse email est déjà utilisée"
            );
        }

        User user = new User();
        user.setFullName(request.fullName().strip());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.password())
        );
        user.setRole(Role.CANDIDATE);

        User savedUser;

        try {
            savedUser = userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Impossible de créer ce compte : vérifiez les données ou l'email",
                    exception
            );
        }

        return toUserResponse(savedUser);
    }

    // Vérification des identifiants de connexion
    public UserResponse login(LoginRequest request) {
        String email = request.email()
                .strip()
                .toLowerCase(Locale.ROOT);

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw invalidCredentials();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(this::invalidCredentials);

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        );

        if (!passwordMatches) {
            throw invalidCredentials();
        }

        return toUserResponse(user);
    }

    // Conversion de l'entité en réponse sans mot de passe
    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

    // Même erreur pour un email inconnu ou un mauvais mot de passe
    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Email ou mot de passe incorrect"
        );
    }
}