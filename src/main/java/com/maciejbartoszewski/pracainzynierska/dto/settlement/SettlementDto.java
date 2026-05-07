package com.maciejbartoszewski.pracainzynierska.dto.settlement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SettlementDto(
        Integer id,
        Integer groupId,
        String groupName,
        Integer fromUserId,
        String fromUserEmail,
        Integer toUserId,
        String toUserEmail,
        BigDecimal amount,
        LocalDateTime createdAt
) {
}