# 08 — Implementation Checklist

Build a **new** Cryptita Plays repo from this `/spec` package. Do not clone or copy the original camp source.

**Model:** CLI-only writes (`sui client publish`, `sui client call create_builder_card`) + **read-only** static frontend (`getObject` only). No Connect Wallet, no create form, no browser PTB, no `@mysten/dapp-kit`. `[LOCKED]`

Cross-references: struct and CLI arg order in `04`; frontend details in `05`; env and deploy in `06`; verification in `07`.

---

## Audit log (2026-08-22)

Repo audited against this checklist. Checkboxes below reflect **current codebase state** (not aspirational spec).

**Why boxes were unchecked:** this file is the living tracker; it was not updated as implementation landed.

**Needs developer confirmation (cannot verify from repo alone):**

- Mainnet publish + live `create_builder_card` object ID
- Production `web/.env` / Vercel env values
- Hosted Vercel deploy + manual verification from `07`

**Known deviations from locked spec (resolve or update `04` / `01`):**

| Item | Spec | Current repo |
| ---- | ---- | ------------ |
| Move `BuilderCard.builder_no` | `String` (CLI arg #2) | `u64` — auto-claimed from `builder_registry` |
| `create_builder_card` args | 13 strings + `TxContext` | `&mut BuilderRegistry` + 12 strings + `TxContext` |
| Publisher / Display | Skip — no `init` | `init` claims Publisher + Display |
| Move tests | `test_create_builder_card_*` | **None** in `move/` |
| `config.ts` | optional `VITE_PACKAGE_ID` | Not present (`VITE_CHAIN` + GraphQL URL added instead) |
| `suiClient.ts` | `SuiClient` + `getFullnodeUrl` | `SuiGraphQLClient` + network GraphQL endpoint |
| Footer socials | Facebook + LinkedIn in **Footer** | In `SocialActions` below card; Footer is disclaimer only |
| README CLI args | 13 strings per `04` | Still documents manual `builder_no` string — **stale vs contract** |

---

## Phase 1 — Scaffold

- [x] Create frontend with Vite + React + TypeScript under `web/`
- [x] Add plain CSS files (`global.css`, `profile-card.css`, `MoltenMetal.css`). **No Tailwind.** `[LOCKED]`
- [x] Install `@mysten/sui` (read client only) and `ogl` (MoltenMetal). Pin versions from official Sui docs on scaffold day.
- [x] **Do not** install `@mysten/dapp-kit`, wallet adapters, or `@tanstack/react-query`. `[LOCKED]`
- [x] `main.tsx`: mount `App` only — **no** `WalletProvider`, **no** `QueryClientProvider`, **no** dapp-kit CSS. `[LOCKED]`
- [ ] `config.ts`: `VITE_SUI_NETWORK`, optional `VITE_PACKAGE_ID` (README/CLI only), `VITE_PORTFOLIO_OBJECT_ID` (created Object ID — not Package ID). `[LOCKED]` — **partial:** `VITE_PORTFOLIO_OBJECT_ID` + `VITE_SUI_NETWORK` yes; `VITE_PACKAGE_ID` missing
- [x] Cryptita Plays title in `index.html` (no original personal meta)

## Phase 2 — UI shell (read-only, no chain writes)

- [x] Full-viewport **MoltenMetal** background (`ogl` + `MoltenMetal.css`)
- [x] Translucent **Header** with `cryptita long.svg` (opacity ~0.4–0.55)
- [x] Centered **ProfileCard** (front + back, click-to-flip) — markup ported from repo-root `index.html` / `style.css`
- [ ] Translucent **Footer**: Facebook + LinkedIn buttons + “Proof of Learning & Building” block (see `03`) — **partial:** disclaimer in Footer; Facebook + LinkedIn in `SocialActions` under card
- [x] No-scroll shell: `100dvh`, `overflow: hidden` on `html` / `body` / app root. `[LOCKED]`
- [x] Card scale wrapper: `transform: scale()` at narrow viewports; cap ~1020px; `visualViewport` counter-zoom. `[LOCKED]`
- [x] Copy static partner SVGs to `web/public/assets/` (not `public/profile.png` as photo source). `[LOCKED]`
- [x] **Do not scaffold:** `WalletBar`, `Hero`, `AboutSkills`, `Learn`, `CreateForm`, `Proof` section, wallet connect UI. `[REMOVE]`
- [x] **Camera** export: `SocialActions` button downloads one composite PNG (tilted front + back on marble-like gradient; no keychain) via hidden `BuilderCardExport` + `html-to-image` (see `03` §4.8 / `09`)
- [x] Export output is **1080 × 1350 px** (4:5 social post size); cards scaled uniformly, no distortion
- [x] Camera disabled until `portfolio.status === 'success'` (no placeholder export)
- [x] Export failure downloads error PNG + shows on-page toast (no silent black image)

## Phase 3 — Move package

- [x] New Move package under `move/` (do not copy original `portfolio.move` text, comments, or Display camp copy)
- [x] Package name **`builder_card`**; module **`builder_card`**; file `builder_card.move`. `[LOCKED]`
- [ ] Struct **`BuilderCard`** with thirteen string fields as specified in `04` (not `Portfolio`, not `course` / `school` / `linkedin_url` / `github_url`) — **partial:** `builder_no` is `u64` from registry, not a string field
- [ ] `create_builder_card` — thirteen string args + `&mut TxContext`; transfer new object to sender. `[LOCKED]` — **partial:** takes `&mut BuilderRegistry` + twelve strings; `builder_no` assigned on-chain
- [ ] Skip Publisher/Display. **No `init` Display.** `[LOCKED]` — **not done:** `init` creates Publisher + Display
- [x] `sui move build`
- [ ] `sui move test` — at least `test_create_builder_card_fields`; recommended `test_create_builder_card_transferred_to_sender`

## Phase 4 — Read path

- [ ] `suiClient.ts`: `SuiClient` + `getFullnodeUrl('mainnet')` (or current docs default) — **partial:** uses `SuiGraphQLClient` + GraphQL URL from `config.ts`
- [x] `mapBuilderCard.ts`: map `content.fields` when type ends with `::builder_card::BuilderCard`
- [x] Hook `usePortfolio` (read-only name): `getObject` on `VITE_PORTFOLIO_OBJECT_ID`; empty / loading / error / success states
- [x] Split `skills` on `,`, trim, drop empties → chips. `[LOCKED]`
- [x] Render front-face fields; **do not** render `about` in the DOM. `[LOCKED]`
- [x] Photo `src` from on-chain **`photo_url`** — not `public/profile.png` as source of truth. `[LOCKED]`
- [x] Derived credential row: **ISSUED** from chain; **NETWORK** from `VITE_SUI_NETWORK` label; **OBJECT ID** and **OWNER** from `getObject` response. `[LOCKED]`
- [x] Copy buttons + optional Suiscan link on OBJECT ID; explorer link for object id
- [x] Empty `VITE_PORTFOLIO_OBJECT_ID`: build succeeds; runtime shows empty/error card — **no fake identity**. `[LOCKED]`

## Phase 5 — Write path (CLI only)

- [x] **No** create form, **no** PTB from browser, **no** `signAndExecuteTransaction`. `[LOCKED]`
- [ ] Document full CLI loop in README (see `06` §7):
  - `sui client publish` → Package ID
  - `sui client call --module builder_card --function create_builder_card` with **thirteen** `--args` in order from `04` (bash + PowerShell)
  - Paste **Created Object ID** into `VITE_PORTFOLIO_OBJECT_ID`
  - `npm run build` → redeploy `dist/`
  — **partial:** README has the loop but CLI `--args` still list manual `builder_no` (stale vs `builder_card.move`)
- [x] **Do not** implement `useCreatePortfolio`, `create_portfolio`, or `package::portfolio::create_portfolio`. `[REMOVE]`

## Phase 6 — Workshop extras

- [x] README: Learn → Build → Deploy for Cryptita Plays (CLI create + env configure + read-only site)
- [x] Official Sui install + faucet/docs links (generic)
- [ ] Mainnet publish + `create_builder_card` instructions with all thirteen args — **partial:** present but args do not match current contract (registry + auto `builder_no`)
- [x] Gas troubleshooting: link to current official Sui docs — no `tools/` balance script. `[LOCKED]`
- [x] Vercel: root `web/`, `npm run build`, set `VITE_*` env vars, redeploy after ID changes. `[LOCKED]`
- [x] README must **not** imply Connect Wallet or submit-from-website create. `[LOCKED]`

## Phase 7 — Ship

- [ ] `sui move build` && `sui move test` pass locally — **partial:** `sui move build` passes; **no Move tests**
- [ ] Publish Move package to Mainnet (`sui client publish`) — **confirm with developer**
- [ ] `sui client call create_builder_card` → record Package ID + **Created Object ID** — **confirm with developer**
- [ ] Set `VITE_PORTFOLIO_OBJECT_ID` and `VITE_SUI_NETWORK` in `web/.env` (and Vercel env for production) — **confirm with developer**
- [x] `cd web && npm run build`
- [ ] Deploy `dist/` to Vercel (HTTPS read-only site) — **confirm with developer**
- [ ] Full loop verification from `07-testing-and-verification-spec.md` — **confirm with developer**
- [ ] Confirm **zero** original org names, logos, sample identity, and sample IDs — **review:** DEVCON appears as intentional community partner on card back
- [ ] Confirm **no** wallet UI anywhere on hosted site. `[LOCKED]` — **confirm on hosted deploy**

---

## Original elements that must not appear

| Element | Action |
| ------- | ------ |
| DEVCON / original camp titles | Replace |
| Personal sample name, school, socials, meta author | Replace |
| `devcon.png` and camp OG images | Do not use |
| Sample GitHub/Vercel URLs from the original README | Do not use |
| Display template legal paragraph | Do not use |
| `gh-pages` homepage URL to original user | Do not use |
| Hardcoded mainnet/testnet IDs from `constants.ts` / `Move.lock` | Do not reuse |
| `create_portfolio`, `Portfolio` struct, old field set | **Replace** with `BuilderCard` / `create_builder_card` `[LOCKED]` |
| Browser wallet / dapp-kit / create form write path | **Remove** — CLI only `[LOCKED]` |
| `public/profile.png` as on-chain photo substitute | **Remove** — use `photo_url` `[LOCKED]` |

---

## Traceability reminder

| Topic | Spec |
| ----- | ---- |
| Locked product decisions | `01-project-spec.md` |
| Repo tree, data flow | `02-architecture-spec.md` |
| Layout, brand, scaling | `03-ui-ux-and-brand-spec.md` |
| Move struct, CLI args | `04-sui-and-smart-contract-spec.md` |
| Frontend files, deps, mapping | `05-frontend-implementation-spec.md` |
| Env, deploy, README | `06-deployment-and-environment-spec.md` |
| Manual verification | `07-testing-and-verification-spec.md` |

If a decision conflicts with this checklist, follow **Locked decisions** in `01-project-spec.md`.
