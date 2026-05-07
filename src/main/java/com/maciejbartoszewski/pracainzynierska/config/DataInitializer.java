package com.maciejbartoszewski.pracainzynierska.config;

import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseRequestDto;
import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseSplitRequestDto;
import com.maciejbartoszewski.pracainzynierska.enums.AuthProvider;
import com.maciejbartoszewski.pracainzynierska.enums.Role;
import com.maciejbartoszewski.pracainzynierska.model.*;
import com.maciejbartoszewski.pracainzynierska.repository.*;
import com.maciejbartoszewski.pracainzynierska.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final SettlementRepository settlementRepository;
    private final UserService userService;
    private final GroupService groupService;
    private final CategoryService categoryService;
    private final ExpenseService expenseService;
    private final SettlementService settlementService;

    @Override
    public void run(String... args) {
        createAdmins();
        createLocalUsers();
        createGoogleUsers();
        createSpecialUsers();

        createGroupsWithMembers();

        createCategories();

        createSampleExpenses();

        createSampleSettlements();
    }

    private void createAdmins() {
        createUserIfNotExists("Admin", "Admin", "admin@admin.com", "pass123", Role.ADMIN, AuthProvider.LOCAL);
        createUserIfNotExists("Admin", "One", "admin.one@gmail.com", "pass123", Role.ADMIN, AuthProvider.LOCAL);
        createUserIfNotExists("Admin", "Two", "admin.two@gmail.com", "pass123", Role.ADMIN, AuthProvider.LOCAL);
    }

    private void createLocalUsers() {
        createUserIfNotExists("Jan", "Kowalski", "jan.kowalski@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Anna", "Nowak", "anna.nowak@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Ewa", "Wiśniewska", "ewa.wisniewska@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Piotr", "Zieliński", "piotr.zielinski@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Magda", "Szymańska", "magda.szymanska@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Tomasz", "Lewandowski", "tomasz.lewandowski@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Karolina", "Dąbrowska", "karolina.dabrowska@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Michał", "Wójcik", "michal.wojcik@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Natalia", "Kaczmarek", "natalia.kaczmarek@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
        createUserIfNotExists("Kamil", "Mazur", "kamil.mazur@gmail.com", "pass123", Role.USER, AuthProvider.LOCAL);
    }

    private void createGoogleUsers() {
        createUserIfNotExists("Julia", "Kowalczyk", "julia.kowalczyk@gmail.com", null, Role.USER, AuthProvider.GOOGLE);
        createUserIfNotExists("Marcin", "Jankowski", "marcin.jankowski@gmail.com", null, Role.USER, AuthProvider.GOOGLE);
        createUserIfNotExists("Oliwia", "Nowicka", "oliwia.nowicka@gmail.com", null, Role.USER, AuthProvider.GOOGLE);
        createUserIfNotExists("Adam", "Wróbel", "adam.wrobel@gmail.com", null, Role.USER, AuthProvider.GOOGLE);
        createUserIfNotExists("Karol", "Kamiński", "karol.kaminski@gmail.com", null, Role.USER, AuthProvider.GOOGLE);
    }

    private void createSpecialUsers() {
        createUserIfNotExists("User", "Blocked", "blockeduser@gmail.com", "pass123", Role.BLOCKED, AuthProvider.LOCAL);
    }

    private void createGroupsWithMembers() {
        createGroupWithMembers("Majówka 2025", "Wspólny wyjazd na długi weekend",
                "marcin.jankowski@gmail.com", Arrays.asList("jan.kowalski@gmail.com", "ewa.wisniewska@gmail.com", "julia.kowalczyk@gmail.com"));

        createGroupWithMembers("Sylwester w górach", "Grupowy wyjazd sylwestrowy",
                "jan.kowalski@gmail.com", Arrays.asList("magda.szymanska@gmail.com", "karolina.dabrowska@gmail.com", "adam.wrobel@gmail.com"));

        createGroupWithMembers("Open'er Festival", "Wypad na letni festiwal muzyczny",
                "piotr.zielinski@gmail.com", Arrays.asList("natalia.kaczmarek@gmail.com", "oliwia.nowicka@gmail.com"));

        createGroupWithMembers("Chorwacja 2025", "Wakacyjny wyjazd ze znajomymi",
                "kamil.mazur@gmail.com", Arrays.asList("marcin.jankowski@gmail.com", "anna.nowak@gmail.com", "julia.kowalczyk@gmail.com"));

        createGroupWithMembers("Barcelona trip", "Krótki wypad za granicę",
                "jan.kowalski@gmail.com", Arrays.asList("piotr.zielinski@gmail.com", "magda.szymanska@gmail.com", "ewa.wisniewska@gmail.com"));

        createGroupWithMembers("Mazury 2025", "Letni weekend nad jeziorami",
                "ewa.wisniewska@gmail.com", Arrays.asList("tomasz.lewandowski@gmail.com", "natalia.kaczmarek@gmail.com", "adam.wrobel@gmail.com"));

        createGroupWithMembers("Koncert w Krakowie", "Wspólna wyprawa na wydarzenie muzyczne",
                "karolina.dabrowska@gmail.com", Arrays.asList("kamil.mazur@gmail.com", "oliwia.nowicka@gmail.com"));

        createGroupWithMembers("Berlin weekend", "Zwiedzanie i wspólne spędzanie czasu",
                "marcin.jankowski@gmail.com", Arrays.asList("julia.kowalczyk@gmail.com", "karol.kaminski@gmail.com", "michal.wojcik@gmail.com"));

        createGroupWithMembers("Rowerowy wypad", "Weekendowa wyprawa z noclegiem",
                "anna.nowak@gmail.com", Arrays.asList("ewa.wisniewska@gmail.com", "magda.szymanska@gmail.com", "julia.kowalczyk@gmail.com"));
    }


    private void createCategories() {
        List<String> categories = Arrays.asList(
                "Food",
                "Transport",
                "Accommodations",
                "Entertainment",
                "Shopping",
                "Tickets",
                "Gifts",
                "Health",
                "Other"
        );

        for (String category : categories) {
            createCategoryIfNotExists(category);
        }
    }

    private void createSampleExpenses() {
        if (expenseRepository.count() > 0) {
            return;
        }

        createExpenseWithSplits(
                "Majówka 2025",
                "marcin.jankowski@gmail.com",
                "Nocleg w hotelu",
                new BigDecimal("800.00"),
                Map.of(
                        "marcin.jankowski@gmail.com", new BigDecimal("200.00"),
                        "jan.kowalski@gmail.com", new BigDecimal("200.00"),
                        "ewa.wisniewska@gmail.com", new BigDecimal("200.00"),
                        "julia.kowalczyk@gmail.com", new BigDecimal("200.00")
                ),
                "Accommodations"
        );

        createExpenseWithSplits(
                "Majówka 2025",
                "jan.kowalski@gmail.com",
                "Przejazd samochodem",
                new BigDecimal("100.00"),
                Map.of(
                        "marcin.jankowski@gmail.com", new BigDecimal("70.00"),
                        "jan.kowalski@gmail.com", new BigDecimal("30.00")
                ),
                "Transport"
        );

        createExpenseWithSplits(
                "Majówka 2025",
                "ewa.wisniewska@gmail.com",
                "Paliwo",
                new BigDecimal("250.00"),
                Map.of(
                        "marcin.jankowski@gmail.com", new BigDecimal("62.50"),
                        "jan.kowalski@gmail.com", new BigDecimal("62.50"),
                        "ewa.wisniewska@gmail.com", new BigDecimal("62.50"),
                        "julia.kowalczyk@gmail.com", new BigDecimal("62.50")
                ),
                "Transport"
        );

        createExpenseWithSplits(
                "Majówka 2025",
                "julia.kowalczyk@gmail.com",
                "Obiad w restauracji",
                new BigDecimal("420.00"),
                Map.of(
                        "marcin.jankowski@gmail.com", new BigDecimal("120.00"),
                        "jan.kowalski@gmail.com", new BigDecimal("100.00"),
                        "ewa.wisniewska@gmail.com", new BigDecimal("150.00"),
                        "julia.kowalczyk@gmail.com", new BigDecimal("50.00")
                ),
                "Food"
        );

        createExpenseWithSplits(
                "Sylwester w górach",
                "jan.kowalski@gmail.com",
                "Domek w górach",
                new BigDecimal("1200.00"),
                Map.of(
                        "jan.kowalski@gmail.com", new BigDecimal("300.00"),
                        "magda.szymanska@gmail.com", new BigDecimal("300.00"),
                        "karolina.dabrowska@gmail.com", new BigDecimal("300.00"),
                        "adam.wrobel@gmail.com", new BigDecimal("300.00")
                ),
                "Accommodations"
        );

        createExpenseWithSplits(
                "Sylwester w górach",
                "karolina.dabrowska@gmail.com",
                "Narty i sprzęt",
                new BigDecimal("800.00"),
                Map.of(
                        "jan.kowalski@gmail.com", new BigDecimal("200.00"),
                        "magda.szymanska@gmail.com", new BigDecimal("200.00"),
                        "karolina.dabrowska@gmail.com", new BigDecimal("200.00"),
                        "adam.wrobel@gmail.com", new BigDecimal("200.00")
                ),
                "Entertainment"
        );

        createExpenseWithSplits(
                "Sylwester w górach",
                "magda.szymanska@gmail.com",
                "Przekąski i napoje",
                new BigDecimal("450.00"),
                Map.of(
                        "jan.kowalski@gmail.com", new BigDecimal("112.50"),
                        "magda.szymanska@gmail.com", new BigDecimal("112.50"),
                        "karolina.dabrowska@gmail.com", new BigDecimal("112.50"),
                        "adam.wrobel@gmail.com", new BigDecimal("112.50")
                ),
                "Food"
        );
    }

    private void createSampleSettlements() {
        if (settlementRepository.count() > 0) {
            return;
        }

        createSettlement(
                "Majówka 2025",
                "jan.kowalski@gmail.com",
                "marcin.jankowski@gmail.com",
                new BigDecimal("180.00")
        );

        createSettlement(
                "Sylwester w górach",
                "karolina.dabrowska@gmail.com",
                "jan.kowalski@gmail.com",
                new BigDecimal("250.00")
        );
    }

    private void createUserIfNotExists(String firstName, String lastName, String email,
                                       String password, Role role, AuthProvider provider) {
        if (userRepository.findByEmailIgnoreCase(email).isEmpty()) {
            userService.createUser(firstName, lastName, email, password, role, provider);
        }
    }

    private Group createGroupIfNotExists(String name, String description, User owner) {
        return groupRepository.findByName(name)
                .orElseGet(() -> groupService.createGroup(name, description, owner.getId()));
    }

    private void createGroupWithMembers(String name, String description, String ownerEmail, List<String> memberEmails) {
        User owner = userRepository.findByEmailIgnoreCase(ownerEmail).get();

        boolean groupExists = groupRepository.findByName(name).isPresent();
        Group group = createGroupIfNotExists(name, description, owner);

        if (!groupExists) {
            for (String memberEmail : memberEmails) {
                User member = userRepository.findByEmailIgnoreCase(memberEmail).get();
                groupMemberRepository.save(new GroupMember(new GroupMemberId(group.getId(), member.getId()), group, member));
            }
        }
    }

    private void createCategoryIfNotExists(String name) {
        if (!categoryService.isCategoryExists(name)) {
            categoryService.createCategory(name);
        }
    }

    private void createExpenseWithSplits(String groupName, String paidByEmail, String description,
                                         BigDecimal totalAmount, Map<String, BigDecimal> splits, String categoryName) {
        try {
            Group group = groupRepository.findByName(groupName)
                    .orElseThrow(() -> new RuntimeException("Group not found: " + groupName));
            User paidBy = userRepository.findByEmailIgnoreCase(paidByEmail)
                    .orElseThrow(() -> new RuntimeException("User not found: " + paidByEmail));
            Category category = categoryRepository.findByName(categoryName)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + categoryName));

            List<ExpenseSplitRequestDto> splitDtos = new ArrayList<>();
            for (Map.Entry<String, BigDecimal> entry : splits.entrySet()) {
                User user = userRepository.findByEmailIgnoreCase(entry.getKey())
                        .orElseThrow(() -> new RuntimeException("User not found: " + entry.getKey()));
                splitDtos.add(new ExpenseSplitRequestDto(user.getId(), entry.getValue()));
            }

            ExpenseRequestDto expenseRequestDto = new ExpenseRequestDto(
                    group.getId(),
                    description,
                    category.getId(),
                    totalAmount,
                    splitDtos
            );

            expenseService.createExpense(expenseRequestDto, paidBy.getId());
        } catch (Exception e) {
            System.err.println("Error creating expense: " + e.getMessage());
        }
    }

    private void createSettlement(String groupName, String fromUserEmail, String toUserEmail, BigDecimal amount) {
        try {
            Group group = groupRepository.findByName(groupName)
                    .orElseThrow(() -> new RuntimeException("Group not found: " + groupName));
            User fromUser = userRepository.findByEmailIgnoreCase(fromUserEmail)
                    .orElseThrow(() -> new RuntimeException("User not found: " + fromUserEmail));
            User toUser = userRepository.findByEmailIgnoreCase(toUserEmail)
                    .orElseThrow(() -> new RuntimeException("User not found: " + toUserEmail));

            settlementService.createSettlement(group.getId(), toUser.getId(), amount, fromUser.getId());
        } catch (Exception e) {
            System.err.println("Error creating settlement: " + e.getMessage());
        }
    }
}