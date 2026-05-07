package com.maciejbartoszewski.pracainzynierska.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ExpenseDto(
        Integer id,
        Integer groupId,
        String groupName,
        Integer paidByUserId,
        String paidByUserEmail,
        String description,
        BigDecimal totalAmount,
        Integer categoryId,
        String categoryName,
        LocalDateTime createdAt,
        List<ExpenseSplitDto> splits
) {
}