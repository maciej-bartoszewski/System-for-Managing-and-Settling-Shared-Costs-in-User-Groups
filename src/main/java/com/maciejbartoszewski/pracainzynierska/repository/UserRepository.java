package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.enums.AuthProvider;
import com.maciejbartoszewski.pracainzynierska.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmailIgnoreCase(String email);

    Long countByAuthProvider(AuthProvider authProvider);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :since")
    Long countLoginsSince(@Param("since") LocalDateTime since);

    @Query(value = "SELECT * FROM users u WHERE " +
            "(:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
            "AND (:role IS NULL OR u.role = :role) " +
            "AND (:authProvider IS NULL OR u.auth_provider = :authProvider) " +
            "AND u.email <> :currentUserEmail",
            nativeQuery = true)
    Page<User> findUsersByEmailExcludingCurrent(
            @Param("email") String email,
            @Param("currentUserEmail") String currentUserEmail,
            @Param("role") String role,
            @Param("authProvider") String authProvider,
            Pageable pageable);
}
