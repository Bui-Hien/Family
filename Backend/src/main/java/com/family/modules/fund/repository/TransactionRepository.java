package com.family.modules.fund.repository;

import com.family.modules.fund.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByFundIdAndDeletedFalseOrderByTransactionDateDesc(UUID fundId);
}
