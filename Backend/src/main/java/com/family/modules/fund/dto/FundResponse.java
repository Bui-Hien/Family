package com.family.modules.fund.dto;

import com.family.common.enums.StatusEnum;
import com.family.modules.fund.entity.Fund;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FundResponse {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal initialBalance;
    private BigDecimal currentBalance;
    private StatusEnum status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FundResponse fromEntity(Fund fund) {
        if (fund == null) {
            return null;
        }
        return FundResponse.builder()
                .id(fund.getId())
                .name(fund.getName())
                .description(fund.getDescription())
                .initialBalance(fund.getInitialBalance())
                .currentBalance(fund.getCurrentBalance())
                .status(fund.getStatus())
                .createdAt(fund.getCreatedAt())
                .updatedAt(fund.getUpdatedAt())
                .build();
    }
}
