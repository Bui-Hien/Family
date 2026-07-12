package com.family.common.base;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntityWithName extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code")
    private String code;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "slug", unique = true)
    private String slug;
}
