# 💰 Money Vault

A beautiful, offline-first personal finance tracker PWA with bank-level encryption, multi-language support, and seamless expense tracking.

## ✨ Features

- 🔒 **Military-Grade Security** - AES-256-GCM encryption with PBKDF2 key derivation
- 🌍 **Multi-Language** - English and Vietnamese (Tiếng Việt) support
- 💱 **Multi-Currency** - USD and VND with real-time formatting
- 📱 **PWA Ready** - Works offline, installable on any device
- 🎨 **Beautiful UI** - Dark theme with smooth animations
- 📊 **Smart Forecasting** - 30-day financial projections with visual charts
- 🔐 **Data Protection** - All data encrypted at rest in IndexedDB
- 📤 **Secure Backup** - Encrypted backup/restore with password protection and anti-brute-force lockout
- ⚡ **Lightning Fast** - Zero backend, instant local processing

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite 8
- **Styling**: Vanilla CSS (custom properties + animations)
- **Storage**: IndexedDB via Dexie.js 4
- **Encryption**: Web Crypto API (AES-256-GCM + PBKDF2-SHA384)
- **Deployment**: Static hosting (Cloudflare Pages / Vercel compatible)
- **PWA**: Service Worker + Web App Manifest

## 📦 Installation

```bash
git clone https://github.com/katsukii/money-vault.git
cd money-vault
npm install
npm run dev
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🏗️ Project Structure

```
money-vault/
├── public/
│   ├── icons/          # PWA icons
│   ├── _headers        # Security headers
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service Worker
├── src/
│   ├── components/     # React components
│   │   ├── AccountSelector.jsx
│   │   ├── BackupRestore.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── CurrencyToggle.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Forecast.jsx
│   │   ├── History.jsx
│   │   ├── LanguageToggle.jsx
│   │   ├── LockScreen.jsx
│   │   ├── OnboardingOverlay.jsx
│   │   ├── PasswordManager.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── TransactionForm.jsx
│   ├── context/        # React Context providers
│   │   ├── CurrencyContext.jsx
│   │   ├── LanguageContext.jsx
│   │   └── ThemeContext.jsx
│   ├── crypto/         # Encryption utilities
│   │   └── crypto.js
│   ├── db/             # Database layer
│   │   └── db.js
│   ├── i18n/           # Translations
│   │   └── translations.js
│   ├── utils/          # Utility functions
│   │   ├── forecast.js
│   │   └── lockout.js
│   ├── App.jsx         # Main app component
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🔐 Security

- **AES-256-GCM** encryption for all financial data
- **PBKDF2-SHA384** with 600,000 iterations for key derivation
- **15-minute session timeout** with activity tracking
- **Exponential lockout** after failed attempts (30s → 2min → 5min → 10min)
- **Triple-store lockout** for backup restore (IndexedDB + localStorage + sessionStorage)
- **Escalating PBKDF2 cost** after failed restore attempts (up to 100x iterations)
- **SHA-256 proof-of-work gate** after 10+ failed restore attempts
- **CSP headers** with `connect-src 'none'` (zero network calls)
- **No data leaves your device** - fully offline-first

## 🌐 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Full support |
| Tiếng Việt | `vi` | ✅ Full support |

## 💵 Supported Currencies

| Currency | Code | Format |
|----------|------|--------|
| US Dollar | `USD` | $1,234.56 |
| Vietnamese Dong | `VND` | 1,234,567 VND |

## 📄 License

MIT License - © Katsukii Neko. All rights reserved.
