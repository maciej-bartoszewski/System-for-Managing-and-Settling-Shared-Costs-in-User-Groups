package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.Group;
import com.maciejbartoszewski.pracainzynierska.model.GroupInviteCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupInviteCodeRepository extends JpaRepository<GroupInviteCode, Long> {
    Optional<GroupInviteCode> findByCode(String code);

    Optional<GroupInviteCode> findByGroup(Group group);

    void deleteByGroup(Group group);
}
