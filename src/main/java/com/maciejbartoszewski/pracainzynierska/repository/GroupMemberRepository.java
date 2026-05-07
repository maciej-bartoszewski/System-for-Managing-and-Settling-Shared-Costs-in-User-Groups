package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.GroupMember;
import com.maciejbartoszewski.pracainzynierska.model.GroupMemberId;
import com.maciejbartoszewski.pracainzynierska.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMemberId> {
    boolean existsById(GroupMemberId id);

    List<GroupMember> findByIdUserId(Integer userId);

    @Modifying
    @Query("DELETE FROM GroupMember gm WHERE gm.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM GroupMember gm WHERE gm.group.id = :groupId")
    void deleteByGroupId(@Param("groupId") Integer groupId);
}
