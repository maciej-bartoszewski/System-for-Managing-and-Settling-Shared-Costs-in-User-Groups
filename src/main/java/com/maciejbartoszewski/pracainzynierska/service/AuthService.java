package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.dto.auth.LoginRequest;
import com.maciejbartoszewski.pracainzynierska.dto.auth.LoginResponse;
import com.maciejbartoszewski.pracainzynierska.dto.auth.RegisterRequest;
import com.maciejbartoszewski.pracainzynierska.enums.AuthProvider;
import com.maciejbartoszewski.pracainzynierska.enums.Role;
import com.maciejbartoszewski.pracainzynierska.exception.InvalidCredentialsException;
import com.maciejbartoszewski.pracainzynierska.exception.UserNotFoundException;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.repository.UserRepository;
import com.maciejbartoszewski.pracainzynierska.security.AuthCodeService;
import com.maciejbartoszewski.pracainzynierska.security.CustomUserDetails;
import com.maciejbartoszewski.pracainzynierska.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthCodeService authCodeService;

    public User register(RegisterRequest request) {
        return userService.createUser(
                request.firstName(),
                request.lastName(),
                request.email(),
                request.password(),
                Role.USER,
                AuthProvider.LOCAL
        );
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        userService.updateLastLogin(user);
        String token = jwtUtil.generateToken(new CustomUserDetails(user));
        return new LoginResponse(token);
    }

    public LoginResponse exchangeAuthCode(String code) {
        Integer userId = authCodeService.validateCodeAndGetUserId(code);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        userService.updateLastLogin(user);
        String token = jwtUtil.generateToken(new CustomUserDetails(user));
        return new LoginResponse(token);
    }
}