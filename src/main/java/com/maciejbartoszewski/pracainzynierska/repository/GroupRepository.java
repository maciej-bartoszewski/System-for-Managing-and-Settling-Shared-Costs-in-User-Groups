package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.Group;
import com.maciejbartoszewski.pracainzynierska.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    Optional<Group> findByName(String name);

    @Query(value = "SELECT * FROM groups g " +
            "WHERE (:query IS NULL OR LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER((SELECT u.email FROM users u WHERE u.id = g.created_by_id)) LIKE LOWER(CONCAT('%', :query, '%')))", nativeQuery = true)
    Page<Group> searchByNameOrCreator(@Param("query") String query, Pageable pageable);

    @Modifying
    @Query("UPDATE Group g SET g.createdBy = null WHERE g.createdBy = :user")
    void clearCreatedByUser(@Param("user") User user);

}
