![Cryptita Plays — Builder Workshop banner](docs/readme/01-banner.png)

# Cryptita Plays — Builder Workshop

**A hands-on Web3 workshop by Cryptita Plays**

Publish a Sui Move `BuilderCard` · Read it from a Vite/React site · Deploy on Mainnet

<table align="center">
  <tr>
    <td align="center" bgcolor="#111318">
      <br />
      <p><strong>Educational partners</strong></p>
      <table align="center">
        <tr>
          <td align="center" valign="middle">
            <img src="web/public/assets/icon/B4Her%20Logo.svg" alt="B4Her" height="28" />
          </td>
          <td align="center" valign="middle">
            <img src="web/public/assets/icon/b4y%20Logo.svg" alt="B4Y" height="28" />
          </td>
        </tr>
      </table>
      <p><strong>Community partners</strong></p>
      <table align="center">
        <tr>
          <td align="center" valign="middle">
            <a href="https://www.facebook.com/awssbg">
              <img src="web/public/assets/icon/aws-uphsl.svg" alt="AWS UPHSL" height="32" />
            </a>
          </td>
          <td align="center" valign="middle">
            <a href="https://www.facebook.com/DEVCONLAGUNA">
              <img src="web/public/assets/icon/devcon-laguna.svg" alt="DEVCON Laguna" height="32" />
            </a>
          </td>
          <td align="center" valign="middle">
            <a href="https://www.facebook.com/grantix.global">
              <img src="web/public/assets/icon/grantix.svg" alt="grantix" height="32" />
            </a>
          </td>
          <td align="center" valign="middle">
            <a href="https://www.facebook.com/kamiyonstudio">
              <img src="web/public/assets/icon/kamiyon.svg" alt="Kamiyon Studio" height="32" />
            </a>
          </td>
        </tr>
      </table>
      <br />
    </td>
  </tr>
</table>

---

Ready to move from learning Web3 concepts to actually building and deploying on-chain? This repo is your workshop companion: you'll set up a development environment, publish a smart contract, connect a website to on-chain data, and deploy your application.

It is designed as a practical continuation for students and builders who have previously joined **Base Build** and **ChainTalk**.

This workshop project pairs a **Sui Move** `BuilderCard` **package** with a **read-only Vite/React site**.

You publish and create your card with the **Sui CLI**, then set one object ID so the website can read on-chain profile data over **Sui GraphQL**.

There is **no browser wallet**, **no create form**, and **no on-page transaction signing**. Writes happen in the terminal only.

Screenshots in this guide are numbered to match the section they belong to (for example **Figure 1.1** sits under Step 1).

---



## Contents

1. [Essential resources](#essential-resources)
2. [What you build](#what-you-build)
3. [Prerequisites](#prerequisites)
4. [Repository layout](#repository-layout)
5. [Step-by-step workshop path](#step-by-step-workshop-path)
  - [Star and fork on GitHub](#star-and-fork-on-github)
  - [Step 1 — Clone, install, get Mainnet SUI](#step-1--clone-your-fork-open-vs-code-install-frontend-get-mainnet-sui)
  - [Step 2 — Replace your profile photo](#step-2--replace-your-profile-photo)
  - [Step 3 — Run the site locally](#step-3--run-the-site-locally-empty-card-is-ok)
  - [Step 4 — Deploy the website](#step-4--deploy-the-website-and-copy-your-url)
  - [Step 5 — Build and test the Move package](#step-5--build-and-test-the-move-package)
  - [Step 6 — Publish the package on Mainnet](#step-6--publish-the-package-on-mainnet)
  - [Step 7 — Create your BuilderCard](#step-7--create-your-buildercard)
  - [Step 8 — Point the frontend at your object](#step-8--point-the-frontend-at-your-object)
  - [Step 9 — Rebuild and verify](#step-9--rebuild-and-verify)
  - [Step 10 — Optional reset](#step-10--optional-replace-or-reset-the-displayed-card)
6. [Package ID vs Object ID](#package-id-vs-object-id)
7. [Environment variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)
9. [Optional Testnet practice](#optional-testnet-practice)
10. [License](#license)

---



## Essential resources


| Resource                  | Link / path                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Node.js LTS               | [https://nodejs.org/](https://nodejs.org/)                                                                                           |
| Sui CLI install           | [https://docs.sui.io/guides/developer/getting-started/sui-install](https://docs.sui.io/guides/developer/getting-started/sui-install) |
| Suiscan (Mainnet)         | [https://suiscan.xyz/mainnet](https://suiscan.xyz/mainnet)                                                                           |
| Builder Registry (shared) | [https://github.com/Cryptita-Plays/cryptita-builder-registry](https://github.com/Cryptita-Plays/cryptita-builder-registry)           |
| Upstream workshop repo    | [https://github.com/owenlim225/CRYPTITAPLAYS_BuilderWorkshop2026](https://github.com/owenlim225/CRYPTITAPLAYS_BuilderWorkshop2026)   |
| QR code generator         | [https://www.qr-code-generator.com/solutions/text-qr-code/](https://www.qr-code-generator.com/solutions/text-qr-code/)               |
| This repo layout          | `move/` (contract), `web/` (frontend), `spec/` (detailed specs)                                                                      |
| Profile photo file        | `web/public/assets/profile.png`                                                                                                      |
| Frontend env template     | `web/.env.example`                                                                                                                   |




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
npm run lint
npm run build
npm run preview
```

---



## What you build

1. **Move package** (`move/`) — `builder_card` module with an owned `BuilderCard`, Display metadata, and `create_builder_card` (builder number claimed automatically from the shared registry).
2. **Static website** (`web/`) — single-viewport homepage that reads one on-chain object, shows your profile photo from `web/public/assets/profile.png`, and exports a card PNG client-side.



### How data flows

```text
1. Replace profile.png
2. Deploy website  →  get HTTPS URL
3. Publish Move package  →  Package ID
4. Call create_builder_card  →  Object ID  (+ auto builder_no from registry)
5. Set VITE_PORTFOLIO_OBJECT_ID in web/.env
6. Rebuild / redeploy site  →  card fills from chain; status dot turns green
```

---



## Prerequisites

1. Install [Node.js LTS](https://nodejs.org/).
2. Install [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) (Move edition 2024).
3. Create a **Mainnet** Sui address and obtain SUI from workshop facilitators (see workshop path below).
4. Have a GitHub account and (for hosting) a Vercel account.



### Verify Sui CLI

```bash
sui --version
```

![Sui CLI version output](docs/readme/02-sui-version.png)

**Figure P.1** — Terminal output of `sui --version`. Expected: your installed version string (for example `sui 1.78.0`).

### Switch to Mainnet

```bash
sui client switch --env mainnet
```

If `mainnet` is missing:

```bash
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443
sui client switch --env mainnet
```

Do **not** use Testnet for the workshop production path. Optional Testnet practice is listed at the end of this guide.

---



## Repository layout

```text
docs/     Contains image files used for this README
move/     Sui Move package (builder_card)
web/      Vite + React read-only frontend
spec/     Workshop specifications (aligned with this repo)
```

---



## Step-by-step workshop path

Follow these steps in order. Each screenshot is captioned so you can match your screen to the expected result.

---



### Star and fork on GitHub

1. Open the upstream repo: [https://github.com/owenlim225/CRYPTITAPLAYS_BuilderWorkshop2026](https://github.com/owenlim225/CRYPTITAPLAYS_BuilderWorkshop2026)
2. Click ⭐ **Star** on the upstream repo

![GitHub star on the upstream repo](docs/readme/03-github-star.png)

**Figure 0.1** — Star the upstream workshop repository on GitHub.

1. Click **Fork**.
  - **Owner:** your GitHub account
  - **Repository name:** `CRYPTITAPLAYS_BuilderWorkshop2026_LastName` (replace `LastName` with your surname, e.g. `CRYPTITAPLAYS_BuilderWorkshop2026_Lingao`)
  - Copy the **main** branch only
  - Click **Create fork**

![GitHub create fork form](docs/readme/04-github-fork.png)

**Figure 0.2** — Create-fork form with your account as owner, the required repo name, and the `main` branch selected.

---



### Step 1 — Clone your fork, open VS Code, install frontend, get Mainnet SUI

1. Open a terminal.
2. Clone **your fork** (not the upstream repo), then open it in VS Code:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/CRYPTITAPLAYS_BuilderWorkshop2026_LastName.git
cd CRYPTITAPLAYS_BuilderWorkshop2026_LastName
code .
```

VS Code should open the project:

![VS Code opened on the cloned workshop repo](docs/readme/05-vscode-opened.png)

**Figure 1.1** — Workshop repo opened in VS Code after cloning your fork.

1. In VS Code, open a new terminal with **Ctrl+Shift+backtick** (Terminal → New Terminal; backtick is the same key as `~`).
2. In the project terminal, install the frontend and copy the env file.

Git Bash / macOS / Linux:

```bash
cd web
npm install
cp .env.example .env
```

PowerShell:

```powershell
cd web
npm install
Copy-Item .env.example .env
```

![npm install and copied .env in VS Code](docs/readme/06-npm-install-env.png)

**Figure 1.2** — `npm install` finished and `web/.env` copied from `.env.example`.

Leave `VITE_PORTFOLIO_OBJECT_ID` empty for now. `web/.env.example` already sets `VITE_SUI_NETWORK=mainnet`.

1. Confirm you are on Mainnet:

```bash
sui client active-env
sui client switch --env mainnet
```

1. If you do not have an address yet:

```bash
sui client new-address ed25519
sui client active-address
```

1. Copy your address (starts with `0x`).
2. Open [https://www.qr-code-generator.com/solutions/text-qr-code/](https://www.qr-code-generator.com/solutions/text-qr-code/) and paste your address to generate a QR code.

![QR code generated from a Sui address](docs/readme/07-qr-code-address.png)

**Figure 1.3** — QR code generated from your Sui Mainnet address, ready to show a facilitator.

1. Show the QR code to a **technical facilitator** and ask for **Mainnet SUI** for gas. Do **not** use the Testnet faucet for workshop production.
2. Verify balance:

```bash
sui client balance
```

---



### Step 2 — Replace your profile photo

1. Replace `web/public/assets/profile.png` with your portrait.

![profile.png selected in the VS Code file tree](docs/readme/08-profile-file-tree.png)

**Figure 2.1** — `web/public/assets/profile.png` selected in the VS Code file tree. Keep this exact filename.

1. Keep the **exact filename** `profile.png`.
2. Prefer a square or portrait photo; it is cropped to the card frame.

---



### Step 3 — Run the site locally (empty card is OK)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Expected:

![Local site showing placeholder BuilderCard](docs/readme/09-localhost-placeholder.png)

**Figure 3.1** — Local site at `localhost:5173` with placeholder card fields and a grey status dot. Empty object ID is expected at this stage.

- Card shows placeholders (`—` / `Builder name`)
- Status dot next to BUILDER NO. is **grey**
- Photo still shows `profile.png` from local assets

---



### Step 4 — Deploy the website and copy your URL

Deploy `web/` first so you have a public HTTPS URL for the on-chain `website_url` argument.

**Vercel settings:**


| Setting                 | Value                                          |
| ----------------------- | ---------------------------------------------- |
| Root directory          | `web`                                          |
| Build command           | `npm run build`                                |
| Output directory        | `dist`                                         |
| Env (optional at first) | `VITE_SUI_NETWORK`, `VITE_PORTFOLIO_OBJECT_ID` |


1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Click **Continue with GitHub**.

![Vercel Continue with GitHub](docs/readme/10-vercel-continue-github.png)

**Figure 4.1** — Vercel new-project screen. Sign in with GitHub to import your fork.

1. **Import** your forked repo (`CRYPTITAPLAYS_BuilderWorkshop2026_LastName`).

![Vercel import forked repo](docs/readme/11-vercel-import-fork.png)

**Figure 4.2** — Import your forked workshop repository from the GitHub list.

1. Open **Root Directory**, select `web`, then **Continue**.

![Vercel root directory set to web](docs/readme/12-vercel-root-web.png)

**Figure 4.3** — Root Directory set to `web` so Vercel builds the frontend, not the repo root.

1. Click **Deploy**.
2. When deployment finishes, click **Continue to Dashboard**.

![Vercel deployment congratulations](docs/readme/13-vercel-congratulations.png)

**Figure 4.4** — First deployment succeeded. Continue to the project dashboard.

1. In the project sidebar, open **Settings → Environment Variables**.

![Vercel Environment Variables tab](docs/readme/14-vercel-env-tab.png)

**Figure 4.5** — Project Settings → Environment Variables tab.

1. Click **Add Environment Variable**, then **Import .env** and choose your local `web/.env` file. Click **Save**.

![Vercel Import .env](docs/readme/15-vercel-import-env.png)

**Figure 4.6** — Import `.env` from your local `web/.env` file, then save.

1. Confirm the keys include `VITE_SUI_NETWORK=mainnet`. Leave `VITE_PORTFOLIO_OBJECT_ID` empty until Step 8.

![Vercel environment variable keys](docs/readme/16-vercel-env-keys.png)

**Figure 4.7** — Confirm `VITE_SUI_NETWORK=mainnet`. Leave `VITE_PORTFOLIO_OBJECT_ID` empty until Step 8.

> **Warning:** Do not copy dummy placeholder values from the screenshot. Import your real `web/.env` from your machine.

1. After you save, click **Redeploy**.

![Vercel prompt to redeploy after env change](docs/readme/17-vercel-redeploy.png)

**Figure 4.8** — Redeploy prompt after saving environment variables. A rebuild is required so Vite inlines the new values.

1. Open **Deployments** and wait until the latest production build on `main` shows **Ready**.

![Vercel Deployments list with Ready production builds](docs/readme/18-vercel-deployments-ready.png)

**Figure 4.9** — Deployments list. Wait until the latest production build on `main` shows **Ready**.

1. Open that deployment and copy your site URL.

![Vercel deployment domains](docs/readme/19-vercel-copy-domain.png)

**Figure 4.10** — Deployment domains. Copy the HTTPS site URL — you need it as `website_url` in Step 7.

You need this for `create_builder_card` in Step 7.

---



### Step 5 — Build and test the Move package

Go back to VS Code.

Open a new terminal with **Ctrl+Shift+backtick** (Terminal → New Terminal).

![VS Code with an integrated terminal open](docs/readme/20-vscode-terminal.png)

**Figure 5.1** — New integrated terminal in VS Code, ready to build the Move package.

Then run:

```bash
cd move
sui move build
sui move test
```

![sui move build and test output](docs/readme/21-sui-move-build-test.png)

**Figure 5.2** — Successful `sui move build` and `sui move test` output. Fix any compile errors before publishing.

**Linux / macOS —** `Move.lock` **directory error**

If `sui move build` fails because `Move.lock` is a directory:

```bash
cd move
rm Move.lock
sui move build
```

---



### Step 6 — Publish the package on Mainnet

```bash
sui client switch --env mainnet   # make sure you're on mainnet
sui client active-address         # must be funded with Mainnet SUI
sui client publish
```

![sui client publish on Mainnet](docs/readme/22-sui-publish-mainnet.png)

**Figure 6.1** — `sui client publish` on Mainnet. Copy the **Package ID** from `Published Objects` in this output.

1. From the publish output, copy the **Package ID** (`Published Objects` / package digest).
2. Save it somewhere safe. You need it for `--package` in the next step.

---



### Step 7 — Create your BuilderCard

Pass the **shared registry object** first, then **12 strings** in this exact order:


| #   | Argument                                   | Example                                                      | You change?                     |
| --- | ------------------------------------------ | ------------------------------------------------------------ | ------------------------------- |
| 1   | `registry` (shared object ID)              | Mainnet ID below                                             | **No**                          |
| 2   | `builder_name`                             | `"Sherwin Limosnero"`                                        | **Yes**                         |
| 3   | `profession`                               | `"Developer/Designer"`                                       | **Yes**                         |
| 4   | `program`                                  | `"BSIT - GD"`                                                | **Yes**                         |
| 5   | `country`                                  | `"PH"`                                                       | **Yes**                         |
| 6   | `specialization`                           | `"Game Development"`                                         | **Yes**                         |
| 7   | `building_since`                           | `"2026"`                                                     | **Yes**                         |
| 8   | `focus`                                    | `"Kamiyon Studio"`                                           | **Yes**                         |
| 9   | `community`                                | `"Cryptita Plays"`                                           | **Yes**                         |
| 10  | `skills` (comma-separated)                 | `"Leadership, Management, Design, Development"`              | **Yes (3–4 max)**               |
| 11  | `issued`                                   | `"August 2026"`                                              | **No — use the workshop value** |
| 12  | `about` (on-chain only; not shown on site) | `"Cryptita Plays Workshop participant learning Sui Move."`   | **Yes**                         |
| 13  | `website_url` (no trailing slash)          | `"https://cryptita-plays-builder-workshop-eosin.vercel.app"` | **Yes — your Step 4 URL**       |


**Mainnet registry object ID (workshop production):**

`0x297cb610c0c47edc1e12008812f28cd8a1f35f95bb406d45f4b76fa9fda2e04c`

On create, the contract also stores:

- `builder_no` — claimed automatically from the registry (`u64`)
- `website_url` — shown as Suiscan / Display `link`
- `photo_url` — derived as `{website_url}/assets/profile.png` for explorers

Package `init` also creates **Display** metadata so Suiscan can show a human name, image, and site link.

Personalize only these **11 fields**: `builder_name`, `profession`, `program`, `country`, `specialization`, `building_since`, `focus`, `community`, `skills`, `about`, `website_url`. Copy the Mainnet registry ID and `issued` (`August 2026`) exactly as shown.

#### Bash / macOS / Git Bash

Replace `0xPACKAGE_ID` with your publish output. Personalize only the fields marked **Yes** in the table above.

```bash
sui client call \
  --package 0xe41de8498d06dc0b94a559b6ecbea90ee569921b273c33d1a32cddc49934478e \
  --module builder_card \
  --function create_builder_card \
  --args \
    0xPACKAGE_ID\
    "Sherwin Limosnero" \
    "Developer/Designer" \
    "BSIT - GD" \
    "PH" \
    "Game Development" \
    "2026" \
    "Kamiyon Studio" \
    "Cryptita Plays" \
    "Leadership, Management, Design, Development" \
    "August 2026" \
    "Cryptita Plays Workshop participant learning Sui Move." \
    "https://cryptita-plays-builder-workshop-eosin.vercel.app" \
  --gas-budget 10000000
```



#### PowerShell

```powershell
sui client call `
  --package 0xe41de8498d06dc0b94a559b6ecbea90ee569921b273c33d1a32cddc49934478e`
  --module builder_card `
  --function create_builder_card `
  --args `
    0xPACKAGE_ID`
    "Sherwin Limosnero" `
    "Developer/Designer" `
    "BSIT - GD" `
    "PH" `
    "Game Development" `
    "2026" `
    "Kamiyon Studio" `
    "Cryptita Plays" `
    "Leadership, Management, Design, Development" `
    "August 2026" `
    "Cryptita Plays Workshop participant learning Sui Move." `
    "https://cryptita-plays-builder-workshop-eosin.vercel.app" `
  --gas-budget 10000000
```

1. From the call output, copy the **Created Object ID** of the new `BuilderCard`.
2. Open Suiscan to verify fields and link:
  - Mainnet: `https://suiscan.xyz/mainnet/object/0xYOUR_OBJECT_ID/fields`

![Suiscan BuilderCard object Fields tab](docs/readme/23-suiscan-object-fields.png)

**Figure 7.1** — Suiscan object Fields tab on Mainnet. Confirm your BuilderCard values and the website / image links.

---



### Step 8 — Point the frontend at your object

Edit `web/.env`:

```env
VITE_PORTFOLIO_OBJECT_ID=0xYOUR_OBJECT_ID
VITE_SUI_NETWORK=mainnet
VITE_CHAIN=sui
```

Update the same values in Vercel **Environment Variables**, then **Redeploy**.

---



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

---



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


| ID                     | When you get it               | Used for                                   |
| ---------------------- | ----------------------------- | ------------------------------------------ |
| **Package ID**         | `sui client publish`          | CLI `--package` for `create_builder_card`  |
| **Registry object ID** | Shared Cryptita registry      | First CLI arg (`&mut BuilderRegistry`)     |
| **Object ID**          | `create_builder_card` success | `VITE_PORTFOLIO_OBJECT_ID` in the frontend |


The website reads the **created BuilderCard object**, not the package.

---



## Environment variables


| Variable                   | Purpose                                                                        |
| -------------------------- | ------------------------------------------------------------------------------ |
| `VITE_PORTFOLIO_OBJECT_ID` | Created BuilderCard object ID. Empty = placeholder card + grey status dot      |
| `VITE_SUI_NETWORK`         | `mainnet` for workshop production — selects GraphQL endpoint and NETWORK label |
| `VITE_CHAIN`               | Visual chain theme (default `sui`)                                             |


Vite inlines `VITE_*` at **build time**. After any `.env` change, rebuild and redeploy.

---



## Troubleshooting



### Sui CLI / gas


| Error / symptom           | Likely cause                                 | Fix                                                              |
| ------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `sui: command not found`  | CLI not installed or not on PATH             | Reinstall from official docs; reopen terminal                    |
| No gas / cannot find coin | SUI is in address balance, not a coin object | Fund address; follow current Sui docs to convert balance → coin  |
| Wrong network publish     | Active env is not mainnet                    | `sui client switch --env mainnet` then republish                 |
| Insufficient gas budget   | Budget too low                               | Raise `--gas-budget` (e.g. `100000000` publish, `10000000` call) |




### Publish / create


| Error / symptom                             | Likely cause                                               | Fix                                                                  |
| ------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| Compile error in Move                       | Dependency / syntax issue                                  | Run `sui move build` and fix reported lines first                    |
| `Move.lock` is a directory (Linux/macOS)    | Corrupt lock path                                          | `cd move && rm Move.lock && sui move build`                          |
| `create_builder_card` arity / type mismatch | Wrong number or order of args                              | Use registry object + 12 strings; do **not** pass `builder_no`       |
| Registry object not found / wrong type      | Wrong network registry ID                                  | Use the Mainnet ID on mainnet (see Step 7)                           |
| Object created but Suiscan shows no link    | Forgot `website_url` or used trailing slash inconsistently | Pass clean HTTPS URL with no trailing slash; recreate card if needed |
| Old object missing `website_url`            | Object created with previous schema                        | Republish package and create a **new** card                          |




### Frontend


| Error / symptom                     | Likely cause                                    | Fix                                                                |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| Card stays empty / grey dot         | `VITE_PORTFOLIO_OBJECT_ID` empty or not rebuilt | Set object ID in `.env`, then restart `npm run dev` or rebuild     |
| Card error / “object not found”     | Wrong ID, wrong network, or typo                | Match `VITE_SUI_NETWORK=mainnet` to where the object exists        |
| Env change ignored                  | Vite caches build-time env                      | Stop/restart `npm run dev`; for production, rebuild + redeploy     |
| Photo missing                       | File not at `web/public/assets/profile.png`     | Replace that exact path/filename and redeploy                      |
| Photo OK locally, broken on Suiscan | Site not deployed or wrong `website_url`        | Deploy site first; pass that URL as last create arg                |
| Dot green but fields empty/error    | Object ID set but fetch failed                  | Check network, object type ends with `::builder_card::BuilderCard` |




### Reset / handoff


| Goal                                | What to do                                                         |
| ----------------------------------- | ------------------------------------------------------------------ |
| Clear personal data from local site | Empty `VITE_PORTFOLIO_OBJECT_ID` in `web/.env`, restart dev server |
| Prepare repo for next cohort        | Keep `.env.example` empty for that value; never commit `.env`      |
| Clear hosted site                   | Clear Vercel env vars → Redeploy                                   |
| Delete on-chain data                | Not possible — create a new object and point the site at it        |


---



## Optional Testnet practice

Use this only if you want extra practice **before** Mainnet workshop production:

1. `sui client switch --env testnet` and fund via [https://faucet.sui.io/](https://faucet.sui.io/)
2. Practice publish + create on Testnet.
3. Testnet registry ID: `0x2995095d1e6fda52afde3649a74be5fc2b1dc8b57bfc9f60d5ff708afdcdc923`
4. Set `VITE_SUI_NETWORK=testnet` so the frontend GraphQL client matches.
5. Suiscan Testnet: [https://suiscan.xyz/testnet](https://suiscan.xyz/testnet)
6. When ready for workshop production, switch to Mainnet, republish, recreate, set `VITE_SUI_NETWORK=mainnet`, update env, and redeploy.

---



## License

Workshop educational use. Cryptita Plays branding and partner assets belong to their respective owners.