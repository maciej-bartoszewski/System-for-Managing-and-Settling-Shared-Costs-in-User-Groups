package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseDto;
import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseRequestDto;
import com.maciejbartoszewski.pracainzynierska.mapper.ExpenseMapper;
import com.maciejbartoszewski.pracainzynierska.model.Expense;
import com.maciejbartoszewski.pracainzynierska.security.CustomUserDetails;
import com.maciejbartoszewski.pracainzynierska.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class ExpenseController {
    private final ExpenseService expenseService;
    private final ExpenseMapper expenseMapper;

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(
            @RequestBody ExpenseRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Expense expense = expenseService.createExpense(dto, currentUser.user().getId());
        return ResponseEntity.ok(expenseMapper.toExpenseDto(expense));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseDto>> getExpensesByGroup(
            @PathVariable Integer groupId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Expense> expenses = expenseService.getExpensesByGroup(groupId, currentUser.user().getId());
        return ResponseEntity.ok(expenses.stream()
                .map(expenseMapper::toExpenseDto)
                .toList());
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Integer expenseId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        expenseService.deleteExpense(expenseId, currentUser.user().getId());
        return ResponseEntity.ok("Expense deleted successfully");
    }

    @GetMapping("/group/{groupId}/balances")
    public ResponseEntity<Map<Integer, Map<Integer, BigDecimal>>> getGroupBalances(
            @PathVariable Integer groupId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Map<Integer, Map<Integer, BigDecimal>> balances =
                expenseService.calculateBalances(groupId, currentUser.user().getId());
        return ResponseEntity.ok(balances);
    }
}