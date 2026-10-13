package com.reto4.fullstack.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails user) {
        Date now = new Date();
        return Jwts.builder().subject(user.getUsername()).issuedAt(now).expiration(new Date(now.getTime() + expirationMs)).signWith(key).compact();
    }

    public String extractUsername(String token) { return claims(token).getSubject(); }
    public boolean isValid(String token, UserDetails user) { return user.getUsername().equals(extractUsername(token)) && !claims(token).getExpiration().before(new Date()); }
    private Claims claims(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload(); }
}