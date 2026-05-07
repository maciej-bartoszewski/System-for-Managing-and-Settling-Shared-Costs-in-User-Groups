package com.maciejbartoszewski.pracainzynierska.mapper;

import com.maciejbartoszewski.pracainzynierska.dto.group.GroupDto;
import com.maciejbartoszewski.pracainzynierska.model.Group;
import com.maciejbartoszewski.pracainzynierska.model.GroupInviteCode;
import com.maciejbartoszewski.pracainzynierska.repository.GroupInviteCodeRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class GroupMapper {
    @Autowired
    protected GroupInviteCodeRepository groupInviteCodeRepository;

    @Mapping(target = "createdByEmail", expression = "java(group.getCreatedBy() != null ? group.getCreatedBy().getEmail() : null)")
    @Mapping(target = "inviteCode", expression = "java(getInviteCode(group))")
    public abstract GroupDto toGroupDto(Group group);

    protected String getInviteCode(Group group) {
        return groupInviteCodeRepository.findByGroup(group)
                .map(GroupInviteCode::getCode)
                .orElse(null);
    }
}
