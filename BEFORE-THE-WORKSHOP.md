# Before the workshop – setup instructions

Please complete this **before** the workshop, so we can start working right away. It takes about **30–45 minutes**, most of it waiting for downloads.
You need a laptop where you can install software (admin rights). If something does not work, send the output of `npm run doctor` to the instructor **at least 2 days before** the workshop.

## 1. Install the tools

| Tool | Version | Where to get it | Check with |
|------|---------|-----------------|------------|
| **Node.js** | 24 LTS (minimum 22.13) | https://nodejs.org → "LTS" | `node --version` |
| **Git** | any recent | https://git-scm.com/downloads | `git --version` |
| **VS Code** | any recent | https://code.visualstudio.com | – |
| **k6** | any recent | see below | `k6 version` |
| **Docker Desktop** | *optional* (exercise 22) | https://www.docker.com/products/docker-desktop | `docker --version` |

**k6:**
- Windows: `winget install k6 --source winget` (or `choco install k6`)
- macOS: `brew install k6`
- Linux and other options: https://grafana.com/docs/k6/latest/set-up/install-k6/

**VS Code extensions** (Extensions panel, search by name):
- **Playwright Test for VSCode** (by Microsoft)
- **ESLint** (by Microsoft)

**GitHub account:** create one at https://github.com if you do not have one yet.

After installing, **close and reopen your terminal** so the new commands are found.

## 2. Set up Git (once)

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
Use the same email as in your GitHub account.

## 3. Get your own copy of the repository

1. Open the workshop repository: **`<TEMPLATE_REPO_URL>`**
2. Click **Use this template → Create a new repository**.
3. Owner: your account. Name: e.g. `qa-automation-workshop`. Visibility: **Public** (needed for free GitHub Pages in exercise 21).
4. In your new repository, open the **Actions** tab and enable workflows if GitHub asks.
5. Clone it (green **Code** button → copy the HTTPS URL):
   ```bash
   git clone https://github.com/<your-login>/qa-automation-workshop.git
   cd qa-automation-workshop
   ```

## 4. Install the project

```bash
npm install
npx playwright install
npm run doctor
```

- On **Linux**, use `npx playwright install --with-deps` (it may ask for your password to install system libraries).
- `npx playwright install` downloads the browsers (a few hundred MB).

`npm run doctor` must end with **"All required checks passed"**. Warnings (⚠️) for k6 or Docker are fine for now, but please install k6 before the workshop.

## 5. Quick test drive

```bash
npm test
code .
```
In VS Code, open the **Testing** panel (flask icon). You should see the tests and be able to run one with the ▶ button.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `node` / `git` / `k6` not found | Close and reopen the terminal (or restart the computer) after installing. |
| `npm install` fails behind a company proxy | `npm config set proxy http://proxy:port` and `npm config set https-proxy http://proxy:port`, or try another network (e.g. phone hotspot). |
| `npx playwright install` fails behind a proxy | Set `HTTPS_PROXY=http://proxy:port` before the command. |
| Windows PowerShell: "running scripts is disabled" | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Port 3100 is in use | Close the program that uses it, or tell the instructor. |
| `ExperimentalWarning: SQLite is an experimental feature` | Harmless, you can ignore it. |
| Apple Silicon (M1–M4) | Everything works natively, no extra steps. |

## What to bring
- Your laptop with everything above installed, and a charger.
- Your GitHub login (you will push code during the workshop).

See you at the workshop! 🎭
