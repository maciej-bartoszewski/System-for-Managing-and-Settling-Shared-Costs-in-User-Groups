package com.maciejbartoszewski.pracainzynierska.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseItemDto(
        String description,
        BigDecimal amount,
        LocalDate createdAt
) {
}
