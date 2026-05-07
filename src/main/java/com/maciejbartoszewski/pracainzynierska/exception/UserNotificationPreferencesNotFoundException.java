package com.maciejbartoszewski.pracainzynierska.exception;

public class UserNotificationPreferencesNotFoundException extends RuntimeException {
    public UserNotificationPreferencesNotFoundException(String message) {
        super(message);
    }
}
