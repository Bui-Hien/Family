package com.family.modules.fund.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.enums.StatusEnum;
import com.family.modules.fund.dto.FundResponse;
import com.family.modules.fund.dto.TransactionResponse;
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
    public ResponseEntity<ApiResponse<List<FundResponse>>> getAll() {
        List<FundResponse> funds = fundService.getAll().stream()
                .map(FundResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(funds));
    }

    @GetMapping("/funds/{id}")
    @PreAuthorize("hasAuthority('FUND_VIEW')")
    public ResponseEntity<ApiResponse<FundResponse>> getById(@PathVariable UUID id) {
        Fund fund = fundService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(FundResponse.fromEntity(fund)));
    }

    @GetMapping("/funds/{id}/transactions")
    @PreAuthorize("hasAuthority('FUND_VIEW')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactions(@PathVariable UUID id) {
        List<TransactionResponse> transactions = fundService.getTransactionsByFundId(id).stream()
                .map(TransactionResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @PostMapping("/funds")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<FundResponse>> createFund(@Valid @RequestBody Fund fund) {
        Fund created = fundService.create(fund);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Fund created successfully", FundResponse.fromEntity(created)));
    }

    @PutMapping("/funds/{id}")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<FundResponse>> updateFund(@PathVariable UUID id, @Valid @RequestBody Fund fund) {
        Fund updated = fundService.update(id, fund);
        return ResponseEntity.ok(ApiResponse.success("Fund updated successfully", FundResponse.fromEntity(updated)));
    }

    @DeleteMapping("/funds/{id}")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<Void>> deleteFund(@PathVariable UUID id) {
        fundService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Fund deleted successfully", null));
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasAuthority('FUND_TRANSACTION')")
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(@Valid @RequestBody Transaction transaction) {
        Transaction created = fundService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction submitted successfully for review", TransactionResponse.fromEntity(created)));
    }

    @PutMapping("/transactions/{id}/approve")
    @PreAuthorize("hasAuthority('FUND_MANAGE')")
    public ResponseEntity<ApiResponse<TransactionResponse>> approveTransaction(
            @PathVariable UUID id,
            @RequestParam StatusEnum status
    ) {
        UUID approverId = SecurityUtils.getCurrentUserId().orElse(null);
        Transaction approved = fundService.approveTransaction(id, approverId, status);
        return ResponseEntity.ok(ApiResponse.success("Transaction processed successfully", TransactionResponse.fromEntity(approved)));
    }

    @GetMapping("/funds/report")
    @PreAuthorize("hasAuthority('FUND_REPORT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReport() {
        return ResponseEntity.ok(ApiResponse.success(fundService.getFundReport()));
    }
}
