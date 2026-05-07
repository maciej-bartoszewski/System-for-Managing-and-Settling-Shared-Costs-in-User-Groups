package com.maciejbartoszewski.pracainzynierska.dto.expense;

import java.math.BigDecimal;
import java.util.List;

public record ExpenseRequestDto(
        Integer groupId,
        String description,
        Integer categoryId,
        BigDecimal totalAmount,
        List<ExpenseSplitRequestDto> splits
) {
}