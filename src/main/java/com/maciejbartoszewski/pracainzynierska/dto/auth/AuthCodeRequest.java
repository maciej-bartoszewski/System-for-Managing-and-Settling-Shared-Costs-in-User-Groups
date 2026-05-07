package com.maciejbartoszewski.pracainzynierska.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record AuthCodeRequest(
        @NotBlank(message = "Code is required") String code
) {
}