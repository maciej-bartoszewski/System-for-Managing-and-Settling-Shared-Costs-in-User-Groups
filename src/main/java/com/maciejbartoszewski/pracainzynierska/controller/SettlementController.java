package com.maciejbartoszewski.pracainzynierska.controller;

import com.maciejbartoszewski.pracainzynierska.dto.settlement.SettlementDto;
import com.maciejbartoszewski.pracainzynierska.dto.settlement.SettlementRequestDto;
import com.maciejbartoszewski.pracainzynierska.mapper.SettlementMapper;
import com.maciejbartoszewski.pracainzynierska.model.Settlement;
import com.maciejbartoszewski.pracainzynierska.security.CustomUserDetails;
import com.maciejbartoszewski.pracainzynierska.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class SettlementController {
    private final SettlementService settlementService;
    private final SettlementMapper settlementMapper;

    @PostMapping
    public ResponseEntity<SettlementDto> createSettlement(
            @RequestBody SettlementRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Settlement settlement = settlementService.createSettlement(
                dto.groupId(), dto.toUserId(), dto.amount(),
                currentUser.user().getId());
        return ResponseEntity.ok(settlementMapper.toSettlementDto(settlement));
    }

    @DeleteMapping("/{settlementId}")
    public ResponseEntity<String> deleteSettlement(
            @PathVariable Integer settlementId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        settlementService.deleteSettlement(settlementId, currentUser.user().getId());
        return ResponseEntity.ok("Settlement deleted successfully");
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<SettlementDto>> getSettlementsByGroup(
            @PathVariable Integer groupId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Settlement> settlements = settlementService.getSettlementsByGroup(
                groupId, currentUser.user().getId());
        return ResponseEntity.ok(settlements.stream()
                .map(settlementMapper::toSettlementDto)
                .toList());
    }

    @GetMapping("/my")
    public ResponseEntity<List<SettlementDto>> getMySettlements(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Settlement> settlements = settlementService.getSettlementsByUser(
                currentUser.user().getId(), currentUser.user().getId());
        return ResponseEntity.ok(settlements.stream()
                .map(settlementMapper::toSettlementDto)
                .toList());
    }
}