package com.maciejbartoszewski.pracainzynierska.dto.user;

public record NotificationPreferencesDto(Boolean notifyNewExpense, Boolean notifyNewSettlement,
                                         Boolean notifyAddedToGroup) {
}
