package com.maciejbartoszewski.pracainzynierska.mapper;

import com.maciejbartoszewski.pracainzynierska.dto.user.NotificationPreferencesDto;
import com.maciejbartoszewski.pracainzynierska.model.NotificationPreference;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationPreferenceMapper {
    NotificationPreferencesDto toNotificationPreferencesDto(NotificationPreference notificationPreference);
}
