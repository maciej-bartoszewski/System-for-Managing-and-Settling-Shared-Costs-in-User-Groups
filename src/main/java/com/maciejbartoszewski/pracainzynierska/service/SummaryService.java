package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.dto.chart.ChartSeriesDto;
import com.maciejbartoszewski.pracainzynierska.dto.chart.GroupBalancesChartDto;
import com.maciejbartoszewski.pracainzynierska.dto.chart.PieSliceDto;
import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseItemDto;
import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseSummaryDto;
import com.maciejbartoszewski.pracainzynierska.dto.user.UserBalanceItemDto;
import com.maciejbartoszewski.pracainzynierska.dto.user.UserBalancesDto;
import com.maciejbartoszewski.pracainzynierska.model.ExpenseSplit;
import com.maciejbartoszewski.pracainzynierska.model.Group;
import com.maciejbartoszewski.pracainzynierska.model.GroupMember;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.repository.ExpenseSplitRepository;
import com.maciejbartoszewski.pracainzynierska.repository.GroupMemberRepository;
import com.maciejbartoszewski.pracainzynierska.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SummaryService {
    private final ExpenseSplitRepository expenseSplitRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final ExpenseService expenseService;

    public List<PieSliceDto> getCategoryShare(Integer userId, LocalDate from, LocalDate to) {
        List<ExpenseSplit> splits = expenseSplitRepository.findByUserId(userId).stream()
                .filter(s -> {
                    LocalDate d = s.getExpense().getCreatedAt().toLocalDate();
                    return (from == null || !d.isBefore(from)) && (to == null || !d.isAfter(to));
                })
                .toList();

        Map<String, BigDecimal> byCat = new HashMap<>();
        for (ExpenseSplit s : splits) {
            String cat = s.getExpense().getCategory() != null ? s.getExpense().getCategory().getName() : "Uncategorized";
            byCat.merge(cat, s.getAmount(), BigDecimal::add);
        }

        return byCat.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .map(e -> new PieSliceDto(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    public GroupBalancesChartDto getGroupBalancesChartWithData(Integer userId) {
        UserBalancesDto balances = getUserBalancesAllGroups(userId);

        Map<String, BigDecimal> iOweMap = new LinkedHashMap<>();
        Map<String, BigDecimal> owedToMeMap = new LinkedHashMap<>();

        for (UserBalanceItemDto it : balances.iOwe()) {
            iOweMap.merge(it.groupName(), it.amount(), BigDecimal::add);
            owedToMeMap.putIfAbsent(it.groupName(), BigDecimal.ZERO);
        }
        for (UserBalanceItemDto it : balances.owedToMe()) {
            owedToMeMap.merge(it.groupName(), it.amount(), BigDecimal::add);
            iOweMap.putIfAbsent(it.groupName(), BigDecimal.ZERO);
        }

        List<String> labels = new ArrayList<>(iOweMap.keySet());
        for (String g : owedToMeMap.keySet()) if (!labels.contains(g)) labels.add(g);

        List<BigDecimal> iOweData = labels.stream().map(l -> iOweMap.getOrDefault(l, BigDecimal.ZERO)).collect(Collectors.toList());
        List<BigDecimal> owedToMeData = labels.stream().map(l -> owedToMeMap.getOrDefault(l, BigDecimal.ZERO)).collect(Collectors.toList());

        ChartSeriesDto s1 = new ChartSeriesDto("iOwe", iOweData);
        ChartSeriesDto s2 = new ChartSeriesDto("owedToMe", owedToMeData);

        return new GroupBalancesChartDto(labels, List.of(s1, s2), balances.iOwe(), balances.owedToMe());
    }

    public UserBalancesDto getUserBalancesAllGroups(Integer userId) {
        List<Group> userGroups = groupMemberRepository.findByIdUserId(userId).stream().map(GroupMember::getGroup).toList();

        List<UserBalanceItemDto> iOwe = new ArrayList<>();
        List<UserBalanceItemDto> owedToMe = new ArrayList<>();

        for (Group group : userGroups) {
            Map<Integer, Map<Integer, BigDecimal>> groupBalances = expenseService.calculateBalances(group.getId(), userId);

            if (groupBalances.containsKey(userId)) {
                for (Map.Entry<Integer, BigDecimal> entry : groupBalances.get(userId).entrySet()) {
                    Integer creditorId = entry.getKey();
                    BigDecimal amount = entry.getValue();
                    User creditor = userRepository.findById(creditorId).orElseThrow();

                    iOwe.add(new UserBalanceItemDto(group.getId(), group.getName(), creditorId, creditor.getFirstName() + " " + creditor.getLastName(), amount));
                }
            }

            for (Map.Entry<Integer, Map<Integer, BigDecimal>> entry : groupBalances.entrySet()) {
                Integer debtorId = entry.getKey();
                if (!debtorId.equals(userId) && entry.getValue().containsKey(userId)) {
                    BigDecimal amount = entry.getValue().get(userId);
                    User debtor = userRepository.findById(debtorId).orElseThrow();

                    owedToMe.add(new UserBalanceItemDto(group.getId(), group.getName(), debtorId, debtor.getFirstName() + " " + debtor.getLastName(), amount));
                }
            }
        }

        return new UserBalancesDto(iOwe, owedToMe);
    }

    public ExpenseSummaryDto getExpensesSummaryByUserAndDate(Integer userId, LocalDate from, LocalDate to) {

        List<ExpenseSplit> userSplits = expenseSplitRepository.findByUserId(userId).stream().filter(s -> (from == null || !s.getExpense().getCreatedAt().toLocalDate().isBefore(from)) && (to == null || !s.getExpense().getCreatedAt().toLocalDate().isAfter(to))).toList();

        BigDecimal total = userSplits.stream().map(ExpenseSplit::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ExpenseItemDto> items = userSplits.stream().map(s -> new ExpenseItemDto(s.getExpense().getDescription(), s.getAmount(), s.getExpense().getCreatedAt().toLocalDate())).toList();

        return new ExpenseSummaryDto(total, items);
    }
}
