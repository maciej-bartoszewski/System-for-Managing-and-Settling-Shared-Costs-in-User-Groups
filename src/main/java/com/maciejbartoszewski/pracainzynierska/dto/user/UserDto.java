package com.maciejbartoszewski.pracainzynierska.dto.user;

import java.time.LocalDateTime;

public record UserDto(Integer id, String firstName, String lastName, String email, LocalDateTime lastLogin, String role,
                      String authProvider) {
}
