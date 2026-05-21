# Money Vault

<div align="center">

# 🔐 Money Vault

**A secure, offline-first personal finance vault built as a Progressive Web App (PWA).**
Private by design. Encrypted locally. No cloud tracking. No data collection.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?style=for-the-badge\&logo=pwa\&logoColor=white)
![Encryption](https://img.shields.io/badge/Encryption-AES--GCM-success?style=for-the-badge\&logo=letsencrypt\&logoColor=white)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-orange?style=for-the-badge)
![EWMA](https://img.shields.io/badge/Forecast-EWMA%20%2B%20IQR-blue?style=for-the-badge)
</div>

---

## ✨ Features

* 🔒 **End-to-End Encryption**
  All financial data is encrypted locally using the Web Crypto API with AES-GCM.

* 📱 **Progressive Web App**
  Fully installable on desktop and mobile devices with offline support.

* 📊 **Adaptive Financial Forecasting**
  Predicts month-end balance using an EWMA-based algorithm with IQR outlier filtering and fixed-bill detection — adapts to spending habit changes in real time, ignores one-off spikes, and projects pending recurring bills from historical median.

* 📴 **Offline First**
  Works without internet access after installation.

* 🔐 **Zero-Knowledge Privacy**
  Your data never leaves your device.

* 🌙 **Modern Dark UI**
  Minimal, clean interface optimized for focus and readability.

* ⚡ **Fast & Lightweight**
  Built with Vite and optimized for instant loading.

* 🗂️ **Local Database Storage**
  Uses IndexedDB through Dexie.js for structured local persistence.

---

## 📈 Adaptive Forecasting Engine

The forecast goes beyond a simple daily average. Three lightweight statistical tools work together in O(n) time, computed fresh on every dashboard load:

| Layer | Technique | Purpose |
|-------|-----------|---------|
| **Outlier Removal** | IQR (1.5× interquartile range) | Filters large one-off expenses (furniture, emergency repairs) from daily spending totals |
| **Spending Rate** | EWMA (α = 0.3) | Recency-biased moving average that adapts to habit changes within 3–5 days |
| **Fixed Bills** | Historical median | Detects unpaid recurring obligations (utilities, subscriptions) and projects them from past transactions |

**How it works:**
1. Variable expenses are bucketed by day; zero-spend days are excluded before outlier filtering
2. IQR removes statistical outliers from active-day totals
3. EWMA computes a weighted daily rate — recent days dominate, old habits fade
4. Fixed categories are checked against current month; unpaid ones are projected at their historical median
5. Projected balance = current balance − (EWMA daily rate × remaining days) − pending fixed bills

No ML. No external libraries. Just math that runs in microseconds.

---

## 🛡️ Security

Money Vault is designed with privacy and security as core principles.

| Feature            | Description                                       |
| ------------------ | ------------------------------------------------- |
| PBKDF2             | 200,000 iterations for secure key derivation      |
| AES-GCM            | Modern authenticated encryption                   |
| Local-Only Storage | No cloud sync or external database                |
| Client-Side Crypto | Encryption/decryption happens entirely in-browser |
| Zero Tracking      | No analytics, telemetry, or third-party trackers  |

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/money-vault.git
cd money-vault
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build Production Version

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```bash
money-vault/
├── public/                 # Static assets + PWA manifest
├── src/
│   ├── components/         # UI components
│   ├── crypto/             # Encryption utilities
│   ├── db/                 # IndexedDB layer (Dexie.js)
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styling
│   ├── utils/              # Forecasting + helpers
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🧱 Tech Stack

| Category   | Technology                      |
| ---------- | ------------------------------- |
| Frontend   | React + Vite                    |
| Database   | Dexie.js + IndexedDB            |
| Encryption | Web Crypto API                  |
| Styling    | CSS3 / Modern Layout            |
| PWA        | Service Workers + Manifest      |
| Deployment | GitHub Pages / Cloudflare Pages |

---

## 📦 Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint project
npm run lint
```

---

## 🌍 Deployment

### GitHub Pages

1. Push project to GitHub
2. Open repository settings
3. Enable GitHub Pages
4. Select:

   * `gh-pages` branch
     or
   * `/docs` folder

```bash
npm run build
```

3. Set output directory:

```bash
dist
```

---

## 🗺️ Roadmap

* [ ] Multi-wallet support
* [ ] CSV export/import
* [ ] Budget goals
* [ ] Charts & analytics
* [ ] Recurring transactions
* [ ] Biometric unlock support
* [ ] Optional encrypted backup files

---

## 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome.

```bash
# Fork repository
# Create feature branch
git checkout -b feature/amazing-feature
```

---

## 📄 License

Licensed under the MIT License.
See the `LICENSE` file for more information.

---

<div align="center">

### 🔐 Privacy First • Offline First • User First

</div>
