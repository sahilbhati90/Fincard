package com.company.Fincard.transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Model representing a transaction from Plaid
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    private String transactionId;
    private String name;           // Merchant name (e.g., "Starbucks")
    private Double amount;         // Transaction amount
    private String date;           // Transaction date
    private String category;       // e.g., "Food & Drink"
    private String channel;        // e.g., "online", "in store"
    private boolean isPending;     // Is transaction pending?
    private String accountName;    // Which account this belongs to
    private String institutionName; // Which bank (e.g., "Chase")
}