# Swap System - Move Smart Contracts

This directory contains Move smart contracts for implementing a lock/unlock mechanism and a swap system with fee collection on Sui blockchain.

## Modules

### 1. `lock.move`
Provides a generic lock/unlock mechanism for any object that implements `key + store`.

**Key Structures:**
- `Locked<T>`: Wraps an object with a key ID that must be matched to unlock
- `Key`: The key object needed to unlock a `Locked` object

**Main Functions:**
- `lock<T>(obj: T, ctx: &mut TxContext)`: Locks an object and returns both the locked wrapper and its key
- `unlock<T>(locked: Locked<T>, key: Key)`: Unlocks an object by providing the matching key
- `transfer_locked<T>()`: Transfers a locked object to another address
- `transfer_key()`: Transfers a key to another address (delegation)

### 2. `swap_with_fee.move`
Implements a swap function that automatically deducts a 0.3% fee from swapped coins and transfers it to a predefined address.

**Configuration:**
- **Fee Address**: `0x65bb53cfe2e5ea92030e44269dabbaadedfa6a820665c7fc4f8b60fc8800c3b4`
- **Fee Rate**: 0.3% (3 basis points out of 1000)

**Main Functions:**
- `swap_with_fee<T>()`: Unlocks a locked coin, deducts fee, and returns remaining amount
- `swap_with_fee_entry<T>()`: Entry function that swaps and transfers result back to sender
- `lock_coin<T>()`: Convenience function to lock a coin for swapping
- `get_fee_address()`: Returns the fee collection address
- `get_fee_basis_points()`: Returns the fee rate in basis points

**Events:**
- `SwapWithFeeEvent<T>`: Emitted on each swap, containing sender, total amount, fee amount, and swapped amount

## Usage Example

```move
// 1. Lock a coin
let (locked_coin, key) = swap_with_fee::lock_coin(my_coin, ctx);

// 2. Perform swap (deducts 0.3% fee automatically)
let swapped_coin = swap_with_fee::swap_with_fee(locked_coin, key, ctx);

// Or use the entry function (automatically transfers result to sender)
swap_with_fee::swap_with_fee_entry(locked_coin, key, ctx);
```

## Building and Publishing

### Prerequisites
- Sui CLI installed
- Sui wallet configured

### Build
```bash
cd wasm-game/move
sui move build
```

### Publish
```bash
# Switch to desired network
sui client switch --env mainnet   # or testnet/devnet

# Publish the package
sui client publish --gas-budget 100000000
```

After publishing, note the package ID and update your frontend to use the published modules.

## Security Considerations

1. **Key Management**: The key must be kept secure. If lost, the locked object cannot be unlocked.
2. **Fee Address**: The fee address is hardcoded in the contract. To change it, you need to publish a new version.
3. **Fee Calculation**: Uses integer division, so very small amounts may result in 0 fee (minimum 1 coin needed for 0.3% fee to be at least 1).
4. **Access Control**: The lock/unlock mechanism ensures only the key holder can unlock the object.

## Testing

To test the contracts:

```bash
# Run tests (if you add test modules)
sui move test

# Or test via Sui CLI after publishing
sui client call \
  --package <PACKAGE_ID> \
  --module swap_with_fee \
  --function swap_with_fee_entry \
  --args <LOCKED_COIN_ID> <KEY_ID> \
  --gas-budget 100000000
```

## Integration with Frontend

The frontend should:
1. Lock coins using `lock_coin()` before initiating a swap
2. Call `swap_with_fee_entry()` with the locked coin and key
3. Listen for `SwapWithFeeEvent` events to track swaps
4. Display fee information using `get_fee_address()` and `get_fee_basis_points()`





