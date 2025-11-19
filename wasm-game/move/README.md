# Wizarding Realms — Land Claiming (Sui Move Plan)

This package sketches a minimal land-claiming flow:

- `Registry` (shared object): stores a `Table<u64, address>` mapping `plot_id -> owner`.
- `AdminCap`: capability held by project admin for controlled minting.
- `Land`: `key` object (NFT) representing a unique plot.
- `init`: creates `AdminCap` and shares the `Registry`.
- `claim`: permissionless first-come claim. Fails if `plot_id` already exists in the table.
- `mint`: admin mints land directly to a recipient (e.g., for presale/airdrops).
- `transfer_land`: simple transfer (placeholder; use a marketplace or advanced escrow in production).

Directory:

- `Move.toml`
- `sources/land.move`

Build/Publish (using Sui CLI):

```bash
sui client switch --env mainnet   # or testnet/devnet
sui move build
sui client publish --gas-budget 100000000
```

Front‑end flow:

1. User connects Sui wallet.
2. Front‑end checks if `plot_id` exists in `Registry.claims` (via RPC).
3. If not claimed, calls `claim(registry_id, plot_id, rarity, room, url)` with user as sender.
4. After success, the user receives the `Land` object; UI reads `metadata_url` and shows rarity/badges.

Security / Upgrades:

- Use `AdminCap` to gate admin operations.
- Move events `LandClaimed` and `LandTransferred` allow indexing.
- For upgrades, migrate to a v2 module and optionally gate via `UpgradeCap`.


