package com.family.modules.fund.service;

import com.family.common.enums.StatusEnum;
import com.family.modules.fund.entity.Fund;
import com.family.modules.fund.entity.Transaction;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface FundService {
    Fund getById(UUID id);
    List<Fund> getAll();
    Fund create(Fund fund);
    Fund update(UUID id, Fund fund);
    void delete(UUID id);
    List<Transaction> getTransactionsByFundId(UUID fundId);
    Transaction createTransaction(Transaction transaction);
    Transaction approveTransaction(UUID transactionId, UUID approverId, StatusEnum status);
    Map<String, Object> getFundReport();
}
