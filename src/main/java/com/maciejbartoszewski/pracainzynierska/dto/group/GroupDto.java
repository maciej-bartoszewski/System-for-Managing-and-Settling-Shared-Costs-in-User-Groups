package com.maciejbartoszewski.pracainzynierska.dto.group;

import java.time.LocalDate;

public record GroupDto(
        Integer id,
        String name,
        String description,
        String inviteCode,
        LocalDate createdAt,
        String createdByEmail
) {
}