package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.Expense;
import com.maciejbartoszewski.pracainzynierska.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findByGroupId(Integer groupId);

    List<Expense> findByGroupIdOrderByCreatedAtDesc(Integer groupId);

    @Modifying
    @Query("DELETE FROM Expense e WHERE e.paidBy = :user")
    void deleteByPaidBy(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM Expense e WHERE e.group.id = :groupId")
    void deleteByGroupId(@Param("groupId") Integer groupId);

}