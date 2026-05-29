package com.company.Fincard.bank;

import com.company.Fincard.appuser.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBankRepository extends JpaRepository<UserBank, Long> {

    /**
     * Find all banks connected by a specific user
     * @param user The AppUser entity
     * @return List of UserBank entities
     */
    List<UserBank> findByUser(AppUser user);

    /**
     * Find all banks by user ID
     * @param userId The user's ID
     * @return List of UserBank entities
     */
    List<UserBank> findByUserId(Long userId);

    /**
     * Find a bank by Plaid item_id
     * @param itemId Plaid's item ID
     * @return Optional UserBank
     */
    Optional<UserBank> findByItemId(String itemId);

    /**
     * Check if a user has already connected this bank (by item_id)
     * @param user The AppUser entity
     * @param itemId Plaid's item ID
     * @return true if exists, false otherwise
     */
    boolean existsByUserAndItemId(AppUser user, String itemId);

    /**
     * Delete a bank by item_id
     * @param itemId Plaid's item ID
     */
    void deleteByItemId(String itemId);

    /**
     * Count total banks connected by a user
     * @param userId User's ID
     * @return Count of banks
     */
    long countByUserId(Long userId);
}