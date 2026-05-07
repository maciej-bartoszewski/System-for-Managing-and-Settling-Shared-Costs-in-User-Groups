package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.dto.chart.GroupBalancesChartDto;
import com.maciejbartoszewski.pracainzynierska.dto.chart.PieSliceDto;
import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseSummaryDto;
import com.maciejbartoszewski.pracainzynierska.security.CustomUserDetails;
import com.maciejbartoszewski.pracainzynierska.service.SummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/summary")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
@RequiredArgsConstructor
public class SummaryController {
    private final SummaryService summaryService;

    @GetMapping()
    public ResponseEntity<ExpenseSummaryDto> getUserExpensesSummary(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        ExpenseSummaryDto summary = summaryService.getExpensesSummaryByUserAndDate(
                currentUser.user().getId(), from, to);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/my/group-balances")
    public ResponseEntity<GroupBalancesChartDto> myGroupBalancesWithData(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        GroupBalancesChartDto dto = summaryService.getGroupBalancesChartWithData(currentUser.user().getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/my/category-share")
    public ResponseEntity<List<PieSliceDto>> myCategoryShare(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        List<PieSliceDto> slices = summaryService.getCategoryShare(currentUser.user().getId(), from, to);
        return ResponseEntity.ok(slices);
    }
}
