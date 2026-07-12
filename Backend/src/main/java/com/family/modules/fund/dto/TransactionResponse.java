package com.family.modules.fund.dto;

import com.family.common.enums.StatusEnum;
import com.family.modules.fund.entity.Transaction;
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
public class TransactionResponse {
    private UUID id;
    private UUID fundId;
    private UUID profileId;
    private BigDecimal amount;
    private String type;
    private String note;
    private LocalDateTime transactionDate;
    private String attachment;
    private UUID approvedBy;
    private StatusEnum status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TransactionResponse fromEntity(Transaction transaction) {
        if (transaction == null) {
            return null;
        }
        return TransactionResponse.builder()
                .id(transaction.getId())
                .fundId(transaction.getFundId())
                .profileId(transaction.getProfileId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .note(transaction.getNote())
                .transactionDate(transaction.getTransactionDate())
                .attachment(transaction.getAttachment())
                .approvedBy(transaction.getApprovedBy())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
