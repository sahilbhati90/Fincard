package com.company.Fincard.bank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Dashboard Summary
 * Contains aggregated data for the dashboard page
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummary {

    /**
     * Total number of connected banks
     */
    private int totalBanks;

    /**
     * Total balance across all banks (in USD)
     */
    private double totalBalance;

    /**
     * Formatted total balance as string (e.g., "1,234.56")
     */
    private String totalBalanceFormatted;

    /**
     * User's name (optional)
     */
    private String userName;
}