package com.smartrecruit.ai.controller;

import com.smartrecruit.ai.dto.AuthResponse;
import com.smartrecruit.ai.dto.LoginRequest;
import com.smartrecruit.ai.dto.RegisterRequest;
import com.smartrecruit.ai.dto.UserResponse;
import com.smartrecruit.ai.service.AuthService;
import com.smartrecruit.ai.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        UserResponse user = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        UserResponse user = authService.login(request);

        String token = jwtService.generateToken(user);

        AuthResponse response = new AuthResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                user
        );

        return ResponseEntity.ok()
                .header("Cache-Control", "no-store")
                .body(response);
    }
}