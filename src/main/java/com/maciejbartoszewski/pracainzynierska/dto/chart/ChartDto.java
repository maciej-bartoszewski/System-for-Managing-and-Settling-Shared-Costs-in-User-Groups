package com.maciejbartoszewski.pracainzynierska.dto.chart;

import java.util.List;

public record ChartDto(List<String> labels, List<ChartSeriesDto> series) {
}
