package com.maciejbartoszewski.pracainzynierska.dto.chart;

import com.maciejbartoszewski.pracainzynierska.dto.user.UserBalanceItemDto;

import java.util.List;

public record GroupBalancesChartDto(
        List<String> labels,
        List<ChartSeriesDto> series,
        List<UserBalanceItemDto> iOwe,
        List<UserBalanceItemDto> owedToMe
) {
}
