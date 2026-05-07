package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByName(String name);

    @Query("SELECT c.name FROM Category c JOIN Expense e ON e.category = c " +
            "GROUP BY c.id, c.name ORDER BY COUNT(e) DESC LIMIT 1")
    Optional<String> findMostPopularCategoryName();
}
