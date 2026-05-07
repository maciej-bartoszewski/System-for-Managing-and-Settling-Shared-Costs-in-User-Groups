package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.dto.group.GroupDto;
import com.maciejbartoszewski.pracainzynierska.dto.group.GroupRequestDto;
import com.maciejbartoszewski.pracainzynierska.dto.user.UserDto;
import com.maciejbartoszewski.pracainzynierska.mapper.GroupMapper;
import com.maciejbartoszewski.pracainzynierska.mapper.UserMapper;
import com.maciejbartoszewski.pracainzynierska.model.Group;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.security.CustomUserDetails;
import com.maciejbartoszewski.pracainzynierska.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
public class GroupController {
    private final GroupService groupService;
    private final GroupMapper groupMapper;
    private final UserMapper userMapper;

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<GroupDto>> searchGroupsByNameOrCreator(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Group> groups = groupService.searchGroupsByNameOrCreator(query, pageable);
        return ResponseEntity.ok(groups.map(groupMapper::toGroupDto));
    }

    @PostMapping
    public ResponseEntity<GroupDto> createGroup(@RequestBody GroupRequestDto dto,
                                                @AuthenticationPrincipal CustomUserDetails currentUser) {
        Group group = groupService.createGroup(dto.name(), dto.description(), currentUser.user().getId());
        return ResponseEntity.ok(groupMapper.toGroupDto(group));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getGroupById(@PathVariable Long groupId,
                                                 @AuthenticationPrincipal CustomUserDetails currentUser) {
        Group group = groupService.getGroupById(groupId, currentUser.user().getId());
        return ResponseEntity.ok(groupMapper.toGroupDto(group));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<GroupDto> updateGroup(@PathVariable Long groupId,
                                                @RequestBody GroupRequestDto dto,
                                                @AuthenticationPrincipal CustomUserDetails currentUser) {
        Group group = groupService.updateGroup(groupId, dto, currentUser.user().getId());
        return ResponseEntity.ok(groupMapper.toGroupDto(group));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId,
                                              @AuthenticationPrincipal CustomUserDetails currentUser) {
        groupService.deleteGroup(groupId, currentUser.user().getId());
        return ResponseEntity.ok("Group deleted");
    }

    @PostMapping("/join")
    public ResponseEntity<GroupDto> joinGroup(@RequestParam String inviteCode,
                                              @AuthenticationPrincipal CustomUserDetails currentUser) {
        Group group = groupService.joinGroupByCode(inviteCode, currentUser.user().getId());
        return ResponseEntity.ok(groupMapper.toGroupDto(group));
    }

    @PostMapping("/{groupId}/leave")
    public ResponseEntity<String> leaveGroup(@PathVariable Long groupId,
                                             @AuthenticationPrincipal CustomUserDetails currentUser) {
        groupService.leaveGroup(groupId, currentUser.user().getId());
        return ResponseEntity.ok("You have left the group");
    }

    @PostMapping("/{groupId}/add-user")
    public ResponseEntity<String> addUserByEmail(@PathVariable Long groupId,
                                                 @RequestParam String email,
                                                 @AuthenticationPrincipal CustomUserDetails currentUser) {
        groupService.addUserToGroupByEmail(groupId, email, currentUser.user().getId());
        return ResponseEntity.ok("User added to group");
    }

    @PostMapping("/{groupId}/invite-code")
    public ResponseEntity<String> generateInviteCode(@PathVariable Long groupId,
                                                     @AuthenticationPrincipal CustomUserDetails currentUser) {
        String code = groupService.generateInviteCode(groupId, currentUser.user().getId());
        return ResponseEntity.ok(code);
    }

    @DeleteMapping("/{groupId}/remove-user")
    public ResponseEntity<String> removeUserFromGroup(@PathVariable Long groupId,
                                                      @RequestParam Long userId,
                                                      @AuthenticationPrincipal CustomUserDetails currentUser) {
        groupService.removeUserFromGroup(groupId, userId, currentUser.user().getId());
        return ResponseEntity.ok("User removed from group");
    }

    @GetMapping("/my")
    public ResponseEntity<List<GroupDto>> getMyGroups(@AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Group> groups = groupService.getGroupsByUser(currentUser.user().getId());
        return ResponseEntity.ok(groups.stream().map(groupMapper::toGroupDto).toList());
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<UserDto>> getGroupMembers(@PathVariable Long groupId,
                                                         @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<User> members = groupService.getGroupMembers(groupId, currentUser.user().getId());
        return ResponseEntity.ok(members.stream().map(userMapper::toUserDto).toList());
    }
}