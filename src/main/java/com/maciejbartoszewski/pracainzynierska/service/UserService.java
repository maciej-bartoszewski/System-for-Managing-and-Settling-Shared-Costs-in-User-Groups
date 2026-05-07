package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.dto.user.*;
import com.maciejbartoszewski.pracainzynierska.enums.AuthProvider;
import com.maciejbartoszewski.pracainzynierska.enums.Role;
import com.maciejbartoszewski.pracainzynierska.exception.InvalidPasswordValidationException;
import com.maciejbartoszewski.pracainzynierska.exception.UserAlreadyExistsException;
import com.maciejbartoszewski.pracainzynierska.exception.UserNotFoundException;
import com.maciejbartoszewski.pracainzynierska.mapper.UserMapper;
import com.maciejbartoszewski.pracainzynierska.model.NotificationPreference;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final NotificationPreferenceService notificationPreferenceService;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final ExpenseRepository expenseRepository;
    private final SettlementRepository settlementRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto getUserById(Integer id) {
        return userRepository.findById(id).map(userMapper::toUserDto).orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));
    }

    @Transactional
    public User createUser(String firstName, String lastName, String email, String password, Role role, AuthProvider authProvider) {
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new UserAlreadyExistsException("Email already in use");
        }

        String encodedPassword = password != null ? passwordEncoder.encode(password) : null;
        User user = userRepository.save(new User(firstName, lastName, email, encodedPassword, role, authProvider));
        notificationPreferenceService.createDefaultPreferences(user);
        return user;
    }

    @Transactional
    public User editUserById(Integer id, UserEditRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));

        if (request.firstName() != null && !request.firstName().isBlank()) {
            user.setFirstName(request.firstName());
        }

        if (request.lastName() != null && !request.lastName().isBlank()) {
            user.setLastName(request.lastName());
        }

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        if (request.email() != null && !request.email().isBlank() && user.getAuthProvider() != AuthProvider.GOOGLE) {
            if (userRepository.findByEmailIgnoreCase(request.email()).isPresent() && !user.getEmail().equals(request.email())) {
                throw new UserAlreadyExistsException("Email already in use");
            }
            user.setEmail(request.email());
        }

        if (request.role() != null) {
            user.setRole(request.role());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));

        expenseSplitRepository.deleteSplitsByPaidBy(user);
        expenseRepository.deleteByPaidBy(user);
        expenseSplitRepository.deleteByUser(user);
        settlementRepository.deleteByFromUserOrToUser(user);
        groupMemberRepository.deleteByUser(user);
        groupRepository.clearCreatedByUser(user);
        userRepository.delete(user);
    }

    @Transactional
    public User updateUserName(Integer id, NameUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));

        if (request.firstName() != null && !request.firstName().isBlank()) {
            user.setFirstName(request.firstName());
        }

        if (request.lastName() != null && !request.lastName().isBlank()) {
            user.setLastName(request.lastName());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserEmail(Integer id, EmailUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidPasswordValidationException("Invalid password");
        }

        if (request.email() != null && !request.email().isBlank()) {
            if (userRepository.findByEmailIgnoreCase(request.email()).isPresent() && !user.getEmail().equals(request.email())) {
                throw new UserAlreadyExistsException("Email already in use");
            }
            user.setEmail(request.email());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void updateUserPassword(Integer id, PasswordUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidPasswordValidationException("Invalid password");
        }

        if (request.newPassword() != null && !request.newPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.newPassword()));
        } else {
            throw new InvalidPasswordValidationException("New password cannot be blank");
        }

        userRepository.save(user);
    }

    public NotificationPreference updateUserNotificationPreferences(Integer id, NotificationPreferencesDto request) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));
        return notificationPreferenceService.updateNotificationPreferences(user, request);
    }

    @Transactional
    public void updateLastLogin(User user) {
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }

    public Page<User> searchUsersExcludingCurrent(String email, String username, Role role, AuthProvider authProvider, Pageable pageable) {
        String roleStr = (role != null) ? role.name() : null;
        String authProviderStr = (authProvider != null) ? authProvider.name() : null;

        return userRepository.findUsersByEmailExcludingCurrent(email, username, roleStr, authProviderStr, pageable);
    }
}
