package com.maciejbartoszewski.pracainzynierska.dto.settlement;

import java.math.BigDecimal;

public record SettlementRequestDto(
        Integer groupId,
        Integer toUserId,
        BigDecimal amount
) {
}