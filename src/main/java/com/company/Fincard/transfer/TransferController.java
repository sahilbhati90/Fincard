package com.company.Fincard.transfer;

import com.company.Fincard.appuser.AppUser;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
@AllArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping("/create")
    public ResponseEntity<?> createTransfer(@RequestBody Map<String, Object> request) {
        try {
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            String senderItemId = (String) request.get("senderItemId");
            String senderAccountId = (String) request.get("senderAccountId");
            String recipientAccountId = (String) request.get("recipientAccountId");
            String recipientEmail = (String) request.get("recipientEmail");
            String note = (String) request.get("note");

            BigDecimal amount;
            try {
                Object amountObj = request.get("amount");
                if (amountObj instanceof Number) {
                    amount = BigDecimal.valueOf(((Number) amountObj).doubleValue());
                } else if (amountObj instanceof String) {
                    amount = new BigDecimal((String) amountObj);
                } else {
                    throw new IllegalArgumentException("Invalid amount format");
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid amount: " + e.getMessage()));
            }

            if (senderItemId == null || senderItemId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Source bank is required"));
            }

            if (senderAccountId == null || senderAccountId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Source account is required"));
            }

            if (recipientAccountId == null || recipientAccountId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Recipient account ID is required"));
            }

            System.out.println("Creating transfer:");
            System.out.println("   From item: " + senderItemId);
            System.out.println("   From account: " + senderAccountId);
            System.out.println("   To: " + recipientAccountId);
            System.out.println("   Amount: $" + amount);

            Transfer transfer = transferService.createTransfer(
                    user,
                    senderItemId,
                    senderAccountId,
                    recipientAccountId,
                    recipientEmail,
                    amount,
                    note
            );

            System.out.println("Transfer created successfully:");
            System.out.println("   ID: " + transfer.getId());
            System.out.println("   Status: " + transfer.getStatus());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Transfer completed successfully",
                    "transferId", transfer.getId(),
                    "amount", transfer.getAmount(),
                    "status", transfer.getStatus().toString()
            ));

        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            System.err.println("Transfer error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process transfer: " + e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getTransferHistory() {
        try {
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            List<Transfer> transfers = transferService.getUserTransfers(user);
            System.out.println("Retrieved " + transfers.size() + " transfers for user: " + user.getEmail());

            return ResponseEntity.ok(transfers);

        } catch (Exception e) {
            System.err.println("Error fetching transfer history: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch transfer history"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransfer(@PathVariable Long id) {
        try {
            AppUser user = getAuthenticatedUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            return transferService.getTransferById(id)
                    .map(transfer -> {
                        if (!transfer.getSenderUser().getId().equals(user.getId())) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body(Map.of("error", "Access denied"));
                        }
                        return ResponseEntity.ok(transfer);
                    })
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            System.err.println("Error fetching transfer: " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch transfer"));
        }
    }

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
