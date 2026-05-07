package com.maciejbartoszewski.pracainzynierska.mapper;

import com.maciejbartoszewski.pracainzynierska.dto.category.CategoryDto;
import com.maciejbartoszewski.pracainzynierska.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "categoryId", source = "id")
    @Mapping(target = "categoryName", source = "name")
    CategoryDto toCategoryDto(Category category);
}