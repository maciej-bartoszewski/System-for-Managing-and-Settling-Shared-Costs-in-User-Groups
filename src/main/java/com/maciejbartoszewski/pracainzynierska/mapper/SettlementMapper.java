package com.maciejbartoszewski.pracainzynierska.mapper;

import com.maciejbartoszewski.pracainzynierska.dto.settlement.SettlementDto;
import com.maciejbartoszewski.pracainzynierska.model.Settlement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SettlementMapper {
    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "groupName", source = "group.name")
    @Mapping(target = "fromUserId", source = "fromUser.id")
    @Mapping(target = "fromUserEmail", source = "fromUser.email")
    @Mapping(target = "toUserId", source = "toUser.id")
    @Mapping(target = "toUserEmail", source = "toUser.email")
    SettlementDto toSettlementDto(Settlement settlement);
}