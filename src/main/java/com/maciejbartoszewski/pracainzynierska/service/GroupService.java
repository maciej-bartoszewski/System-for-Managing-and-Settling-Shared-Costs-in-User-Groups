package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.dto.group.GroupRequestDto;
import com.maciejbartoszewski.pracainzynierska.enums.Role;
import com.maciejbartoszewski.pracainzynierska.exception.AccessDeniedException;
import com.maciejbartoszewski.pracainzynierska.exception.GroupNotFoundException;
import com.maciejbartoszewski.pracainzynierska.exception.InvalidCodeException;
import com.maciejbartoszewski.pracainzynierska.exception.UserNotFoundException;
import com.maciejbartoszewski.pracainzynierska.model.*;
import com.maciejbartoszewski.pracainzynierska.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final ExpenseRepository expenseRepository;
    private final SettlementRepository settlementRepository;
    private final GroupInviteCodeRepository groupInviteCodeRepository;
    private final EmailService emailService;

    @Value("${invite.code.characters}")
    private String characters;

    @Value("${invite.code.length}")
    private int inviteCodeLength;

    @Transactional
    public Group createGroup(String name, String description, Integer userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Group group = new Group(name, description, owner);
        group = groupRepository.save(group);
        addMemberToGroup(group, owner, false);
        return group;
    }

    public Group getGroupById(Long groupId, Integer userId) {
        Group group = findGroupById(groupId.intValue());
        verifyUserInGroup(group.getId(), userId);
        return group;
    }

    @Transactional
    public Group updateGroup(Long groupId, GroupRequestDto dto, Integer userId) {
        Group group = findGroupAndCheckAccess(groupId.intValue(), userId);

        if (dto.name() != null && !dto.name().isEmpty()) {
            group.setName(dto.name());
        }

        if (dto.description() != null) {
            group.setDescription(dto.description());
        }

        return groupRepository.save(group);
    }

    @Transactional
    public void deleteGroup(Long groupId, Integer userId) {
        Group group = findGroupById(groupId.intValue());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isCreator = group.getCreatedBy() != null && group.getCreatedBy().getId().equals(userId);

        if (!isAdmin && !isCreator) {
            throw new AccessDeniedException("Only admin or group creator can delete the group");
        }

        groupInviteCodeRepository.deleteByGroup(group);
        expenseSplitRepository.deleteByExpenseGroupId(group.getId());
        expenseRepository.deleteByGroupId(group.getId());
        settlementRepository.deleteByGroupId(group.getId());
        groupMemberRepository.deleteByGroupId(group.getId());

        groupRepository.delete(group);
    }

    @Transactional
    public String generateInviteCode(Long groupId, Integer userId) {
        Group group = findGroupAndCheckAccess(groupId.intValue(), userId);

        groupInviteCodeRepository.deleteByGroup(group);

        String code = generateUniqueInviteCode();
        GroupInviteCode invite = new GroupInviteCode(code, group);
        groupInviteCodeRepository.save(invite);
        return code;
    }

    @Transactional
    public Group joinGroupByCode(String inviteCode, Integer userId) {
        GroupInviteCode invite = groupInviteCodeRepository.findByCode(inviteCode)
                .orElseThrow(() -> new InvalidCodeException("Invalid invite code"));

        Group group = invite.getGroup();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        addMemberToGroup(group, user, true);
        return group;
    }

    @Transactional
    public void addUserToGroupByEmail(Long groupId, String email, Integer currentUserId) {
        Group group = findGroupAndCheckAccess(groupId.intValue(), currentUserId);

        User userToAdd = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));

        addMemberToGroup(group, userToAdd, true);
    }

    @Transactional
    public void leaveGroup(Long groupId, Integer userId) {
        Group group = findGroupById(groupId.intValue());
        GroupMemberId memberId = new GroupMemberId(group.getId(), userId);

        if (!groupMemberRepository.existsById(memberId)) {
            throw new UserNotFoundException("User is not a member of this group");
        }

        groupMemberRepository.deleteById(memberId);
    }

    @Transactional
    public void removeUserFromGroup(Long groupId, Long userId, Integer currentUserId) {
        Group group = findGroupAndCheckAccess(groupId.intValue(), currentUserId);

        userRepository.findById(userId.intValue())
                .orElseThrow(() -> new UserNotFoundException("User to remove not found"));

        GroupMemberId memberId = new GroupMemberId(group.getId(), userId.intValue());

        if (!groupMemberRepository.existsById(memberId)) {
            throw new UserNotFoundException("User is not a member of this group");
        }

        groupMemberRepository.deleteById(memberId);
    }

    public List<Group> getGroupsByUser(Integer userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return groupMemberRepository.findAll().stream()
                .filter(member -> member.getUser().getId().equals(userId))
                .map(GroupMember::getGroup)
                .collect(Collectors.toList());
    }

    public List<User> getGroupMembers(Long groupId, Integer userId) {
        Group group = findGroupById(groupId.intValue());
        verifyUserInGroup(group.getId(), userId);

        return groupMemberRepository.findAll().stream()
                .filter(member -> member.getGroup().getId().equals(group.getId()))
                .map(GroupMember::getUser)
                .collect(Collectors.toList());
    }


    // Helper methods

    private Group findGroupById(Integer groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found"));
    }

    private Group findGroupAndCheckAccess(Integer groupId, Integer userId) {
        Group group = findGroupById(groupId);
        verifyUserInGroup(groupId, userId);
        return group;
    }

    private void verifyUserInGroup(Integer groupId, Integer userId) {
        GroupMemberId memberId = new GroupMemberId(groupId, userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        if (!groupMemberRepository.existsById(memberId)) {
            throw new AccessDeniedException("User does not have access to this group");
        }
    }

    private String generateUniqueInviteCode() {
        Random random = new Random();
        boolean isUnique = false;
        String inviteCode = "";

        while (!isUnique) {
            StringBuilder codeBuilder = new StringBuilder(inviteCodeLength);
            for (int i = 0; i < inviteCodeLength; i++) {
                codeBuilder.append(characters.charAt(random.nextInt(characters.length())));
            }
            inviteCode = codeBuilder.toString();

            if (groupInviteCodeRepository.findByCode(inviteCode).isEmpty()) {
                isUnique = true;
            }
        }

        return inviteCode;
    }

    private void addMemberToGroup(Group group, User user, boolean sendEmail) {
        GroupMemberId memberId = new GroupMemberId(group.getId(), user.getId());

        if (groupMemberRepository.existsById(memberId)) {
            return;
        }

        GroupMember groupMember = new GroupMember(memberId, group, user);
        groupMemberRepository.save(groupMember);

        if (sendEmail) emailService.sendGroupInvitationEmail(user, group);
    }

    public Page<Group> searchGroupsByNameOrCreator(String query, Pageable pageable) {
        return groupRepository.searchByNameOrCreator(query, pageable);
    }
}