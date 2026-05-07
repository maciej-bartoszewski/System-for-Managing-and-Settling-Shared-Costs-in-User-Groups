package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.exception.AccessDeniedException;
import com.maciejbartoszewski.pracainzynierska.exception.GroupNotFoundException;
import com.maciejbartoszewski.pracainzynierska.exception.UserNotFoundException;
import com.maciejbartoszewski.pracainzynierska.model.Group;
import com.maciejbartoszewski.pracainzynierska.model.GroupMemberId;
import com.maciejbartoszewski.pracainzynierska.model.Settlement;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.repository.GroupMemberRepository;
import com.maciejbartoszewski.pracainzynierska.repository.GroupRepository;
import com.maciejbartoszewski.pracainzynierska.repository.SettlementRepository;
import com.maciejbartoszewski.pracainzynierska.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettlementService {
    private final SettlementRepository settlementRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final EmailService emailService;

    @Transactional
    public Settlement createSettlement(Integer groupId, Integer toUserId, BigDecimal amount,
                                       Integer currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found"));

        verifyUserInGroup(group.getId(), currentUserId);
        verifyUserInGroup(group.getId(), toUserId);

        User fromUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UserNotFoundException("From user not found"));
        User toUser = userRepository.findById(toUserId)
                .orElseThrow(() -> new UserNotFoundException("To user not found"));

        Settlement settlement = new Settlement(group, fromUser, toUser, amount);

        emailService.sendNewSettlementEmail(settlement);
        return settlementRepository.save(settlement);
    }

    @Transactional
    public void deleteSettlement(Integer settlementId, Integer currentUserId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        if (!settlement.getFromUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the user who created the settlement can delete it");
        }

        settlementRepository.delete(settlement);
    }

    public List<Settlement> getSettlementsByGroup(Integer groupId, Integer currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found"));

        verifyUserInGroup(group.getId(), currentUserId);

        return settlementRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
    }

    public List<Settlement> getSettlementsByUser(Integer userId, Integer currentUserId) {
        if (!userId.equals(currentUserId)) {
            throw new AccessDeniedException("You can only view your own settlements");
        }

        return settlementRepository.findByFromUserIdOrToUserIdOrderByCreatedAtDesc(userId, userId);
    }

    private void verifyUserInGroup(Integer groupId, Integer userId) {
        GroupMemberId memberId = new GroupMemberId(groupId, userId);
        if (!groupMemberRepository.existsById(memberId)) {
            throw new AccessDeniedException("User does not have access to this group");
        }
    }
}