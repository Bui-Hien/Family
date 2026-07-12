package com.family.modules.gallery.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.FileVisibility;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
import com.family.modules.event.entity.Event;

@Getter
@Setter
@Entity
@Table(name = "galleries")
public class Gallery extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private FileVisibility visibility = FileVisibility.PUBLIC;

    @Column(name = "event_id")
    private UUID eventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private Event event;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}
