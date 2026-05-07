package com.maciejbartoszewski.pracainzynierska.mapper;

import com.maciejbartoszewski.pracainzynierska.dto.expense.ExpenseSplitDto;
import com.maciejbartoszewski.pracainzynierska.model.ExpenseSplit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExpenseSplitMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userEmail", source = "user.email")
    ExpenseSplitDto toExpenseSplitDto(ExpenseSplit expenseSplit);
}