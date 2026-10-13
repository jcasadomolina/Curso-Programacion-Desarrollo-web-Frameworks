package com.reto4.fullstack.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

class JwtServiceTest {
    private final JwtService jwtService = new JwtService("test-secret-key-that-is-at-least-32-characters", 60_000);
    private final UserDetails user = User.withUsername("dojo@example.com").password("encoded").roles("USER").build();

    @Test
    void generatesTokenWithUsernameAndValidatesIt() {
        String token = jwtService.generateToken(user);
        assertEquals("dojo@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isValid(token, user));
    }
}