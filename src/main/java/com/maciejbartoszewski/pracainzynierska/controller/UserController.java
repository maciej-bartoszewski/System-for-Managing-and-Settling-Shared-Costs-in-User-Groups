package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.dto.user.*;
import com.maciejbartoszewski.pracainzynierska.enums.AuthProvider;
import com.maciejbartoszewski.pracainzynierska.enums.Role;
import com.maciejbartoszewski.pracainzynierska.mapper.NotificationPreferenceMapper;
import com.maciejbartoszewski.pracainzynierska.mapper.UserMapper;
import com.maciejbartoszewski.pracainzynierska.model.NotificationPreference;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.security.CustomUserDetails;
import com.maciejbartoszewski.pracainzynierska.service.NotificationPreferenceService;
import com.maciejbartoszewski.pracainzynierska.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final NotificationPreferenceService notificationPreferenceService;
    private final UserMapper userMapper;
    private final NotificationPreferenceMapper notificationPreferenceMapper;

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDto>> searchUsers(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) AuthProvider authProvider,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<User> users = userService.searchUsersExcludingCurrent(email, userDetails.user().getEmail(), role, authProvider, pageable);
        return ResponseEntity.ok(users.map(userMapper::toUserDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.user.id")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> editUserById(@PathVariable Integer id, @RequestBody @Valid UserEditRequest request) {
        User user = userService.editUserById(id, request);
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    @PatchMapping("/{id}/name")
    @PreAuthorize("#id == principal.user.id")
    public ResponseEntity<UserDto> updateUserName(@PathVariable Integer id, @RequestBody NameUpdateRequest request) {
        User user = userService.updateUserName(id, request);
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    @PutMapping("/{id}/email")
    @PreAuthorize("#id == principal.user.id and principal.user.authProvider.name() == 'LOCAL'")
    public ResponseEntity<UserDto> updateUserEmail(@PathVariable Integer id, @RequestBody @Valid EmailUpdateRequest request) {
        User user = userService.updateUserEmail(id, request);
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("#id == principal.user.id and principal.user.authProvider.name() == 'LOCAL'")
    public ResponseEntity<String> updateUserPassword(@PathVariable Integer id, @RequestBody @Valid PasswordUpdateRequest request) {
        userService.updateUserPassword(id, request);
        return ResponseEntity.ok("User password updated successfully.");
    }

    @GetMapping("/{id}/notification-preferences")
    @PreAuthorize("#id == principal.user.id")
    public ResponseEntity<NotificationPreferencesDto> updateUserNotificationPreferences(@PathVariable Integer id) {
        return ResponseEntity.ok(notificationPreferenceService.getUserNotificationPreferences(id));
    }

    @PatchMapping("/{id}/notification-preferences")
    @PreAuthorize("#id == principal.user.id")
    public ResponseEntity<NotificationPreferencesDto> updateUserNotificationPreferences(@PathVariable Integer id, @RequestBody NotificationPreferencesDto request) {
        NotificationPreference notificationPreference = userService.updateUserNotificationPreferences(id, request);
        return ResponseEntity.ok(notificationPreferenceMapper.toNotificationPreferencesDto(notificationPreference));
    }
}
