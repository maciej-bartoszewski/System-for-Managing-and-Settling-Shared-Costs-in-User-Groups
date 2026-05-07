package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseRequestDto;
import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseSplitRequestDto;
import com.maciejbartoszewski.pracainzynierska.exception.*;
import com.maciejbartoszewski.pracainzynierska.model.*;
import com.maciejbartoszewski.pracainzynierska.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final SettlementRepository settlementRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final CategoryRepository categoryRepository;
    private final EmailService emailService;

    @Transactional
    public Expense createExpense(ExpenseRequestDto dto, Integer currentUserId) {
        Group group = groupRepository.findById(dto.groupId()).orElseThrow(() -> new GroupNotFoundException("Group not found"));
        verifyUserInGroup(group.getId(), currentUserId);

        User paidBy = userRepository.findById(currentUserId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Category category = categoryRepository.findById(dto.categoryId()).orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        Expense expense = new Expense(group, paidBy, dto.description(), category, dto.totalAmount());
        expense = expenseRepository.save(expense);

        List<ExpenseSplit> splits = new ArrayList<>();
        for (ExpenseSplitRequestDto splitDto : dto.splits()) {
            User user = userRepository.findById(splitDto.userId())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
            verifyUserInGroup(group.getId(), user.getId());

            ExpenseSplit split = new ExpenseSplit(expense, user, splitDto.amount());
            splits.add(split);
        }

        expenseSplitRepository.saveAll(splits);
        expense.setSplits(splits);

        emailService.sendNewExpenseEmail(expense);
        return expense;
    }

    public List<Expense> getExpensesByGroup(Integer groupId, Integer currentUserId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new GroupNotFoundException("Group not found"));

        verifyUserInGroup(group.getId(), currentUserId);

        return expenseRepository.findByGroupIdOrderByCreatedAtDesc(group.getId());
    }

    @Transactional
    public void deleteExpense(Integer expenseId, Integer currentUserId) {
        Expense expense = expenseRepository.findById(expenseId).orElseThrow(() -> new ExpenseNotFoundException("Expense not found"));

        if (!expense.getPaidBy().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the user who created the expense can delete it");
        }

        expenseSplitRepository.deleteAll(expense.getSplits());
        expenseRepository.delete(expense);
    }

    public Map<Integer, Map<Integer, BigDecimal>> calculateBalances(Integer groupId, Integer currentUserId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new GroupNotFoundException("Group not found"));
        verifyUserInGroup(group.getId(), currentUserId);

        List<Expense> expenses = expenseRepository.findByGroupId(group.getId());
        List<Settlement> settlements = settlementRepository.findByGroupId(group.getId());

        // [dłużnikId -> [wierzycielId -> kwota]]
        Map<Integer, Map<Integer, BigDecimal>> balances = new HashMap<>();

        // Dodaj wydatki do sald
        for (Expense expense : expenses) {
            Integer payerId = expense.getPaidBy().getId();
            for (ExpenseSplit split : expense.getSplits()) {
                Integer debtorId = split.getUser().getId();
                BigDecimal amount = split.getAmount();

                // Jeśli ktoś inny niż płacący jest dłużnikiem
                if (!debtorId.equals(payerId)) {
                    // Pobierz lub utwórz mapę wierzycieli dla dłużnika
                    Map<Integer, BigDecimal> creditorMap = balances.get(debtorId);
                    if (creditorMap == null) {
                        creditorMap = new HashMap<>();
                        balances.put(debtorId, creditorMap);
                    }
                    // Dodaj lub powiększ dług wobec wierzyciela
                    BigDecimal currentDebt = creditorMap.get(payerId);
                    if (currentDebt == null) {
                        creditorMap.put(payerId, amount);
                    } else {
                        creditorMap.put(payerId, currentDebt.add(amount));
                    }
                }
            }
        }

        // Uwzględnij rozliczenia (spłaty długów)
        for (Settlement settlement : settlements) {
            Integer fromUserId = settlement.getFromUser().getId();
            Integer toUserId = settlement.getToUser().getId();
            BigDecimal amount = settlement.getAmount();

            // Sprawdź, czy istnieje dług od fromUserId do toUserId
            Map<Integer, BigDecimal> creditorMap = balances.get(fromUserId);
            if (creditorMap != null && creditorMap.containsKey(toUserId)) {
                BigDecimal currentDebt = creditorMap.get(toUserId);
                BigDecimal newDebt = currentDebt.subtract(amount);

                // Jeśli dług został spłacony lub nadpłacony, usuń wpis
                if (newDebt.compareTo(BigDecimal.ZERO) <= 0) {
                    creditorMap.remove(toUserId);
                    if (creditorMap.isEmpty()) {
                        balances.remove(fromUserId);
                    }
                    // Jeśli powstała nadpłata, dodaj dług w drugą stronę
                    if (newDebt.compareTo(BigDecimal.ZERO) < 0) {
                        Map<Integer, BigDecimal> reverseCreditorMap = balances.get(toUserId);
                        if (reverseCreditorMap == null) {
                            reverseCreditorMap = new HashMap<>();
                            balances.put(toUserId, reverseCreditorMap);
                        }
                        BigDecimal reverseDebt = reverseCreditorMap.get(fromUserId);
                        if (reverseDebt == null) {
                            reverseCreditorMap.put(fromUserId, newDebt.abs());
                        } else {
                            reverseCreditorMap.put(fromUserId, reverseDebt.add(newDebt.abs()));
                        }
                    }
                } else {
                    // Zaktualizuj pozostały dług
                    creditorMap.put(toUserId, newDebt);
                }
            } else {
                Map<Integer, BigDecimal> reverseCreditorMap = balances.get(toUserId);
                if (reverseCreditorMap == null) {
                    reverseCreditorMap = new HashMap<>();
                    balances.put(toUserId, reverseCreditorMap);
                }
                BigDecimal reverseDebt = reverseCreditorMap.get(fromUserId);
                if (reverseDebt == null) {
                    reverseCreditorMap.put(fromUserId, amount);
                } else {
                    reverseCreditorMap.put(fromUserId, reverseDebt.add(amount));
                }
            }
        }

        // Kompensacja wzajemnych długów (wyrównanie)
        Map<Integer, Map<Integer, BigDecimal>> compensation = new HashMap<>();
        for (Map.Entry<Integer, Map<Integer, BigDecimal>> entry : balances.entrySet()) {
            compensation.put(entry.getKey(), new HashMap<>(entry.getValue()));
        }

        for (Integer debtorId : new ArrayList<>(compensation.keySet())) {
            if (!compensation.containsKey(debtorId)) continue;
            Map<Integer, BigDecimal> creditors = compensation.get(debtorId);

            for (Integer creditorId : new ArrayList<>(creditors.keySet())) {
                if (!creditors.containsKey(creditorId)) continue;

                // Jeśli obie strony są sobie winne pieniądze
                if (compensation.containsKey(creditorId) && compensation.get(creditorId).containsKey(debtorId)) {
                    BigDecimal debt = creditors.get(creditorId);
                    BigDecimal reverseDebt = compensation.get(creditorId).get(debtorId);

                    if (debt.compareTo(reverseDebt) > 0) {
                        // Dłużnik jest winien więcej, zostaje tylko różnica
                        creditors.put(creditorId, debt.subtract(reverseDebt));
                        compensation.get(creditorId).remove(debtorId);
                        if (compensation.get(creditorId).isEmpty()) {
                            compensation.remove(creditorId);
                        }
                    } else if (debt.compareTo(reverseDebt) < 0) {
                        // Wierzyciel jest winien więcej, zostaje tylko różnica w drugą stronę
                        compensation.get(creditorId).put(debtorId, reverseDebt.subtract(debt));
                        creditors.remove(creditorId);
                        if (creditors.isEmpty()) {
                            compensation.remove(debtorId);
                        }
                    } else {
                        // Kwoty są równe, usuń oba wpisy
                        creditors.remove(creditorId);
                        compensation.get(creditorId).remove(debtorId);
                        if (creditors.isEmpty()) {
                            compensation.remove(debtorId);
                        }
                        if (compensation.containsKey(creditorId) && compensation.get(creditorId).isEmpty()) {
                            compensation.remove(creditorId);
                        }
                    }
                }
            }
        }

        return compensation;
    }

    private void verifyUserInGroup(Integer groupId, Integer userId) {
        GroupMemberId memberId = new GroupMemberId(groupId, userId);
        if (!groupMemberRepository.existsById(memberId)) {
            throw new AccessDeniedException("User does not have access to this group");
        }
    }
}