package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    @GetMapping
    List<Role> getRoles() {
        return List.of(Role.values());
    }
}
