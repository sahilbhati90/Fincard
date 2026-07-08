package com.company.Fincard.transfer;

import com.company.Fincard.appuser.AppUser;
import com.company.Fincard.bank.UserBank;
import com.company.Fincard.bank.UserBankService;
import com.plaid.client.model.AccountBase;
import com.plaid.client.model.AccountsGetRequest;
import com.plaid.client.model.AccountsGetResponse;
import com.plaid.client.request.PlaidApi;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import retrofit2.Response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TransferService {

    private final TransferRepository transferRepository;
    private final UserBankService userBankService;
    private final PlaidApi plaidApi;

    @Transactional
    public Transfer createTransfer(AppUser senderUser, String senderItemId, String senderAccountId,
                                   String recipientAccountId, String recipientEmail,
                                   BigDecimal amount, String note) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be greater than zero");
        }

        if (senderItemId == null || senderItemId.trim().isEmpty()) {
            throw new IllegalArgumentException("Source bank is required");
        }

        if (senderAccountId == null || senderAccountId.trim().isEmpty()) {
            throw new IllegalArgumentException("Source account is required");
        }

        if (recipientAccountId == null || recipientAccountId.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient account ID is required");
        }

        if (senderAccountId.equals(recipientAccountId)) {
            throw new IllegalArgumentException("Source and destination accounts must be different");
        }

        Optional<UserBank> senderBank = userBankService.findByItemId(senderItemId);
        if (senderBank.isEmpty()) {
            throw new IllegalArgumentException("Source account not found");
        }

        if (!senderBank.get().getUser().getId().equals(senderUser.getId())) {
            throw new IllegalArgumentException("You don't own this account");
        }

        validateSenderAccountAndBalance(senderBank.get(), senderAccountId, amount);

        Transfer transfer = new Transfer(
                senderUser,
                senderAccountId,
                recipientAccountId,
                recipientEmail,
                amount,
                note
        );

        // Demo mode: persist a completed transfer after validating ownership and balance.
        transfer.setStatus(TransferStatus.COMPLETED);

        return transferRepository.save(transfer);
    }

    public List<Transfer> getUserTransfers(AppUser user) {
        return transferRepository.findBySenderUserOrderByCreatedAtDesc(user);
    }

    public Optional<Transfer> getTransferById(Long id) {
        return transferRepository.findById(id);
    }

    public List<Transfer> getTransfersByStatus(TransferStatus status) {
        return transferRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public long getUserTransferCount(AppUser user) {
        return transferRepository.countBySenderUser(user);
    }

    @Transactional
    public void updateTransferStatus(Long transferId, TransferStatus status) {
        Optional<Transfer> transferOpt = transferRepository.findById(transferId);
        if (transferOpt.isPresent()) {
            Transfer transfer = transferOpt.get();
            transfer.setStatus(status);
            transferRepository.save(transfer);
        }
    }

    private void validateSenderAccountAndBalance(UserBank senderBank, String senderAccountId, BigDecimal amount) {
        try {
            AccountsGetRequest request = new AccountsGetRequest()
                    .accessToken(senderBank.getAccessToken());

            Response<AccountsGetResponse> response = plaidApi.accountsGet(request).execute();
            if (!response.isSuccessful() || response.body() == null) {
                throw new IllegalArgumentException("Could not verify source account");
            }

            AccountBase sourceAccount = response.body().getAccounts().stream()
                    .filter(account -> senderAccountId.equals(account.getAccountId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Source account not found"));

            Double currentBalance = sourceAccount.getBalances() != null
                    ? sourceAccount.getBalances().getCurrent()
                    : null;

            if (currentBalance == null) {
                throw new IllegalArgumentException("Could not verify source account balance");
            }

            if (BigDecimal.valueOf(currentBalance).compareTo(amount) < 0) {
                throw new IllegalArgumentException("Insufficient balance in source account");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Could not verify source account");
        }
    }
}
