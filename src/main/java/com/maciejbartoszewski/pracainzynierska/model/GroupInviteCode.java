package com.maciejbartoszewski.pracainzynierska.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "group_invite_codes")
public class GroupInviteCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 10)
    private String code;

    @OneToOne
    @JoinColumn(name = "group_id", unique = true, nullable = false)
    private Group group;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public GroupInviteCode(String code, Group group) {
        this.code = code;
        this.group = group;
    }
}
