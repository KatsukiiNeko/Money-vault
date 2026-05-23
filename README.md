# 🔐 Money Vault

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?logo=pwa&logoColor=white&style=for-the-badge)
![Encryption](https://img.shields.io/badge/AES--GCM--256-Encrypted-00A86B?logo=letsencrypt&logoColor=white&style=for-the-badge)
![PBKDF2](https://img.shields.io/badge/PBKDF2-600K%20Iterations-FF6B4A?style=for-the-badge)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB%20%2B%20Dexie-FF6B4A?style=for-the-badge)
![EWMA](https://img.shields.io/badge/Forecast-EWMA%20%2B%20IQR-4169E1?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

---

## 🚀 Overview

A **secure, offline-first personal finance vault** built as a **Progressive Web App** with **zero-knowledge encryption**, **zero external network calls**, and **zero tracking**.

All financial data is encrypted client-side with AES-GCM-256. Keys are derived from your password using PBKDF2 with 600,000 iterations and SHA-384. Nothing ever leaves your device.

---

## ✨ Key Features

- 🔒 **End-to-end encryption** — AES-GCM-256, unique IV per transaction, authenticated encryption
- 🗂️ **Multi-account support** — separate encrypted vaults per account
- 💾 **Portable encrypted backups** — cross-device backup/restore with password-based encryption
- 📊 **Adaptive forecasting** — EWMA + IQR outlier filtering + fixed-bill detection
- 📱 **Installable PWA** — works offline like a native app
- 🌙 **Dark/Light theme** — system-aware with manual toggle
- 🛡️ **Zero network footprint** — `connect-src 'none'` CSP, no analytics, no telemetry

---

## 🛡️ Security Architecture (v5.0)

### Encryption Stack

| Layer | Implementation | Details |
|-------|---------------|---------|
| **Key Derivation** | PBKDF2-SHA384 | 600,000 iterations (OWASP 2023+) |
| **Symmetric Cipher** | AES-GCM-256 | Authenticated encryption, unique 12-byte IV per operation |
| **Salt** | 16 bytes CSPRNG | Per-account, stored in IndexedDB |
| **Verification** | Encrypted known-plaintext | `MONEYVAULT_VERIFY_v1` token |
| **Session Keys** | In-memory only | Never persisted, cleared on lock/timeout |

### Brute-Force Protection

| Mechanism | Implementation |
|-----------|---------------|
| **Exponential lockout** | 5 attempts = 30s, 10 = 2min, 15 = 5min, 20+ = 10min |
| **Dual persistence** | Lockout state in both localStorage and IndexedDB |
| **Cumulative tracking** | Attempts survive page refresh and IndexedDB wipe |
| **Password change cooldown** | 30s after 3 failed attempts |
| **Session timeout** | 15-minute inactivity auto-lock |

### Backup Restore Protection (v5.0)

| Mechanism | Implementation |
|-----------|---------------|
| **Triple-store lockout** | IndexedDB + localStorage + sessionStorage cross-validated |
| **Backup-file fingerprinting** | SHA-256 fingerprint binds lockout to specific backup file |
| **Escalating PBKDF2 cost** | Iterations increase per failure tier (2x → 50x) |
| **Proof-of-work gate** | SHA-256 PoW challenge after 10+ failed attempts (5–60s forced computation) |
| **Session hard cap** | 20 attempts per browser tab, stored in sessionStorage |
| **Per-backup isolation** | Different backup files have independent lockout counters |

| Failure Tier | Lockout | PBKDF2 Multiplier | Effective Iterations |
|-------------|---------|-------------------|---------------------|
| 0–4 | None | 1x | 600K |
| 5 | 30s | 2x | 1.2M |
| 8 | 2min | 5x | 3M |
| 12 | 5min | 10x | 6M |
| 16 | 10min | 20x | 12M |
| 20+ | 30min | 50x | 30M |

### Backup Security

| Format | Encryption | Portable | Use Case |
|--------|-----------|----------|----------|
| **v2 Quick** | Session key (AES-GCM) | No | Same device, same password |
| **v3 Secure** | Password-derived key (PBKDF2 600K + AES-GCM) | Yes | Cross-device transfer |

Secure backups encrypt raw transaction data with a fresh salt and user-supplied password. Backup files never contain your account password.

### Deployment Hardening

| Header | Value |
|--------|-------|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; connect-src 'none'; frame-ancestors 'none'` |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |

### Build Security

- Source maps disabled in production
- Console/debugger statements stripped via Terser
- Content-hashed filenames for cache busting
- No external dependencies beyond React and Dexie

---

## 🔒 Privacy

Money Vault is built on a **zero-knowledge, zero-network** architecture:

| Privacy Guarantee | How |
|---|---|
| **No network calls** | CSP `connect-src 'none'` — the browser physically cannot make outbound requests |
| **No analytics** | No Google Analytics, no Mixpanel, no Sentry, no tracking pixels |
| **No telemetry** | No phone-home, no crash reports, no usage data collection |
| **No cookies** | Zero cookies used — all state is in IndexedDB and localStorage |
| **No external scripts** | No CDNs, no Google Fonts loaded at runtime — fully self-contained |
| **No server** | All data processing happens on your device — there is no backend |
| **No account creation** | No email, no phone number, no sign-up — just set a password and go |
| **No data export** | Your data never leaves your browser unless you explicitly export a backup |
| **Encrypted at rest** | Every transaction is AES-256-GCM encrypted in IndexedDB |
| **Session auto-lock** | Keys are wiped from memory after 15 minutes of inactivity |

Your financial data exists **only on your device**. If you lose access, there is no recovery server — your backup file is the only way to restore.

---

## 📈 Adaptive Forecasting Engine

Three lightweight statistical tools work together in **O(n) time**:

| Layer | Technique | Purpose |
|-------|-----------|---------|
| **Outlier Removal** | IQR (1.5x interquartile range) | Filters large one-off expenses |
| **Spending Rate** | EWMA (alpha = 0.3) | Recency-biased moving average |
| **Fixed Bills** | Historical median | Projects unpaid recurring obligations |

No ML. No external libraries. Just math that runs in microseconds.

---

## ⚙️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 19.2.6 |
| Build Tool | Vite | 8.0.13 |
| Database | Dexie.js (IndexedDB) | 4.4.2 |
| Encryption | Web Crypto API | Native |
| Styling | CSS3 + Custom Properties | Native |
| PWA | Service Worker + Manifest | Native |
| Forecasting | EWMA + IQR | Custom |
| Dependencies | 3 runtime (react, react-dom, dexie) | Minimal |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AccountSelector.jsx    # Multi-account creation/selection/deletion
│   ├── BackupRestore.jsx      # Encrypted backup/restore with lockout integration
│   ├── ConfirmDialog.jsx      # Confirmation modal
│   ├── CurrencyToggle.jsx     # Currency toggle
│   ├── Dashboard.jsx          # Main dashboard with balance, form, history, forecast
│   ├── Forecast.jsx           # Monthly forecast display
│   ├── History.jsx            # Transaction history with delete
│   ├── LanguageToggle.jsx     # Language toggle
│   ├── LockScreen.jsx         # PIN entry with exponential lockout
│   ├── OnboardingOverlay.jsx  # First-use guidance
│   ├── PasswordManager.jsx    # Change password with full re-encryption
│   ├── SettingsPanel.jsx      # Settings drawer
│   ├── ThemeToggle.jsx        # Dark/light toggle
│   └── TransactionForm.jsx    # Add transaction form
├── context/
│   ├── CurrencyContext.jsx    # Currency state with localStorage
│   ├── LanguageContext.jsx    # i18n with localStorage
│   └── ThemeContext.jsx       # Theme state with localStorage
├── crypto/
│   └── crypto.js              # All encryption, key derivation, session management
├── db/
│   └── db.js                  # Dexie schema with migrations
├── i18n/
│   └── translations.js        # EN/VI translation strings
├── utils/
│   ├── forecast.js            # EWMA + IQR forecasting engine
│   └── lockout.js             # Triple-store anti-brute-force system
├── App.jsx                    # Root component with session timeout
├── index.css                  # Full application stylesheet
└── main.jsx                   # Entry point, SW registration, context providers
```

---

## ⚡ Getting Started

```bash
# Clone
git clone https://github.com/your-username/money-vault.git
cd money-vault

# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Preview
npm run preview
```

---

## 🎯 Roadmap

- [x] Multi-account support
- [x] Encrypted backup files
- [x] Cross-device backup/restore
- [x] PBKDF2 iteration upgrade (200K to 600K)
- [x] Exponential lockout with dual persistence
- [x] Triple-store backup restore lockout
- [x] Escalating PBKDF2 cost + proof-of-work gate
- [x] Account reset confirmation
- [x] EN/VI bilingual support
- [x] Dark/Light theme
- [x] USD/VND currency
- [ ] CSV export/import
- [ ] Budget goals and alerts
- [ ] Charts and spending analytics
- [ ] Recurring transaction automation
- [ ] Biometric unlock (WebAuthn)

---

## 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome.

```bash
git checkout -b feature/amazing-feature
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## 📜 License

MIT License. See `LICENSE` for details.

---

## 📄 Copyright

© 2026 Katsukii Neko. All rights reserved.

---

<div align="center">

### 🔒 Privacy First • 📴 Offline First • 🔐 User First

*Your money. Your device. Your control.*
> *Design. Code. Experience.*
</div>
