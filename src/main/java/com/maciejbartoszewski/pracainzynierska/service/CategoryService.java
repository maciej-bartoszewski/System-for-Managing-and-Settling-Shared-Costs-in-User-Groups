package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.model.Category;
import com.maciejbartoszewski.pracainzynierska.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public boolean isCategoryExists(String name) {
        return categoryRepository.findByName(name).isPresent();
    }

    public void createCategory(String category) {
        categoryRepository.save(new Category(category));
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
