# 🔐 Money Vault

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?logo=pwa&logoColor=white&style=for-the-badge)
![Encryption](https://img.shields.io/badge/Encryption-AES--GCM-00A86B?logo=letsencrypt&logoColor=white&style=for-the-badge)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-FF6B4A?style=for-the-badge)
![EWMA](https://img.shields.io/badge/Forecast-EWMA%20%2B%20IQR-4169E1?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

---

## 🚀 Overview

A **secure, offline-first personal finance vault** built as a **Progressive Web App (PWA)** with **end-to-end encryption** and **zero external dependencies**.

This project demonstrates a privacy-centric frontend architecture with a focus on:

- 🔒 **Security-first design**
- 📴 **Offline functionality**
- 📊 **Smart financial forecasting**
- 🧹 **Zero tracking philosophy**

It serves as both a **personal finance tool** and an **experimental playground** for client-side encryption and PWA patterns.

---

## ✨ Key Features

* 🔒 **End-to-end encryption** — AES-GCM with PBKDF2 key derivation
* 📱 **Installable PWA** — works offline like a native app
* 📊 **Adaptive forecasting** — EWMA + IQR outlier filtering + fixed-bill detection
* 🗂️ **Local database** — IndexedDB via Dexie.js
* 🌙 **Dark UI** — minimal, clean, focus-driven interface
* ⚡ **Fast & lightweight** — optimized Vite build
* 🔐 **Zero-knowledge privacy** — your data never phones home

---

## 🧠 Architecture Highlights

- **Client-side encryption** — Web Crypto API, keys never transmitted
- **Offline-first architecture** — service workers + cache strategies
- **Modular forecasting engine** — pure math, no ML dependencies
- **Component-based UI** — reusable React components
- **Structured local persistence** — Dexie.js over IndexedDB

---

## 📁 Project Structure

```bash
money-vault/
│
├── index.html
├── LICENSE
├── README.md
├── package.json
├── vite.config.js
│
├── public/                 # Static assets + PWA manifest
│
├── src/
│   ├── components/         # UI components
│   ├── crypto/             # Encryption utilities
│   ├── db/                 # IndexedDB layer (Dexie.js)
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styling
│   └── utils/              # Forecasting + helpers
│   └── main.jsx
```

---

## 📈 Adaptive Forecasting Engine

The forecast goes beyond a simple daily average. Three lightweight statistical tools work together in **O(n) time**:

| Layer | Technique | Purpose |
|-------|-----------|---------|
| **Outlier Removal** | IQR (1.5× interquartile range) | Filters large one-off expenses |
| **Spending Rate** | EWMA (α = 0.3) | Recency-biased moving average |
| **Fixed Bills** | Historical median | Projects unpaid recurring obligations |

> 🧠 No ML. No external libraries. Just math that runs in microseconds.

---

## 🛡️ Security

| Feature | Description |
|---------|-------------|
| PBKDF2 | 200,000 iterations for secure key derivation |
| AES-GCM | Modern authenticated encryption |
| Local-Only Storage | No cloud sync or external database |
| Client-Side Crypto | Encryption/decryption in-browser only |
| Zero Tracking | No analytics, telemetry, or third parties |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/money-vault.git
cd money-vault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

---

## 🧪 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 + Vite 7 |
| Database | Dexie.js + IndexedDB |
| Encryption | Web Crypto API (AES-GCM, PBKDF2) |
| Styling | CSS3 / Modern Layout |
| PWA | Service Workers + Manifest |
| Forecasting | EWMA + IQR (pure math) |

---

## 🎯 Development Focus

This project explores:

- **Client-side encryption** patterns for sensitive data
- **Offline-first PWA** architecture
- **Statistical forecasting** without external APIs
- **Zero-tracking** privacy-first design
- **Local-first** data persistence strategies

---

## 📈 Roadmap

- [ ] Multi-wallet support
- [ ] CSV export/import
- [ ] Budget goals & alerts
- [ ] Charts & spending analytics
- [ ] Recurring transaction automation
- [ ] Biometric unlock (WebAuthn)
- [ ] Optional encrypted backup files

---

## 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📜 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

## 📄 Copyright

© 2026 Katsukii Neko. All rights reserved.

---

<div align="center">

### 🔒 Privacy First • 📴 Offline First • 🔐 User First

*Your money. Your device. Your control.*
> *Design. Code. Experience.*
</div>
