package com.company.Fincard.auth;

import com.company.Fincard.appuser.AppUser;
import com.company.Fincard.bank.UserBank;
import com.company.Fincard.bank.UserBankService;
import com.plaid.client.model.*;
import com.plaid.client.request.PlaidApi;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import retrofit2.Response;

import java.util.*;

@RestController
@RequestMapping("/api/plaid")
public class PlaidController {

    private final PlaidApi plaidApi;
    private final UserBankService userBankService;

    public PlaidController(PlaidApi plaidApi, UserBankService userBankService) {
        this.plaidApi = plaidApi;
        this.userBankService = userBankService;
    }

    /**
     * Create Plaid Link Token
     */
    @PostMapping("/create-link-token")
    public ResponseEntity<?> createLinkToken() {
        try {
            // Get logged-in user
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            // Create Plaid Link token request
            LinkTokenCreateRequestUser plaidUser = new LinkTokenCreateRequestUser()
                    .clientUserId(user.getId().toString());

            LinkTokenCreateRequest request = new LinkTokenCreateRequest()
                    .user(plaidUser)
                    .clientName("Fincard")
                    .products(List.of(Products.TRANSACTIONS))
                    .countryCodes(List.of(CountryCode.US))
                    .language("en");

            Response<LinkTokenCreateResponse> response =
                    plaidApi.linkTokenCreate(request).execute();

            if (response.isSuccessful() && response.body() != null) {
                return ResponseEntity.ok(
                        Map.of("link_token", response.body().getLinkToken())
                );
            }

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to create link token"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Exchange Public Token for Access Token
     * AND save to database
     */
    @PostMapping("/exchange-public-token")
    public ResponseEntity<?> exchangePublicToken(@RequestBody Map<String, String> body) {
        try {
            // Get logged-in user
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            String publicToken = body.get("public_token");
            if (publicToken == null || publicToken.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Public token is required"));
            }

            // 1️⃣ Exchange public token for access token
            ItemPublicTokenExchangeRequest request =
                    new ItemPublicTokenExchangeRequest()
                            .publicToken(publicToken);

            Response<ItemPublicTokenExchangeResponse> response =
                    plaidApi.itemPublicTokenExchange(request).execute();

            if (response.isSuccessful() && response.body() != null) {
                String accessToken = response.body().getAccessToken();
                String itemId = response.body().getItemId();

                // 2️⃣ Get institution name from Plaid
                String institutionName = getInstitutionName(accessToken);

                // 3️⃣ Save to database
                UserBank savedBank = userBankService.saveUserBank(
                        user,
                        itemId,
                        accessToken,
                        institutionName
                );

                System.out.println("✅ Bank saved to database:");
                System.out.println("   User: " + user.getEmail());
                System.out.println("   Item ID: " + itemId);
                System.out.println("   Institution: " + institutionName);

                return ResponseEntity.ok(Map.of(
                        "access_token", accessToken,
                        "item_id", itemId,
                        "institution_name", institutionName,
                        "message", "Bank connected successfully"
                ));
            }

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Token exchange failed"));

        } catch (IllegalStateException e) {
            // Bank already connected
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get user's connected banks with account details
     */
    @GetMapping("/user-banks")
    public ResponseEntity<?> getUserBanks() {
        try {
            // Get logged-in user
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            // Get all banks from database
            List<UserBank> userBanks = userBankService.getUserBanks(user);

            if (userBanks.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            // For each bank, fetch account details from Plaid
            List<Map<String, Object>> banksWithAccounts = new ArrayList<>();

            for (UserBank bank : userBanks) {
                try {
                    // Fetch accounts from Plaid
                    AccountsGetRequest request = new AccountsGetRequest()
                            .accessToken(bank.getAccessToken());

                    Response<AccountsGetResponse> response =
                            plaidApi.accountsGet(request).execute();

                    if (response.isSuccessful() && response.body() != null) {
                        List<AccountBase> accounts = response.body().getAccounts();

                        // Map each account
                        for (AccountBase account : accounts) {
                            Map<String, Object> bankData = new HashMap<>();
                            bankData.put("accountId", bank.getItemId());
                            bankData.put("accountName", account.getName());
                            bankData.put("institutionName", bank.getInstitutionName());
                            bankData.put("mask", account.getMask());
                            bankData.put("type", account.getType().getValue());
                            bankData.put("subtype", account.getSubtype() != null ?
                                    account.getSubtype().getValue() : "");

                            // Balance
                            if (account.getBalances() != null &&
                                    account.getBalances().getCurrent() != null) {
                                bankData.put("balance",
                                        String.format("%.2f", account.getBalances().getCurrent()));
                            } else {
                                bankData.put("balance", "0.00");
                            }

                            banksWithAccounts.add(bankData);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error fetching accounts for item: " +
                            bank.getItemId() + " - " + e.getMessage());
                    // Continue with other banks even if one fails
                }
            }

            System.out.println("✅ Returned " + banksWithAccounts.size() +
                    " accounts for user: " + user.getEmail());

            return ResponseEntity.ok(banksWithAccounts);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get accounts for a specific access token
     * (Original endpoint - kept for backward compatibility)
     */
    @GetMapping("/accounts")
    public ResponseEntity<?> getAccounts(@RequestParam String accessToken) {
        try {
            AccountsGetRequest request = new AccountsGetRequest()
                    .accessToken(accessToken);

            Response<AccountsGetResponse> response =
                    plaidApi.accountsGet(request).execute();

            if (response.isSuccessful() && response.body() != null) {
                return ResponseEntity.ok(response.body().getAccounts());
            }

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch accounts"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete a connected bank
     */
    @DeleteMapping("/user-banks/{itemId}")
    public ResponseEntity<?> deleteUserBank(@PathVariable String itemId) {
        try {
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            // Verify bank belongs to user
            Optional<UserBank> bankOptional = userBankService.findByItemId(itemId);
            if (bankOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            UserBank bank = bankOptional.get();
            if (!bank.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized to delete this bank"));
            }

            // Delete from database
            userBankService.deleteUserBank(itemId);

            System.out.println("✅ Bank deleted: " + itemId +
                    " for user: " + user.getEmail());

            return ResponseEntity.ok(Map.of("message", "Bank deleted successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== HELPER METHODS ====================

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

    /**
     * Get institution name from Plaid using access token
     */
    private String getInstitutionName(String accessToken) {
        try {
            // Get item details
            ItemGetRequest itemRequest = new ItemGetRequest()
                    .accessToken(accessToken);

            Response<ItemGetResponse> itemResponse =
                    plaidApi.itemGet(itemRequest).execute();

            if (itemResponse.isSuccessful() && itemResponse.body() != null) {
                String institutionId = itemResponse.body().getItem().getInstitutionId();

                // Get institution details
                InstitutionsGetByIdRequest instRequest = new InstitutionsGetByIdRequest()
                        .institutionId(institutionId)
                        .countryCodes(List.of(CountryCode.US));

                Response<InstitutionsGetByIdResponse> instResponse =
                        plaidApi.institutionsGetById(instRequest).execute();

                if (instResponse.isSuccessful() && instResponse.body() != null) {
                    return instResponse.body().getInstitution().getName();
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error getting institution name: " + e.getMessage());
        }

        return "Unknown Bank";
    }
}