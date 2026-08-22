# Cryptita Plays — Builder Workshop

A workshop project that pairs a **Sui Move `BuilderCard` package** with a **read-only Vite/React site**. Participants publish and create their card via the **Sui CLI**, then configure a single object ID so the website can render on-chain profile data with `getObject`.

There is **no browser wallet**, **no create form**, and **no on-page transaction signing**. Writes happen in the terminal only.

## What you build

1. **Move package** (`move/`) — `builder_card` module with a `BuilderCard` struct (13 string fields) and `create_builder_card`.
2. **Static website** (`web/`) — single-viewport homepage with MoltenMetal background, translucent header/footer, and a scaled ProfileCard that reads one object from Sui Mainnet.

## Prerequisites

- [Node.js LTS](https://nodejs.org/) (for the frontend)
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) with Move edition 2024 support
- A funded Sui address on **Mainnet** for publish/create (workshop production path)
- Optional: Testnet SUI for practice before Mainnet

### Install Sui CLI

Follow the current official guide:

- https://docs.sui.io/guides/developer/getting-started/sui-install

Verify:

```bash
sui --version
```

### Gas and address balance

After Sui v1.72, transferred SUI may sit in **address balance** instead of a coin object. If `sui client publish` or `sui client call` cannot find gas, follow the **current official Sui documentation** to fund your address or convert balance to a coin. This repo does not ship a helper script.

## Repository layout

```text
move/                  Sui Move package (builder_card)
web/                   Vite + React read-only frontend
spec/                  Workshop specifications (read-only inputs)
index.html, style.css  Card prototype references (do not delete)
```

## Move package

### Build and test

```bash
cd move
sui move build
sui move test
```

### Publish on Mainnet

```bash
sui client switch --env mainnet
sui client active-address   # must be funded
cd move
sui move build
sui move test
sui client publish --gas-budget 100000000
```

Record the **Package ID** from the publish output (for CLI `--package`).

### Create a BuilderCard

Use **thirteen string arguments** in this exact order:

1. `builder_name`
2. `builder_no`
3. `profession`
4. `program`
5. `country`
6. `specialization`
7. `building_since`
8. `focus`
9. `community`
10. `skills` (comma-separated)
11. `issued`
12. `about` (stored on-chain, **not shown** on the website)
13. `website_url` (deployed site URL — shown on Suiscan as link; profile photo is always `web/public/assets/profile.png` on the site)

#### Bash / macOS / Git Bash

```bash
sui client call \
  --package 0xPACKAGE_ID \
  --module builder_card \
  --function create_builder_card \
  --args \
    "Alex Rivera" \
    "BP-042" \
    "Smart Contract Developer" \
    "Cryptita Build & Deploy 2026" \
    "Philippines" \
    "DeFi Protocols" \
    "2024" \
    "Move on Sui" \
    "Cryptita Plays" \
    "Move, Sui, TypeScript, React" \
    "August 2026" \
    "Workshop participant learning Sui Move." \
    "https://your-site.vercel.app" \
  --gas-budget 10000000
```

#### PowerShell

```powershell
sui client call `
  --package 0xPACKAGE_ID `
  --module builder_card `
  --function create_builder_card `
  --args "Alex Rivera" "BP-042" "Smart Contract Developer" "Cryptita Build & Deploy 2026" "Philippines" "DeFi Protocols" "2024" "Move on Sui" "Cryptita Plays" "Move, Sui, TypeScript, React" "August 2026" "Workshop participant learning Sui Move." "https://your-site.vercel.app" `
  --gas-budget 10000000
```

### Package ID vs Object ID

| ID | When you get it | Used for |
| --- | --- | --- |
| **Package ID** | `sui client publish` | CLI `--package` when calling `create_builder_card` |
| **Object ID** | `sui client call create_builder_card` | `VITE_PORTFOLIO_OBJECT_ID` in the frontend |

The website reads the **created object**, not the package. Each `create_builder_card` call mints a **new owned object**.

Verify on Suiscan:

`https://suiscan.xyz/mainnet/object/0xYOUR_OBJECT_ID/fields`

## Frontend

### Environment variables

Copy `web/.env.example` to `web/.env`:

```env
VITE_PORTFOLIO_OBJECT_ID=
VITE_SUI_NETWORK=mainnet
```

| Variable | Purpose |
| --- | --- |
| `VITE_PORTFOLIO_OBJECT_ID` | Created **BuilderCard object ID** (may be empty before create) |
| `VITE_SUI_NETWORK` | Display label for the NETWORK row (`mainnet` → `Sui Mainnet`) |

Vite inlines `VITE_*` at **build time**. After changing `.env`, rebuild and redeploy.

### Local commands

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

An **empty** `VITE_PORTFOLIO_OBJECT_ID` is valid: the site builds and shows empty/placeholder card states without calling RPC. The profile photo always loads from `web/public/assets/profile.png` — replace that file with your portrait before deploy (same filename).

### Profile photo (local file)

1. Replace `web/public/assets/profile.png` with your photo (keep the filename).
2. Deploy the site (e.g. Vercel) and note your HTTPS URL.
3. Pass that URL as the **last CLI argument** (`website_url`) when calling `create_builder_card`.
4. Suiscan will show your site link and derive the public image URL as `{website_url}/assets/profile.png`.

### After create

1. Set `VITE_PORTFOLIO_OBJECT_ID` to your created object ID.
2. Set `VITE_SUI_NETWORK=mainnet` (or `Sui Mainnet`).
3. `npm run build` in `web/`.
4. `npm run preview` and confirm all card fields, ISSUED, OBJECT ID, OWNER, and NETWORK.

### Replacing the displayed card

Call `create_builder_card` again (new object), update `VITE_PORTFOLIO_OBJECT_ID`, rebuild, and redeploy. The previous object remains on-chain; only the configured ID changes what the site reads.

## Deploy to Vercel

Configure in the Vercel dashboard:

| Setting | Value |
| --- | --- |
| Root directory | `web` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | `VITE_PORTFOLIO_OBJECT_ID`, `VITE_SUI_NETWORK` |

Redeploy after any env change. No `vercel.json` is required unless your project defaults differ.

## Optional testnet practice

You may practice publish/create on Testnet first, but the shipped frontend reads **Sui Mainnet** via `getFullnodeUrl('mainnet')`. Testnet objects will not appear unless you change the read client (out of workshop scope).

## Specifications

Detailed requirements live in `spec/`:

- `spec/04-sui-and-smart-contract-spec.md` — Move schema and CLI
- `spec/05-frontend-implementation-spec.md` — React architecture
- `spec/07-testing-and-verification-spec.md` — manual verification checklist

## License

Workshop educational use. Cryptita Plays branding and partner assets belong to their respective owners.
