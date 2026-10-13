package com.reto4.fullstack.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.reto4.fullstack.security.JwtService;
import com.reto4.fullstack.user.Role;
import com.reto4.fullstack.user.User;
import com.reto4.fullstack.user.UserRepository;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.users = users; this.passwordEncoder = passwordEncoder; this.authenticationManager = authenticationManager; this.jwtService = jwtService;
    }

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        User user = users.save(new User(request.name().trim(), email, passwordEncoder.encode(request.password()), Role.USER));
        UserDetails details = toUserDetails(user);
        return new AuthDtos.AuthResponse(jwtService.generateToken(details), response(user));
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = users.findByEmailIgnoreCase(authentication.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales no válidas"));
        return new AuthDtos.AuthResponse(jwtService.generateToken((UserDetails) authentication.getPrincipal()), response(user));
    }

    public AuthDtos.UserResponse getUser(String email) { return users.findByEmailIgnoreCase(email).map(this::response).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")); }
    private UserDetails toUserDetails(User user) { return org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password(user.getPassword()).roles(user.getRole().name()).build(); }
    private AuthDtos.UserResponse response(User user) { return new AuthDtos.UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name()); }
}