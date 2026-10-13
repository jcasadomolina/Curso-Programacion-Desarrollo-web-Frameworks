package com.reto4.fullstack.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() { }
    public record RegisterRequest(@NotBlank String name, @NotBlank @Email String email, @NotBlank @Size(min = 8) String password) { }
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) { }
    public record UserResponse(String id, String name, String email, String role) { }
    public record AuthResponse(String token, UserResponse user) { }
}