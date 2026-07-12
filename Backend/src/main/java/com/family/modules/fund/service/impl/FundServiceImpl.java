package com.family.modules.fund.service.impl;

import com.family.common.enums.StatusEnum;
import com.family.common.exception.BusinessException;
import com.family.common.exception.ResourceNotFoundException;
import com.family.modules.fund.entity.Fund;
import com.family.modules.fund.entity.Transaction;
import com.family.modules.fund.repository.FundRepository;
import com.family.modules.fund.repository.TransactionRepository;
import com.family.modules.fund.service.FundService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FundServiceImpl implements FundService {

    private final FundRepository fundRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional(readOnly = true)
    public Fund getById(UUID id) {
        return fundRepository.findById(id)
                .filter(f -> !f.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Fund not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Fund> getAll() {
        return fundRepository.findByDeletedFalse();
    }

    @Override
    @Transactional
    public Fund create(Fund fund) {
        fund.setCurrentBalance(fund.getInitialBalance());
        return fundRepository.save(fund);
    }

    @Override
    @Transactional
    public Fund update(UUID id, Fund fundDetails) {
        Fund fund = getById(id);
        fund.setName(fundDetails.getName());
        fund.setDescription(fundDetails.getDescription());
        return fundRepository.save(fund);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Fund fund = getById(id);
        fund.setDeleted(true);
        fundRepository.save(fund);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByFundId(UUID fundId) {
        getById(fundId); // Verify existence
        return transactionRepository.findByFundIdAndDeletedFalseOrderByTransactionDateDesc(fundId);
    }

    @Override
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        getById(transaction.getFundId()); // Verify fund exists
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus(StatusEnum.PENDING);
        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction approveTransaction(UUID transactionId, UUID approverId, StatusEnum status) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .filter(t -> !t.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (transaction.getStatus() != StatusEnum.PENDING) {
            throw new BusinessException("ALREADY_PROCESSED", "Transaction has already been processed");
        }

        if (status != StatusEnum.APPROVED && status != StatusEnum.REJECTED) {
            throw new BusinessException("INVALID_STATUS", "Approval status must be either APPROVED or REJECTED");
        }

        transaction.setStatus(status);
        transaction.setApprovedBy(approverId);

        if (status == StatusEnum.APPROVED) {
            Fund fund = getById(transaction.getFundId());
            BigDecimal amount = transaction.getAmount();
            if ("IN".equalsIgnoreCase(transaction.getType())) {
                fund.setCurrentBalance(fund.getCurrentBalance().add(amount));
            } else if ("OUT".equalsIgnoreCase(transaction.getType())) {
                if (fund.getCurrentBalance().compareTo(amount) < 0) {
                    throw new BusinessException("INSUFFICIENT_BALANCE", "Insufficient balance in fund: " + fund.getName());
                }
                fund.setCurrentBalance(fund.getCurrentBalance().subtract(amount));
            } else {
                throw new BusinessException("INVALID_TYPE", "Transaction type must be either IN or OUT");
            }
            fundRepository.save(fund);
        }

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getFundReport() {
        List<Fund> funds = getAll();
        BigDecimal totalBalance = BigDecimal.ZERO;
        for (Fund f : funds) {
            totalBalance = totalBalance.add(f.getCurrentBalance());
        }

        List<Transaction> allTransactions = transactionRepository.findAll().stream()
                .filter(t -> !t.getDeleted())
                .toList();

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalOutcome = BigDecimal.ZERO;

        for (Transaction t : allTransactions) {
            if (t.getStatus() == StatusEnum.APPROVED) {
                if ("IN".equalsIgnoreCase(t.getType())) {
                    totalIncome = totalIncome.add(t.getAmount());
                } else if ("OUT".equalsIgnoreCase(t.getType())) {
                    totalOutcome = totalOutcome.add(t.getAmount());
                }
            }
        }

        Map<String, Object> report = new HashMap<>();
        report.put("totalBalance", totalBalance);
        report.put("totalIncome", totalIncome);
        report.put("totalOutcome", totalOutcome);
        report.put("fundsCount", funds.size());
        report.put("transactionsCount", allTransactions.size());

        return report;
    }
}
