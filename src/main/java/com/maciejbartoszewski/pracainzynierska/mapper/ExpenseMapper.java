package com.maciejbartoszewski.pracainzynierska.mapper;

import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseDto;
import com.maciejbartoszewski.pracainzynierska.model.Expense;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ExpenseSplitMapper.class})
public interface ExpenseMapper {
    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "groupName", source = "group.name")
    @Mapping(target = "paidByUserId", source = "paidBy.id")
    @Mapping(target = "paidByUserEmail", source = "paidBy.email")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ExpenseDto toExpenseDto(Expense expense);
}