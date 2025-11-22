/// Swap with fee module: Implements a swap function that deducts a fee from swapped coins.
/// The fee is automatically transferred to a predefined fee collection address.
module wr::swap_with_fee {
    use sui::tx_context::{TxContext, sender};
    use sui::coin::{Self, Coin};
    use sui::transfer;
    use sui::event;
    use wr::lock::{Self, Locked, Key};

    /// Fee collection address where all swap fees are sent
    const FEE_ADDRESS: address = @0x65bb53cfe2e5ea92030e44269dabbaadedfa6a820665c7fc4f8b60fc8800c3b4;
    
    /// Fee percentage in basis points (3 = 0.3%, since 1000 basis points = 100%)
    const FEE_BASIS_POINTS: u64 = 3;
    
    /// Denominator for basis points calculation (1000 = 100%)
    const BASIS_POINTS_DENOMINATOR: u64 = 1000;

    /// Event emitted when a swap with fee occurs
    struct SwapWithFeeEvent<phantom T> has copy, drop {
        sender: address,
        total_amount: u64,
        fee_amount: u64,
        swapped_amount: u64,
    }

    /// Swaps a locked coin by unlocking it, deducting a fee, and returning the remaining amount.
    /// 
    /// # Arguments
    /// * `locked` - A `Locked<Coin<T>>` containing the coin to swap
    /// * `key` - The `Key` required to unlock the locked coin
    /// * `ctx` - Transaction context
    /// 
    /// # Aborts
    /// * If the key doesn't match the locked object (error code 0 from unlock)
    /// * If fee calculation overflows
    /// * If the coin balance is less than the calculated fee amount
    /// 
    /// # Returns
    /// * `Coin<T>` - The remaining coin amount after fee deduction
    /// 
    /// # Example
    /// If you swap 1000 coins with 0.3% fee:
    /// - Fee: 1000 * 3 / 1000 = 3 coins
    /// - Returned: 1000 - 3 = 997 coins
    public fun swap_with_fee<T>(
        locked: Locked<Coin<T>>,
        key: Key,
        ctx: &mut TxContext
    ): Coin<T> {
        // Unlock the coin from the locked structure
        let coin = lock::unlock(locked, key);
        
        // Get the total balance of the coin
        let coin_balance = coin::value(&coin);
        
        // Calculate the fee amount: (balance * fee_basis_points) / denominator
        let fee_amount = (coin_balance * FEE_BASIS_POINTS) / BASIS_POINTS_DENOMINATOR;
        
        // Ensure we have enough balance for the fee
        assert!(coin_balance >= fee_amount, 1); // Error code 1: Insufficient balance for fee
        
        // Calculate the amount to return after fee deduction
        let swapped_amount = coin_balance - fee_amount;
        
        // Split the coin: extract the fee amount, keep the rest
        let fee_coin = coin::split(&mut coin, fee_amount, ctx);
        
        // Transfer the fee to the fee collection address
        transfer::public_transfer(fee_coin, FEE_ADDRESS);
        
        // Emit event for tracking
        event::emit(SwapWithFeeEvent<T> {
            sender: sender(ctx),
            total_amount: coin_balance,
            fee_amount,
            swapped_amount,
        });
        
        // Return the remaining coin amount for the swap
        coin
    }

    /// Entry function version of swap_with_fee for direct transaction calls.
    /// 
    /// # Arguments
    /// * `locked` - A `Locked<Coin<T>>` containing the coin to swap
    /// * `key` - The `Key` required to unlock the locked coin
    /// * `ctx` - Transaction context
    public entry fun swap_with_fee_entry<T>(
        locked: Locked<Coin<T>>,
        key: Key,
        ctx: &mut TxContext
    ) {
        let swapped_coin = swap_with_fee(locked, key, ctx);
        // Transfer the swapped coin back to the sender
        transfer::public_transfer(swapped_coin, sender(ctx));
    }

    /// Locks a coin and returns both the locked coin and its key.
    /// This is a convenience function to prepare a coin for swapping.
    /// 
    /// # Arguments
    /// * `coin` - The coin to lock
    /// * `ctx` - Transaction context
    /// 
    /// # Returns
    /// * `(Locked<Coin<T>>, Key)` - The locked coin and its key
    public fun lock_coin<T>(coin: Coin<T>, ctx: &mut TxContext): (Locked<Coin<T>>, Key) {
        lock::lock(coin, ctx)
    }

    /// Gets the fee address (for querying purposes).
    public fun get_fee_address(): address {
        FEE_ADDRESS
    }

    /// Gets the fee basis points (for querying purposes).
    public fun get_fee_basis_points(): u64 {
        FEE_BASIS_POINTS
    }
}

