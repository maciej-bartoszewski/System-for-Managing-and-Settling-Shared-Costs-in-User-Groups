package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.Settlement;
import com.maciejbartoszewski.pracainzynierska.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Integer> {
    List<Settlement> findByGroupId(Integer groupId);

    List<Settlement> findByGroupIdOrderByCreatedAtDesc(Integer groupId);

    List<Settlement> findByFromUserIdOrToUserIdOrderByCreatedAtDesc(Integer fromUserId, Integer toUserId);

    @Modifying
    @Query("DELETE FROM Settlement s WHERE s.fromUser = :user OR s.toUser = :user")
    void deleteByFromUserOrToUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM Settlement s WHERE s.group.id = :groupId")
    void deleteByGroupId(@Param("groupId") Integer groupId);
}