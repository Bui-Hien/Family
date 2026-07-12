package com.family.modules.fund.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.enums.StatusEnum;
import com.family.modules.fund.entity.Fund;
import com.family.modules.fund.entity.Transaction;
import com.family.modules.fund.service.FundService;
import com.family.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FundController {

    private final FundService fundService;

    @GetMapping("/funds")
    @PreAuthorize("hasAuthority('FUND_VIEW')")
    public ResponseEntity<ApiResponse<List<Fund>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(fundService.getAll()));
    }

    @GetMapping("/funds/{id}")
    @PreAuthorize("hasAuthority('FUND_VIEW')")
    public ResponseEntity<ApiResponse<Fund>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(fundService.getById(id)));
    }

    @GetMapping("/funds/{id}/transactions")
    @PreAuthorize("hasAuthority('FUND_VIEW')")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactions(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(fundService.getTransactionsByFundId(id)));
    }

    @PostMapping("/funds")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<Fund>> createFund(@Valid @RequestBody Fund fund) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Fund created successfully", fundService.create(fund)));
    }

    @PutMapping("/funds/{id}")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<Fund>> updateFund(@PathVariable UUID id, @Valid @RequestBody Fund fund) {
        return ResponseEntity.ok(ApiResponse.success("Fund updated successfully", fundService.update(id, fund)));
    }

    @DeleteMapping("/funds/{id}")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<Void>> deleteFund(@PathVariable UUID id) {
        fundService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Fund deleted successfully", null));
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasAuthority('FUND_TRANSACTION')")
    public ResponseEntity<ApiResponse<Transaction>> createTransaction(@Valid @RequestBody Transaction transaction) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction submitted successfully for review", fundService.createTransaction(transaction)));
    }

    @PutMapping("/transactions/{id}/approve")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<Transaction>> approveTransaction(
            @PathVariable UUID id,
            @RequestParam StatusEnum status
    ) {
        UUID approverId = SecurityUtils.getCurrentUserId().orElse(null);
        return ResponseEntity.ok(ApiResponse.success("Transaction processed successfully", fundService.approveTransaction(id, approverId, status)));
    }

    @GetMapping("/funds/report")
    @PreAuthorize("hasAuthority('FUND_REPORT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReport() {
        return ResponseEntity.ok(ApiResponse.success(fundService.getFundReport()));
    }
}
