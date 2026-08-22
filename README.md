# Cryptita Plays — Builder Workshop

A workshop project that pairs a **Sui Move `BuilderCard` package** with a **read-only Vite/React site**.

You publish and create your card with the **Sui CLI**, then set one object ID so the website can read on-chain profile data.

There is **no browser wallet**, **no create form**, and **no on-page transaction signing**. Writes happen in the terminal only.

---

## Essential resources

| Resource | Link / path |
| -------- | ----------- |
| Node.js LTS | https://nodejs.org/ |
| Sui CLI install | https://docs.sui.io/guides/developer/getting-started/sui-install |
| Sui faucet (Testnet) | https://faucet.sui.io/ |
| Suiscan (Testnet) | https://suiscan.xyz/testnet |
| Suiscan (Mainnet) | https://suiscan.xyz/mainnet |
| Builder Registry (shared) | https://github.com/Cryptita-Plays/cryptita-builder-registry |
| This repo layout | `move/` (contract), `web/` (frontend), `spec/` (detailed specs) |
| Profile photo file | `web/public/assets/profile.png` |
| Frontend env template | `web/.env.example` |

### Quick command cheat sheet

```bash
# Toolchain
sui --version
sui client active-env
sui client active-address
sui client balance

# Move
cd move
sui move build
sui move test
sui client publish --gas-budget 100000000

# Frontend
cd web
npm install
npm run dev
npm run build
npm run preview
```

---

## What you build

1. **Move package** (`move/`) — `builder_card` module with a `BuilderCard` object and `create_builder_card`.
2. **Static website** (`web/`) — single-viewport homepage that reads one on-chain object and shows your profile photo from `web/public/assets/profile.png`.

### How data flows

```text
1. Replace profile.png
2. Deploy website  →  get HTTPS URL
3. Publish Move package  →  Package ID
4. Call create_builder_card  →  Object ID  (+ auto builder_no from registry)
5. Set VITE_PORTFOLIO_OBJECT_ID in web/.env
6. Rebuild / redeploy site  →  card fills from chain; status dot turns green
```

| What appears on the site | Source |
| ------------------------ | ------ |
| Builder name, profession, skills, etc. | On-chain `BuilderCard` fields (via `VITE_PORTFOLIO_OBJECT_ID`) |
| Builder number | Auto-claimed from Cryptita Builder Registry |
| Profile photo | Local file `web/public/assets/profile.png` |
| Grey / green status dot | Grey = empty object ID; green = `VITE_PORTFOLIO_OBJECT_ID` has a value |
| Suiscan link + explorer image | On-chain `website_url` and derived `photo_url` |
| Header / footer / partners | Hardcoded workshop assets |

---

## Prerequisites

1. Install [Node.js LTS](https://nodejs.org/).
2. Install [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) (Move edition 2024).
3. Create / fund a Sui address (Testnet for practice, Mainnet for workshop production).
4. Have a GitHub account and (for hosting) a Vercel account.

### Verify Sui CLI

```bash
sui --version
sui client active-address
```

### Switch network

```bash
# Practice
sui client switch --env testnet

# Workshop production
sui client switch --env mainnet
```

If `mainnet` / `testnet` is missing:

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443
```

---

## Repository layout

```text
move/                  Sui Move package (builder_card)
web/                   Vite + React read-only frontend
spec/                  Workshop specifications
index.html, style.css  Card prototype references (do not delete)
```

---

## Step-by-step workshop path

Follow these steps in order.

### Step 1 — Clone and install the frontend

```bash
cd web
npm install
cp .env.example .env
```

On PowerShell:

```powershell
cd web
npm install
Copy-Item .env.example .env
```

Leave `VITE_PORTFOLIO_OBJECT_ID` empty for now.

```env
VITE_PORTFOLIO_OBJECT_ID=
VITE_SUI_NETWORK=testnet
VITE_CHAIN=sui
```

For Mainnet production later, set `VITE_SUI_NETWORK=mainnet`.

### Step 2 — Replace your profile photo

1. Replace `web/public/assets/profile.png` with your portrait.
2. Keep the **exact filename** `profile.png`.
3. Prefer a square or portrait photo; it is cropped to the card frame.

### Step 3 — Run the site locally (empty card is OK)

```bash
cd web
npm run dev
```

Open http://localhost:5173

Expected:

- Card shows placeholders (`—` / `Builder name`)
- Status dot next to BUILDER NO. is **grey**
- Photo still shows `profile.png` from local assets

### Step 4 — Deploy the website and copy your URL

Deploy `web/` first so you have a public HTTPS URL for the on-chain `website_url` argument.

**Vercel settings:**

| Setting | Value |
| ------- | ----- |
| Root directory | `web` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Env (optional at first) | `VITE_SUI_NETWORK`, `VITE_PORTFOLIO_OBJECT_ID` |

1. Deploy with an empty `VITE_PORTFOLIO_OBJECT_ID` if needed.
2. Copy your site URL, e.g. `https://your-name.vercel.app` (no trailing slash).

### Step 5 — Build and test the Move package

```bash
cd move
sui move build
sui move test
```

### Step 6 — Publish the package

```bash
sui client switch --env testnet   # or mainnet
sui client active-address         # must be funded
cd move
sui client publish --gas-budget 100000000
```

1. From the publish output, copy the **Package ID** (`Published Objects` / package digest).
2. Save it somewhere safe. You need it for `--package` in the next step.

### Step 7 — Create your BuilderCard

`builder_no` is **not** a CLI argument. It is claimed automatically from the shared Cryptita Builder Registry.

Pass the **shared registry object** first, then **12 strings** in this exact order:

| # | Argument | Example |
| - | -------- | ------- |
| 1 | `registry` (shared object ID) | see table below |
| 2 | `builder_name` | `"Alex Rivera"` |
| 3 | `profession` | `"Smart Contract Developer"` |
| 4 | `program` | `"Cryptita Build & Deploy 2026"` |
| 5 | `country` | `"Philippines"` |
| 6 | `specialization` | `"DeFi Protocols"` |
| 7 | `building_since` | `"2024"` |
| 8 | `focus` | `"Move on Sui"` |
| 9 | `community` | `"Cryptita Plays"` |
| 10 | `skills` (comma-separated) | `"Move, Sui, TypeScript, React"` |
| 11 | `issued` | `"August 2026"` |
| 12 | `about` (on-chain only; not shown on site) | `"Workshop participant learning Sui Move."` |
| 13 | `website_url` (no trailing slash) | `"https://your-name.vercel.app"` |

**Registry object IDs:**

| Network | Shared `BuilderRegistry` object ID |
| ------- | ---------------------------------- |
| Testnet | `0x2995095d1e6fda52afde3649a74be5fc2b1dc8b57bfc9f60d5ff708afdcdc923` |
| Mainnet | Ask the workshop organizer (use the Mainnet registry ID when published) |

On create, the contract also stores:

- `website_url` — shown as Suiscan / Display `link`
- `photo_url` — derived as `{website_url}/assets/profile.png` for explorers

#### Bash / macOS / Git Bash

```bash
sui client call \
  --package 0xPACKAGE_ID \
  --module builder_card \
  --function create_builder_card \
  --args \
    0x2995095d1e6fda52afde3649a74be5fc2b1dc8b57bfc9f60d5ff708afdcdc923 \
    "Alex Rivera" \
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
    "https://your-name.vercel.app" \
  --gas-budget 10000000
```

#### PowerShell

```powershell
sui client call `
  --package 0xPACKAGE_ID `
  --module builder_card `
  --function create_builder_card `
  --args 0x2995095d1e6fda52afde3649a74be5fc2b1dc8b57bfc9f60d5ff708afdcdc923 "Alex Rivera" "Smart Contract Developer" "Cryptita Build & Deploy 2026" "Philippines" "DeFi Protocols" "2024" "Move on Sui" "Cryptita Plays" "Move, Sui, TypeScript, React" "August 2026" "Workshop participant learning Sui Move." "https://your-name.vercel.app" `
  --gas-budget 10000000
```

1. From the call output, copy the **Created Object ID** of the new `BuilderCard`.
2. Open Suiscan to verify fields and link:
   - Testnet: `https://suiscan.xyz/testnet/object/0xYOUR_OBJECT_ID/fields`
   - Mainnet: `https://suiscan.xyz/mainnet/object/0xYOUR_OBJECT_ID/fields`

### Step 8 — Point the frontend at your object

Edit `web/.env`:

```env
VITE_PORTFOLIO_OBJECT_ID=0xYOUR_OBJECT_ID
VITE_SUI_NETWORK=testnet
VITE_CHAIN=sui
```

Use `mainnet` when your object was created on Mainnet.

### Step 9 — Rebuild and verify

Locally:

```bash
cd web
npm run build
npm run preview
```

Or set the same env vars in Vercel and **Redeploy**.

Expected:

1. Card fields fill from chain (name, profession, skills, issued, …).
2. Status dot turns **green**.
3. OBJECT ID / OWNER / NETWORK rows populate.
4. Photo still comes from `/assets/profile.png` on your deployed site.
5. Suiscan shows your `website_url` link and explorer image URL.

### Step 10 — Optional: replace or reset the displayed card

**Show a different card:** call `create_builder_card` again, update `VITE_PORTFOLIO_OBJECT_ID`, rebuild/redeploy. Old objects stay on-chain.

**Reset local / template for other users (later):**

1. Clear `VITE_PORTFOLIO_OBJECT_ID=` in `web/.env` (and in Vercel).
2. Keep `web/.env.example` empty for that value.
3. Do not commit personal `.env` values.
4. `move/build/` is gitignored and safe to delete; regenerate with `sui move build`.
5. On-chain history cannot be deleted — “reset” means pointing the site at an empty or new object ID.

---

## Package ID vs Object ID

| ID | When you get it | Used for |
| -- | --------------- | -------- |
| **Package ID** | `sui client publish` | CLI `--package` for `create_builder_card` |
| **Registry object ID** | Shared Cryptita registry | First CLI arg (`&mut BuilderRegistry`) |
| **Object ID** | `create_builder_card` success | `VITE_PORTFOLIO_OBJECT_ID` in the frontend |

The website reads the **created BuilderCard object**, not the package.

---

## Environment variables

| Variable | Purpose |
| -------- | ------- |
| `VITE_PORTFOLIO_OBJECT_ID` | Created BuilderCard object ID. Empty = placeholder card + grey status dot |
| `VITE_SUI_NETWORK` | `testnet` / `mainnet` / `devnet` — selects RPC/GraphQL and NETWORK label |
| `VITE_CHAIN` | Visual chain theme (default `sui`) |

Vite inlines `VITE_*` at **build time**. After any `.env` change, rebuild and redeploy.

---

## Troubleshooting

### Sui CLI / gas

| Error / symptom | Likely cause | Fix |
| --------------- | ------------ | --- |
| `sui: command not found` | CLI not installed or not on PATH | Reinstall from official docs; reopen terminal |
| No gas / cannot find coin | SUI is in address balance, not a coin object | Fund address; follow current Sui docs to convert balance → coin |
| Wrong network publish | Active env is testnet but you wanted mainnet (or opposite) | `sui client switch --env …` then republish |
| Insufficient gas budget | Budget too low | Raise `--gas-budget` (e.g. `100000000` publish, `10000000` call) |

### Publish / create

| Error / symptom | Likely cause | Fix |
| --------------- | ------------ | --- |
| Compile error in Move | Dependency / syntax issue | Run `sui move build` and fix reported lines first |
| `create_builder_card` arity / type mismatch | Wrong number or order of args | Use registry object + 12 strings; do **not** pass `builder_no` |
| Registry object not found / wrong type | Wrong network registry ID | Use Testnet ID above on testnet; Mainnet ID from organizer on mainnet |
| Object created but Suiscan shows no link | Forgot `website_url` or used trailing slash inconsistently | Pass clean HTTPS URL with no trailing slash; recreate card if needed |
| Old object missing `website_url` | Object created with previous schema | Republish package and create a **new** card |

### Frontend

| Error / symptom | Likely cause | Fix |
| --------------- | ------------ | --- |
| Card stays empty / grey dot | `VITE_PORTFOLIO_OBJECT_ID` empty or not rebuilt | Set object ID in `.env`, then restart `npm run dev` or rebuild |
| Card error / “object not found” | Wrong ID, wrong network, or typo | Match `VITE_SUI_NETWORK` to the network where the object exists |
| Env change ignored | Vite caches build-time env | Stop/restart `npm run dev`; for production, rebuild + redeploy |
| Photo missing | File not at `web/public/assets/profile.png` | Replace that exact path/filename and redeploy |
| Photo OK locally, broken on Suiscan | Site not deployed or wrong `website_url` | Deploy site first; pass that URL as last create arg |
| Dot green but fields empty/error | Object ID set but fetch failed | Check network, object type ends with `::builder_card::BuilderCard` |

### Reset / handoff

| Goal | What to do |
| ---- | ---------- |
| Clear personal data from local site | Empty `VITE_PORTFOLIO_OBJECT_ID` in `web/.env`, restart dev server |
| Prepare repo for next cohort | Keep `.env.example` empty; never commit `.env`; remove personal IDs from docs/examples |
| Clear hosted site | Clear Vercel env vars → Redeploy |
| Delete on-chain data | Not possible — create a new object and point the site at it |

---

## Optional Testnet practice

1. Practice publish + create on Testnet first.
2. Set `VITE_SUI_NETWORK=testnet` so the frontend GraphQL client matches.
3. When ready for workshop production, switch to Mainnet, republish, recreate, update env, and redeploy.

---

## Specifications

Detailed requirements live in `spec/`:

- `spec/04-sui-and-smart-contract-spec.md` — Move schema and CLI
- `spec/05-frontend-implementation-spec.md` — React architecture
- `spec/06-deployment-and-environment-spec.md` — deploy / env
- `spec/07-testing-and-verification-spec.md` — verification checklist

> Note: some older locked specs still describe a manual `builder_no` string and `photo_url` CLI arg. The **current code and this README** are authoritative: registry-assigned `builder_no`, local `profile.png`, and CLI `website_url`.

---

## License

Workshop educational use. Cryptita Plays branding and partner assets belong to their respective owners.
