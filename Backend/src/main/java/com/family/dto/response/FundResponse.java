package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.common.enums.StatusEnum;
import com.family.entity.Fund;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FundResponse extends BaseResponse {
    private String name;
    private String description;
    private BigDecimal initialBalance;
    private BigDecimal currentBalance;
    private StatusEnum status;

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
