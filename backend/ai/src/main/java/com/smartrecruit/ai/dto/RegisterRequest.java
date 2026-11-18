package com.smartrecruit.ai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Le nom complet est obligatoire")
        @Size(max = 150, message = "Le nom ne doit pas dépasser 150 caractères")
        String fullName,

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "L'email est invalide")
        @Size(max = 254, message = "L'email est trop long")
        String email,

        @NotBlank(message = "Le mot de passe est obligatoire")
        @Size(min = 12, max = 72,
                message = "Le mot de passe doit contenir entre 12 et 72 caractères")
        String password

) {
}