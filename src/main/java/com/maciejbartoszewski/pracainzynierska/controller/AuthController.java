package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.dto.auth.AuthCodeRequest;
import com.maciejbartoszewski.pracainzynierska.dto.auth.LoginRequest;
import com.maciejbartoszewski.pracainzynierska.dto.auth.LoginResponse;
import com.maciejbartoszewski.pracainzynierska.dto.auth.RegisterRequest;
import com.maciejbartoszewski.pracainzynierska.dto.user.UserDto;
import com.maciejbartoszewski.pracainzynierska.mapper.UserMapper;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toUserDto(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/exchange-code")
    public ResponseEntity<LoginResponse> exchangeAuthCode(@RequestBody AuthCodeRequest request) {
        return ResponseEntity.ok(authService.exchangeAuthCode(request.code()));
    }
}