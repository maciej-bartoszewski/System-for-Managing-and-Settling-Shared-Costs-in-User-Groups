package com.maciejbartoszewski.pracainzynierska.exception;

public class InvalidPasswordValidationException extends RuntimeException {
    public InvalidPasswordValidationException(String message) {
        super(message);
    }
}
