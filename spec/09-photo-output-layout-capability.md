# 09 — Photo output layout (product capability)

**Status:** decided — Camera export still (2026-08-22)  
**Intent source:** product-photo mock (front + back on marble). Keychain **removed**.  
**Locked surface:** `03` §4.8 (this file supersedes the previous dark stacked-card export)

---

## CAPABILITY

A workshop visitor whose `BuilderCard` has loaded can click **Camera** and download one **1080×1350 (4:5)** PNG: a product still of the **front face above the back face**, both slightly tilted, on a **CSS marble-like gradient**. All personal and on-chain fields come from the same `usePortfolio` / `BuilderCard` data as the live homepage card. Workshop chrome (wordmark, four partners, Sui lockup) stays static. There is **no keychain**.

---

## CONSTRAINTS

### Unchanged workshop rules

- Writes stay CLI-only; Camera is client-side PNG only.
- Field mapping stays `05` §15. `about` must not appear.
- Live homepage stays the flip `ProfileCard` on MoltenMetal. This is export composition only.
- Capture stays off-screen `BuilderCardExport` + `html-to-image` (not the flip card, not the shader).

### Product decisions (locked here)

| Topic | Decision |
| ----- | -------- |
| Mock role | **Replace** the Camera PNG layout (not a second download, not merch-only). |
| Realism | **Flat composite** — same layout as the mock (stack + tilt). Not photoreal 3D. |
| Frame | **1080 × 1350 (4:5)**; still fitted inside, uniform card scale, no stretch. |
| Keychain | **Removed entirely.** |
| Marble | **CSS marble-like gradient** — no photo asset. |
| Empty / loading / error | Camera **disabled**. Do not export placeholder identity. |
| Partners | All **four** (Devcon Laguna, AWS/UPHSL, Gran:iX, Kamiyon) — same back face as the live card. |
| ISSUED | Keep the existing credential-row field. Display the on-chain `issued` **string as stored**. Do not add a date parser or ISO formatter. |

### Feasibility

| Promise | Status |
| ------- | ------ |
| Auto-place fields from loaded card | Yes |
| Reuse live front/back faces | Yes |
| Tilted 2D stack on marble gradient in 4:5 | Yes (`transform: rotate` + CSS background) |
| Photoreal 3D / physical thickness | Out of scope |

---

## IMPLEMENTATION CONTRACT

### Actors

- **Visitor:** Camera only after a successful object load; one PNG download.
- **Staff:** no per-builder export copy; no marble/keychain asset pack.

### Surfaces

- `SocialActions` Camera control (disabled until `portfolio.status === 'success'`).
- Hidden `BuilderCardExport` studio: marble gradient, front then back, opposite mild tilts, drop shadows.
- No new route.

### States and transitions

```text
status ≠ success  → Camera disabled (no download)
status = success  → idle → generating → success PNG
                              ↘ failure PNG + toast (capture error only)
```

### Interface / data

- Input: `UsePortfolioResult` (same as live card).
- Output: `cryptita-builder-{slug}.png` at 1080×1350.
- No Move schema change.
- No new image assets for marble or keychain.

### Security / policy

- Remote `photo_url` still needs CORS-safe capture.
- Do not invent sample builder data in the PNG.

---

## NON-GOALS

- Keychain, merch fulfillment, print shop.
- Photoreal 3D / perspective cameras.
- Marble photo files.
- Changing ISSUED storage or adding date normalization.
- Redesigning the on-page card or capturing MoltenMetal.

---

## OPEN QUESTIONS

None blocking. ISSUED format question is closed: keep the field; print the chain string.

---

## HANDOFF

Ready for implementation in `BuilderCardExport` + `card-photo-export.css` + Camera disable wiring. Update `03` §4.8, `05` §14.5, `07` Camera rows, `08` Camera checkboxes to match this contract.
