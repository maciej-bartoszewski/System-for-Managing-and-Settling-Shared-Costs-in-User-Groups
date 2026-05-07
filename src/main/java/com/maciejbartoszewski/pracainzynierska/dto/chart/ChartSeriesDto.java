package com.maciejbartoszewski.pracainzynierska.dto.chart;

import java.math.BigDecimal;
import java.util.List;

public record ChartSeriesDto(String name, List<BigDecimal> data) {
}
