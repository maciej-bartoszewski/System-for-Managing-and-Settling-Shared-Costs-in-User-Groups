package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.ExpenseSplit;
import com.maciejbartoszewski.pracainzynierska.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Integer> {
    List<ExpenseSplit> findByUserId(Integer userId);

    @Modifying
    @Query("DELETE FROM ExpenseSplit es WHERE es.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM ExpenseSplit es WHERE es.expense IN (SELECT e FROM Expense e WHERE e.paidBy = :user)")
    void deleteSplitsByPaidBy(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM ExpenseSplit es WHERE es.expense.group.id = :groupId")
    void deleteByExpenseGroupId(@Param("groupId") Integer groupId);
}
