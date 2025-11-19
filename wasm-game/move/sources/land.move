module wr::land {
    use std::string;
    use sui::tx_context::{TxContext, sender};
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::table;
    use sui::event;

    /// Admin capability. Whoever holds this can mint lands and manage the registry.
    struct AdminCap has key, store { id: UID }

    /// Global registry mapping plot_id -> owner (address).
    struct Registry has key {
        id: UID,
        claims: table::Table<u64, address>,
    }

    /// A Land NFT representing a unique plot.
    struct Land has key, store {
        id: UID,
        plot_id: u64,
        rarity: u8,
        room_of_requirement: bool,
        metadata_url: string::String,
    }

    /// Events
    struct LandClaimed has copy, drop { plot_id: u64, owner: address }
    struct LandTransferred has copy, drop { plot_id: u64, from: address, to: address }

    /// Publish this package and call `init` once by the publisher to set up the registry and admin cap.
    public entry fun init(ctx: &mut TxContext) {
        let cap = AdminCap { id: object::new(ctx) };
        let reg = Registry { id: object::new(ctx), claims: table::new<u64, address>(ctx) };
        transfer::share_object(reg);
        transfer::transfer(cap, sender(ctx));
    }

    /// Admin mints a Land directly to `recipient`.
    public entry fun mint(_cap: &AdminCap, recipient: address, plot_id: u64, rarity: u8, room: bool, url: string::String, ctx: &mut TxContext) {
        // Land is unique by plot_id. Allow admin to mint regardless of registry state.
        let land = Land { id: object::new(ctx), plot_id, rarity, room_of_requirement: room, metadata_url: url };
        transfer::transfer(land, recipient);
    }

    /// Permissionless claim: checks in the shared `Registry` that plot is unclaimed and assigns to caller.
    public entry fun claim(reg: &mut Registry, plot_id: u64, rarity: u8, room: bool, url: string::String, ctx: &mut TxContext) {
        let s = sender(ctx);
        let has = table::contains(&reg.claims, &plot_id);
        assert!(!has, 0);
        table::add(&mut reg.claims, plot_id, s);
        let land = Land { id: object::new(ctx), plot_id, rarity, room_of_requirement: room, metadata_url: url };
        event::emit(LandClaimed { plot_id, owner: s });
        transfer::transfer(land, s);
    }

    /// Transfer land using object transfer (constrained; not using approvals market here).
    public entry fun transfer_land(_signer: &signer, land: Land, to: address) {
        let plot_id = land.plot_id;
        // We cannot read the "from" address from `land` easily; use dummy 0x0 for plan purposes.
        event::emit(LandTransferred { plot_id, from: 0x0, to });
        transfer::transfer(land, to);
    }
}

