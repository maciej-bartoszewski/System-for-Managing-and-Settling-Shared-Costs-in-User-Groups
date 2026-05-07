package com.maciejbartoszewski.pracainzynierska.repository;

import com.maciejbartoszewski.pracainzynierska.model.NotificationPreference;
import com.maciejbartoszewski.pracainzynierska.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Integer> {
    Optional<NotificationPreference> findByUser(User user);

    Optional<NotificationPreference> findByUserId(Integer userId);
}
