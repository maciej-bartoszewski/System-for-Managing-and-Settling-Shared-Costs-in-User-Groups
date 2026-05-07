package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.enums.AuthProvider;
import com.maciejbartoszewski.pracainzynierska.repository.CategoryRepository;
import com.maciejbartoszewski.pracainzynierska.repository.GroupMemberRepository;
import com.maciejbartoszewski.pracainzynierska.repository.GroupRepository;
import com.maciejbartoszewski.pracainzynierska.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static java.lang.Math.round;

@Service
@RequiredArgsConstructor
public class AdminStatisticsService {
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final CategoryRepository categoryRepository;

    public Long getTotalUsersCount() {
        return userRepository.count();
    }

    public Long getGoogleUsersCount() {
        return userRepository.countByAuthProvider(AuthProvider.GOOGLE);
    }

    public double getGoogleUsersRate() {
        Long totalUsers = getTotalUsersCount();
        if (totalUsers == 0) {
            return 0.0;
        }
        Long googleUsers = getGoogleUsersCount();
        return round(((double) googleUsers / totalUsers) * 100);
    }

    public Long getLoginsInLast24Hours() {
        return userRepository.countLoginsSince(LocalDateTime.now().minusHours(24));
    }

    public Long getTotalGroupsCount() {
        return groupRepository.count();
    }

    public Long getAverageGroupMembersCount() {
        Long totalGroups = getTotalGroupsCount();
        if (totalGroups == 0) {
            return 0L;
        }
        long totalMembers = groupMemberRepository.count();
        return Math.round((double) totalMembers / totalGroups);
    }

    public Long getTotalCategoriesCount() {
        return categoryRepository.count();
    }

    public String getMostPopularCategory() {
        return categoryRepository.findMostPopularCategoryName().orElse(null);
    }
}