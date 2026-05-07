package com.maciejbartoszewski.pracainzynierska.security;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class AuthCodeService {
    private final Map<String, AuthCodeData> authCodes = new ConcurrentHashMap<>();
    private static final long CODE_EXPIRY_TIME = 120;

    public String generateCode(Integer userId) {
        String code = UUID.randomUUID().toString();
        authCodes.put(code, new AuthCodeData(userId, Instant.now().plusSeconds(CODE_EXPIRY_TIME)));
        return code;
    }

    public Integer validateCodeAndGetUserId(String code) {
        AuthCodeData data = authCodes.get(code);
        if (data == null) {
            throw new IllegalArgumentException("Invalid authorization code");
        }

        if (data.expiryTime.isBefore(Instant.now())) {
            authCodes.remove(code);
            throw new IllegalArgumentException("Authorization code expired");
        }

        authCodes.remove(code);
        return data.userId;
    }

    private record AuthCodeData(Integer userId, Instant expiryTime) {}
}