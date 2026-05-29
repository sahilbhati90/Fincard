package com.company.Fincard.transfer;

import com.company.Fincard.appuser.AppUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfers")
@Getter
@Setter
@NoArgsConstructor
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sender Information - JsonIgnore prevents serialization crash
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id", nullable = false)
    private AppUser senderUser;

    @Column(name = "sender_account_id", nullable = false, length = 255)
    private String senderAccountId;

    // Recipient Information
    @Column(name = "recipient_email", length = 255)
    private String recipientEmail;

    @Column(name = "recipient_account_id", nullable = false, length = 255)
    private String recipientAccountId;

    // Transfer Details
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private TransferStatus status = TransferStatus.PENDING;

    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructor
    public Transfer(AppUser senderUser, String senderAccountId, String recipientAccountId,
                    String recipientEmail, BigDecimal amount, String note) {
        this.senderUser = senderUser;
        this.senderAccountId = senderAccountId;
        this.recipientAccountId = recipientAccountId;
        this.recipientEmail = recipientEmail;
        this.amount = amount;
        this.note = note;
        this.status = TransferStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}