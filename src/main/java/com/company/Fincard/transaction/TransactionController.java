package com.company.Fincard.transaction;

import com.company.Fincard.appuser.AppUser;
import com.company.Fincard.bank.UserBank;
import com.company.Fincard.bank.UserBankService;
import com.plaid.client.model.*;
import com.plaid.client.request.PlaidApi;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import retrofit2.Response;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for Transaction-related endpoints
 */
@RestController
@RequestMapping("/api/transactions")
@AllArgsConstructor
public class TransactionController {

    private final UserBankService userBankService;
    private final PlaidApi plaidApi;

    /**
     * Get recent transactions for the logged-in user
     *
     * Endpoint: GET /api/transactions/recent?limit=10
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            // 1️⃣ Get authenticated user
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            System.out.println("💳 Fetching recent transactions for: " + user.getEmail());

            // 2️⃣ Get all user's connected banks
            List<UserBank> userBanks = userBankService.getUserBanks(user);

            if (userBanks.isEmpty()) {
                // No banks connected - return empty list
                return ResponseEntity.ok(Collections.emptyList());
            }

            // 3️⃣ Collect transactions from all banks
            List<Transaction> allTransactions = new ArrayList<>();

            // Date range: Last 30 days
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusDays(30);

            // 4️⃣ Loop through each bank and fetch transactions
            for (UserBank bank : userBanks) {
                try {
                    // Fetch transactions from Plaid
                    TransactionsGetRequest request = new TransactionsGetRequest()
                            .accessToken(bank.getAccessToken())
                            .startDate(startDate)
                            .endDate(endDate);

                    Response<TransactionsGetResponse> response =
                            plaidApi.transactionsGet(request).execute();

                    if (response.isSuccessful() && response.body() != null) {
                        List<com.plaid.client.model.Transaction> plaidTransactions =
                                response.body().getTransactions();

                        System.out.println("✅ Fetched " + plaidTransactions.size() +
                                " transactions from " + bank.getInstitutionName());

                        // 5️⃣ Convert Plaid transactions to our model
                        for (com.plaid.client.model.Transaction plaidTxn : plaidTransactions) {
                            Transaction txn = new Transaction();
                            txn.setTransactionId(plaidTxn.getTransactionId());
                            txn.setName(plaidTxn.getName());
                            txn.setAmount(plaidTxn.getAmount());
                            txn.setDate(plaidTxn.getDate().toString());
                            txn.setPending(plaidTxn.getPending());
                            txn.setInstitutionName(bank.getInstitutionName());

                            // Category (take first category if available)
                            if (plaidTxn.getCategory() != null && !plaidTxn.getCategory().isEmpty()) {
                                txn.setCategory(plaidTxn.getCategory().get(0));
                            } else {
                                txn.setCategory("General");
                            }

                            // Channel
                            if (plaidTxn.getPaymentChannel() != null) {
                                txn.setChannel(formatChannel(plaidTxn.getPaymentChannel().getValue()));
                            } else {
                                txn.setChannel("Other");
                            }

                            // Account name
                            txn.setAccountName("Account");

                            allTransactions.add(txn);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error fetching transactions for bank: " +
                            bank.getInstitutionName() + " - " + e.getMessage());
                    // Continue with other banks even if one fails
                }
            }

            // 6️⃣ Sort by date (newest first) and limit results
            List<Transaction> recentTransactions = allTransactions.stream()
                    .sorted((t1, t2) -> t2.getDate().compareTo(t1.getDate()))
                    .limit(limit)
                    .collect(Collectors.toList());

            System.out.println("✅ Returning " + recentTransactions.size() +
                    " recent transactions");

            return ResponseEntity.ok(recentTransactions);

        } catch (Exception e) {
            System.err.println("❌ Error fetching recent transactions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch transactions"));
        }
    }

    /**
     * Format payment channel for display
     */
    private String formatChannel(String channel) {
        if (channel == null) return "Other";

        switch (channel.toLowerCase()) {
            case "online":
                return "Online";
            case "in store":
                return "In Store";
            case "other":
            default:
                return "Other";
        }
    }

    /**
     * Get authenticated user from Spring Security context
     */
    private AppUser getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof AppUser) {
            return (AppUser) principal;
        }

        return null;
    }
}