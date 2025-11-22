/// Lock module: Provides a lock/unlock mechanism for any object that implements `key + store`.
/// This allows objects (like coins) to be locked with a key that must be presented to unlock them.
module wr::lock {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::TxContext;
    use sui::transfer;

    /// A locked object wrapper. The object is stored inside along with the ID of the key needed to unlock it.
    public struct Locked<T: key + store> has key, store {
        id: UID,
        key: ID,
        object: T,
    }

    /// A key that can be used to unlock a `Locked` object.
    /// The key's ID must match the `key` field in the `Locked` struct.
    public struct Key has key, store {
        id: UID
    }

    /// Locks an object and returns both the `Locked` wrapper and the `Key` needed to unlock it.
    /// 
    /// # Arguments
    /// * `obj` - The object to lock (must implement `key + store`)
    /// * `ctx` - Transaction context
    /// 
    /// # Returns
    /// * `(Locked<T>, Key)` - The locked object and its corresponding key
    public fun lock<T: key + store>(obj: T, ctx: &mut TxContext): (Locked<T>, Key) {
        let key = Key { id: object::new(ctx) };
        let key_id = object::id(&key);
        
        let locked = Locked {
            id: object::new(ctx),
            key: key_id,
            object: obj,
        };
        
        (locked, key)
    }

    /// Unlocks a `Locked` object by providing the matching `Key`.
    /// 
    /// # Arguments
    /// * `locked` - The locked object to unlock
    /// * `key` - The key that matches the locked object's key ID
    /// 
    /// # Aborts
    /// * If the key ID doesn't match the locked object's key ID (error code 0)
    /// 
    /// # Returns
    /// * The original unlocked object
    public fun unlock<T: key + store>(locked: Locked<T>, key: Key): T {
        let key_id = object::id(&key);
        assert!(locked.key == key_id, 0); // Error code 0: Key mismatch
        
        // Delete the key and locked wrapper objects
        object::delete(key.id);
        let obj = locked.object;
        object::delete(locked.id);
        
        obj
    }

    /// Transfers a locked object to another address.
    /// The recipient will need the key to unlock it.
    public fun transfer_locked<T: key + store>(locked: Locked<T>, recipient: address) {
        transfer::transfer(locked, recipient);
    }

    /// Transfers a key to another address.
    /// This allows delegation of unlock capability.
    public fun transfer_key(key: Key, recipient: address) {
        transfer::transfer(key, recipient);
    }
}



