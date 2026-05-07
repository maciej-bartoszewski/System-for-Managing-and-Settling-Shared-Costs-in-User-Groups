package com.maciejbartoszewski.pracainzynierska.dto.user;

import java.math.BigDecimal;

public record UserBalanceItemDto(
        Integer groupId,
        String groupName,
        Integer userId,
        String userName,
        BigDecimal amount
) {
}
