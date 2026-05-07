package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.repository.GroupInviteCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InviteCodeCleanupService {
    private final GroupInviteCodeRepository groupInviteCodeRepository;

    @Value("${invite.code.expiry.hours}")
    private int expiryHours;

    @Scheduled(fixedRate = 1000 * 60 * 30)
    @Transactional
    public void deleteExpiredInviteCodes() {
        LocalDateTime now = LocalDateTime.now();
        groupInviteCodeRepository.findAll().stream()
                .filter(invite -> invite.getCreatedAt().plusHours(expiryHours).isBefore(now))
                .forEach(groupInviteCodeRepository::delete);
    }
}
