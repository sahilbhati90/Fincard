package com.company.Fincard.transfer;

import com.company.Fincard.appuser.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {

    /**
     * Find all transfers sent by a user
     * @param senderUser The sender
     * @return List of transfers
     */
    List<Transfer> findBySenderUserOrderByCreatedAtDesc(AppUser senderUser);

    /**
     * Find transfers by recipient account ID
     * @param recipientAccountId Recipient's account ID
     * @return List of transfers
     */
    List<Transfer> findByRecipientAccountIdOrderByCreatedAtDesc(String recipientAccountId);

    /**
     * Find all transfers by status
     * @param status Transfer status
     * @return List of transfers
     */
    List<Transfer> findByStatusOrderByCreatedAtDesc(TransferStatus status);

    /**
     * Count total transfers by user
     * @param senderUser The sender
     * @return Count
     */
    long countBySenderUser(AppUser senderUser);
}