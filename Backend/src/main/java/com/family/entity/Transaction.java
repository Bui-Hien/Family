package com.family.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.family.entity.Profile;
import com.family.entity.User;
import org.javers.core.metamodel.annotation.DiffIgnore;

@Getter
@Setter
@Entity
@Table(name = "tbl_transactions")
public class Transaction extends BaseEntity {

    @Column(name = "fund_id", nullable = false)
    private UUID fundId;

    @DiffIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = false, insertable = false, updatable = false)
    private Fund fund;

    @Column(name = "profile_id")
    private UUID profileId;

    @DiffIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", insertable = false, updatable = false)
    private Profile profile;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "type", length = 3, nullable = false)
    private String type; // IN = Income, OUT = Outcome

    @Column(name = "note")
    private String note;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "attachment")
    private String attachment;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @DiffIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by", insertable = false, updatable = false)
    private User approvedByUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusEnum status = StatusEnum.PENDING;
}

//Logic "Bù trừ" (Correction Entry): Nếu chẳng may nhập sai số tiền, thay vì xóa dòng cũ, hãy bắt người dùng tạo một dòng Transaction mới có số tiền âm (số tiền đảo ngược) để triệt tiêu dòng cũ. Sau đó tạo một dòng đúng.
//
//Kết quả: Log của bạn sẽ lưu toàn bộ hành trình này. Đây là cách làm của các hệ thống kế toán chuyên nghiệp (Double-entry bookkeeping).
//
//Mã băm (Hash) nếu cần: Nếu muốn "siêu bảo mật", bạn có thể lưu thêm một cột hash cho mỗi dòng Transaction (hash của dòng hiện tại + hash của dòng trước đó). Như vậy, bất kỳ ai can thiệp thủ công vào DB sẽ làm hỏng chuỗi Hash này ngay lập tức.