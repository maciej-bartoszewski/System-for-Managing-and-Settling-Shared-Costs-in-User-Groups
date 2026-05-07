package com.maciejbartoszewski.pracainzynierska.dto.expense;

import java.math.BigDecimal;
import java.util.List;

public record ExpenseSummaryDto(
        BigDecimal totalAmount,
        List<ExpenseItemDto> expenses
) {
}
