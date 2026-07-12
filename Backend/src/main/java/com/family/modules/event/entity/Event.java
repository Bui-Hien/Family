package com.family.modules.event.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "events")
public class Event extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "location")
    private String location;

    @Column(name = "is_annual", nullable = false)
    private Boolean annual = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusEnum status = StatusEnum.ACTIVE;
}
