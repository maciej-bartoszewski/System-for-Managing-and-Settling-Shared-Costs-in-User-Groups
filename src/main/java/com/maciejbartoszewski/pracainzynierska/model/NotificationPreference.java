package com.maciejbartoszewski.pracainzynierska.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notification_preferences")
public class NotificationPreference {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    private Boolean notifyNewExpense;

    private Boolean notifyNewSettlement;

    private Boolean notifyAddedToGroup;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public NotificationPreference(Boolean notifyNewExpense, Boolean notifyNewSettlement, Boolean notifyAddedToGroup, User user) {
        this.notifyNewExpense = notifyNewExpense;
        this.notifyNewSettlement = notifyNewSettlement;
        this.notifyAddedToGroup = notifyAddedToGroup;
        this.user = user;
    }
}
