package com.maciejbartoszewski.pracainzynierska.dto.expense;

import java.math.BigDecimal;

public record ExpenseSplitRequestDto(
        Integer userId,
        BigDecimal amount
) {
}