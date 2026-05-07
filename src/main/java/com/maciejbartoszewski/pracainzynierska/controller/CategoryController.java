package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.dto.category.CategoryDto;
import com.maciejbartoszewski.pracainzynierska.mapper.CategoryMapper;
import com.maciejbartoszewski.pracainzynierska.model.Category;
import com.maciejbartoszewski.pracainzynierska.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories.stream()
                .map(categoryMapper::toCategoryDto)
                .toList());
    }
}
