package com.company.Fincard.dashboard;

import com.company.Fincard.appuser.AppUser;
import com.company.Fincard.bank.DashboardSummary;
import com.company.Fincard.bank.UserBankService;
import com.plaid.client.request.PlaidApi;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controller for Dashboard-related endpoints
 */
@RestController
@RequestMapping("/api/dashboard")
@AllArgsConstructor
public class DashboardController {

    private final UserBankService userBankService;
    private final PlaidApi plaidApi;

    /**
     * Get dashboard summary (total balance, bank count, etc.)
     *
     * Endpoint: GET /api/dashboard/summary
     *
     * Returns:
     * {
     *   "totalBanks": 2,
     *   "totalBalance": 2560.75,
     *   "totalBalanceFormatted": "2,560.75",
     *   "userName": "John Doe"
     * }
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary() {
        try {
            // Get authenticated user
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            System.out.println("📊 Fetching dashboard summary for: " + user.getEmail());

            // Get summary
            DashboardSummary summary = userBankService.getDashboardSummary(user, plaidApi);

            System.out.println("✅ Dashboard summary:");
            System.out.println("   Total Banks: " + summary.getTotalBanks());
            System.out.println("   Total Balance: $" + summary.getTotalBalanceFormatted());

            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            System.err.println("❌ Error fetching dashboard summary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch dashboard summary"));
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