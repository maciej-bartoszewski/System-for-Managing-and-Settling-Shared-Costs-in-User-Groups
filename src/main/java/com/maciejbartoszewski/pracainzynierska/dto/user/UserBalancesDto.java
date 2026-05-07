package com.maciejbartoszewski.pracainzynierska.dto.user;

import java.util.List;

public record UserBalancesDto(
        List<UserBalanceItemDto> iOwe,
        List<UserBalanceItemDto> owedToMe
) {
}
