package com.family.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "tbl_funds")
public class Fund extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "initial_balance", nullable = false)
    private BigDecimal initialBalance = BigDecimal.ZERO;

    @Column(name = "current_balance", nullable = false)
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusEnum status = StatusEnum.ACTIVE;
}
