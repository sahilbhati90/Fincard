package com.company.Fincard.bank;

import com.company.Fincard.appuser.AppUser;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserBankService {

    private final UserBankRepository userBankRepository;

    /**
     * Save a new connected bank for a user
     * @param user The AppUser who connected the bank
     * @param itemId Plaid item_id
     * @param accessToken Plaid access_token
     * @param institutionName Bank name
     * @return Saved UserBank entity
     */
    @Transactional
    public UserBank saveUserBank(AppUser user, String itemId, String accessToken, String institutionName) {

        // Check if this bank is already connected
        if (userBankRepository.existsByUserAndItemId(user, itemId)) {
            throw new IllegalStateException("This bank is already connected to your account");
        }

        UserBank userBank = new UserBank(user, itemId, accessToken, institutionName);
        return userBankRepository.save(userBank);
    }

    /**
     * Get all banks connected by a user
     * @param user The AppUser
     * @return List of UserBank entities
     */
    public List<UserBank> getUserBanks(AppUser user) {
        return userBankRepository.findByUser(user);
    }

    /**
     * Get all banks by user ID
     * @param userId User's ID
     * @return List of UserBank entities
     */
    public List<UserBank> getUserBanksByUserId(Long userId) {
        return userBankRepository.findByUserId(userId);
    }

    /**
     * Find a bank by item_id
     * @param itemId Plaid item_id
     * @return Optional UserBank
     */
    public Optional<UserBank> findByItemId(String itemId) {
        return userBankRepository.findByItemId(itemId);
    }

    /**
     * Get access token for a specific bank
     * @param itemId Plaid item_id
     * @return Access token or null if not found
     */
    public String getAccessToken(String itemId) {
        return userBankRepository.findByItemId(itemId)
                .map(UserBank::getAccessToken)
                .orElse(null);
    }

    /**
     * Delete a connected bank
     * @param itemId Plaid item_id
     */
    @Transactional
    public void deleteUserBank(String itemId) {
        userBankRepository.deleteByItemId(itemId);
    }

    /**
     * Count total banks connected by a user
     * @param userId User's ID
     * @return Number of connected banks
     */
    public long countUserBanks(Long userId) {
        return userBankRepository.countByUserId(userId);
    }

    /**
     * Update institution name for a bank
     * @param itemId Plaid item_id
     * @param institutionName New bank name
     */
    @Transactional
    public void updateInstitutionName(String itemId, String institutionName) {
        Optional<UserBank> bankOptional = userBankRepository.findByItemId(itemId);
        if (bankOptional.isPresent()) {
            UserBank bank = bankOptional.get();
            bank.setInstitutionName(institutionName);
            userBankRepository.save(bank);
        }
    }

    /**
     * Get dashboard summary for a user
     * @param user The AppUser
     * @param plaidApi PlaidApi instance to fetch balances
     * @return DashboardSummary with total banks and balance
     */
    public DashboardSummary getDashboardSummary(AppUser user, com.plaid.client.request.PlaidApi plaidApi) {

        // Get all user's banks
        List<UserBank> banks = userBankRepository.findByUser(user);

        int totalBanks = banks.size();
        double totalBalance = 0.0;

        // Calculate total balance from all banks
        for (UserBank bank : banks) {
            try {
                // Fetch account balances from Plaid
                com.plaid.client.model.AccountsGetRequest request =
                        new com.plaid.client.model.AccountsGetRequest()
                                .accessToken(bank.getAccessToken());

                retrofit2.Response<com.plaid.client.model.AccountsGetResponse> response =
                        plaidApi.accountsGet(request).execute();

                if (response.isSuccessful() && response.body() != null) {
                    for (com.plaid.client.model.AccountBase account : response.body().getAccounts()) {
                        if (account.getBalances() != null &&
                                account.getBalances().getCurrent() != null) {
                            totalBalance += account.getBalances().getCurrent();
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error fetching balance for bank: " + bank.getItemId());
                e.printStackTrace();
            }
        }

        // Format balance with commas
        String formattedBalance = String.format("%,.2f", totalBalance);

        // Create summary
        DashboardSummary summary = new DashboardSummary();
        summary.setTotalBanks(totalBanks);
        summary.setTotalBalance(totalBalance);
        summary.setTotalBalanceFormatted(formattedBalance);
        summary.setUserName(user.getFirstName() + " " + user.getLastName());

        return summary;
    }
}