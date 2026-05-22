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
- 🌐 **EN/VI bilingual** — full English and Vietnamese support
- 💲 **USD/VND currency** — dual currency with live formatting
- 🌙 **Dark/Light theme** — system-aware with manual toggle
- 🛡️ **Zero network footprint** — `connect-src 'none'` CSP, no analytics, no telemetry

---

## 🛡️ Security Architecture (v4.0)

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
│   ├── BackupRestore.jsx      # Encrypted backup/restore with two modes
│   ├── CurrencyToggle.jsx     # USD/VND toggle
│   ├── Dashboard.jsx          # Main dashboard with balance, form, history, forecast
│   ├── Forecast.jsx           # Monthly forecast display
│   ├── History.jsx            # Transaction history with delete
│   ├── LanguageToggle.jsx     # EN/VI toggle
│   ├── LockScreen.jsx         # PIN entry with exponential lockout
│   ├── PasswordManager.jsx    # Change password with full re-encryption
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
│   └── forecast.js            # EWMA + IQR forecasting engine
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
