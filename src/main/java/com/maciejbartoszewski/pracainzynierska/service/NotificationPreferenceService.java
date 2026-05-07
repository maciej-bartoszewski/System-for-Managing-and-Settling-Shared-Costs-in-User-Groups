package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.dto.user.NotificationPreferencesDto;
import com.maciejbartoszewski.pracainzynierska.exception.UserNotificationPreferencesNotFoundException;
import com.maciejbartoszewski.pracainzynierska.mapper.NotificationPreferenceMapper;
import com.maciejbartoszewski.pracainzynierska.model.NotificationPreference;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.repository.NotificationPreferenceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {
    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final NotificationPreferenceMapper notificationPreferenceMapper;

    @Transactional
    public void createDefaultPreferences(User user) {
        notificationPreferenceRepository.findByUser(user)
                .orElseGet(() -> notificationPreferenceRepository.save(new NotificationPreference(true, true, true, user)));
    }

    public NotificationPreferencesDto getUserNotificationPreferences(Integer id) {
        return notificationPreferenceRepository.findByUserId(id).map(notificationPreferenceMapper::toNotificationPreferencesDto)
                .orElseThrow(() -> new UserNotificationPreferencesNotFoundException("Notification preferences not found for user with id " + id));
    }

    @Transactional
    public NotificationPreference updateNotificationPreferences(User user, NotificationPreferencesDto request) {
        NotificationPreference preferences = notificationPreferenceRepository.findByUser(user)
                .orElseThrow(() -> new UserNotificationPreferencesNotFoundException("Notification preferences not found for user"));

        if (request.notifyNewExpense() != null) {
            preferences.setNotifyNewExpense(request.notifyNewExpense());
        }
        if (request.notifyNewSettlement() != null) {
            preferences.setNotifyNewSettlement(request.notifyNewSettlement());
        }
        if (request.notifyAddedToGroup() != null) {
            preferences.setNotifyAddedToGroup(request.notifyAddedToGroup());
        }

        return notificationPreferenceRepository.save(preferences);
    }
}
