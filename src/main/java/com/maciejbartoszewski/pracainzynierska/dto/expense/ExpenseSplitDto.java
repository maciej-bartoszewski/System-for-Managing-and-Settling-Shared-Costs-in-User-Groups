package com.maciejbartoszewski.pracainzynierska.dto.expense;

import java.math.BigDecimal;

public record ExpenseSplitDto(
        Integer id,
        Integer userId,
        String userEmail,
        BigDecimal amount
) {
}