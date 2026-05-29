package com.company.Fincard.bank;

import com.company.Fincard.appuser.AppUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_banks")
@Getter
@Setter
@NoArgsConstructor
public class UserBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "item_id", nullable = false, unique = true, length = 255)
    private String itemId;

    @Column(name = "access_token", nullable = false, length = 500)
    private String accessToken;

    @Column(name = "institution_name", length = 255)
    private String institutionName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructor
    public UserBank(AppUser user, String itemId, String accessToken, String institutionName) {
        this.user = user;
        this.itemId = itemId;
        this.accessToken = accessToken;
        this.institutionName = institutionName;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Update timestamp before persist/update
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