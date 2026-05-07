package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.service.AdminStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminStatisticsController {
    private final AdminStatisticsService adminStatisticsService;

    @GetMapping("/total-users")
    public ResponseEntity<Long> getTotalUsersCount() {
        return ResponseEntity.ok(adminStatisticsService.getTotalUsersCount());
    }

    @GetMapping("/google-users-rate")
    public ResponseEntity<Double> getGoogleUsersRate() {
        return ResponseEntity.ok(adminStatisticsService.getGoogleUsersRate());
    }

    @GetMapping("/logins-last-24-hours")
    public ResponseEntity<Long> getLoginsInLast24Hours() {
        return ResponseEntity.ok(adminStatisticsService.getLoginsInLast24Hours());
    }

    @GetMapping("/total-groups")
    public ResponseEntity<Long> getTotalGroupsCount() {
        return ResponseEntity.ok(adminStatisticsService.getTotalGroupsCount());
    }

    @GetMapping("/average-group-members")
    public ResponseEntity<Long> getAverageGroupMembersCount() {
        return ResponseEntity.ok(adminStatisticsService.getAverageGroupMembersCount());
    }

    @GetMapping("/most-popular-category")
    public ResponseEntity<String> getMostPopularCategory() {
        return ResponseEntity.ok(adminStatisticsService.getMostPopularCategory());
    }

    @GetMapping("/total-categories")
    public ResponseEntity<Long> getTotalCategoriesCount() {
        return ResponseEntity.ok(adminStatisticsService.getTotalCategoriesCount());
    }
}