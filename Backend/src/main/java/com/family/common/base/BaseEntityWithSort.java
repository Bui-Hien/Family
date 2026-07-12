package com.family.common.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntityWithSort extends BaseEntityWithName {

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "is_featured", nullable = false)
    private Boolean featured = false;
}
