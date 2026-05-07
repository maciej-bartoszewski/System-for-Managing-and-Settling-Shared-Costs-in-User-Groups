package com.maciejbartoszewski.pracainzynierska.dto.user;

import com.maciejbartoszewski.pracainzynierska.enums.Role;
import jakarta.validation.constraints.Email;

public record UserEditRequest(String firstName, String lastName, String password,
                              @Email(message = "Invalid email format") String email, Role role) {
}

