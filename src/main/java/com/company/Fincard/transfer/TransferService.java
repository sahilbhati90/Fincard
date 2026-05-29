package com.company.Fincard.transfer;

import com.company.Fincard.appuser.AppUser;
import com.company.Fincard.bank.UserBank;
import com.company.Fincard.bank.UserBankService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TransferService {

    private final TransferRepository transferRepository;
    private final UserBankService userBankService;

    /**
     * Create a new transfer
     * @param senderUser User initiating the transfer
     * @param senderAccountId Sender's account/bank ID
     * @param recipientAccountId Recipient's account ID
     * @param recipientEmail Recipient's email (optional)
     * @param amount Transfer amount
     * @param note Transfer note (optional)
     * @return Created transfer
     */
    @Transactional
    public Transfer createTransfer(AppUser senderUser, String senderAccountId,
                                   String recipientAccountId, String recipientEmail,
                                   BigDecimal amount, String note) {

        // 1️⃣ Validate amount
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be greater than zero");
        }

        // 2️⃣ Verify sender owns the source account
        Optional<UserBank> senderBank = userBankService.findByItemId(senderAccountId);
        if (senderBank.isEmpty()) {
            throw new IllegalArgumentException("Source account not found");
        }

        if (!senderBank.get().getUser().getId().equals(senderUser.getId())) {
            throw new IllegalArgumentException("You don't own this account");
        }

        // 3️⃣ Validate recipient account exists
        if (recipientAccountId == null || recipientAccountId.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient account ID is required");
        }

        // 4️⃣ Create transfer
        Transfer transfer = new Transfer(
                senderUser,
                senderAccountId,
                recipientAccountId,
                recipientEmail,
                amount,
                note
        );

        // 5️⃣ In a real app, you would:
        // - Check account balance
        // - Initiate actual bank transfer via Plaid
        // - Update status based on result

        // For demo: Mark as COMPLETED immediately
        transfer.setStatus(TransferStatus.COMPLETED);

        return transferRepository.save(transfer);
    }

    /**
     * Get all transfers for a user (sent)
     * @param user The user
     * @return List of transfers
     */
    public List<Transfer> getUserTransfers(AppUser user) {
        return transferRepository.findBySenderUserOrderByCreatedAtDesc(user);
    }

    /**
     * Get transfer by ID
     * @param id Transfer ID
     * @return Transfer if found
     */
    public Optional<Transfer> getTransferById(Long id) {
        return transferRepository.findById(id);
    }

    /**
     * Get transfers by status
     * @param status Transfer status
     * @return List of transfers
     */
    public List<Transfer> getTransfersByStatus(TransferStatus status) {
        return transferRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    /**
     * Get total transfer count for user
     * @param user The user
     * @return Count
     */
    public long getUserTransferCount(AppUser user) {
        return transferRepository.countBySenderUser(user);
    }

    /**
     * Update transfer status
     * @param transferId Transfer ID
     * @param status New status
     */
    @Transactional
    public void updateTransferStatus(Long transferId, TransferStatus status) {
        Optional<Transfer> transferOpt = transferRepository.findById(transferId);
        if (transferOpt.isPresent()) {
            Transfer transfer = transferOpt.get();
            transfer.setStatus(status);
            transferRepository.save(transfer);
        }
    }
}