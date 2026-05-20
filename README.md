# Money Vault

**Money Vault** is a secure, offline-first personal finance tracker built as a Progressive Web App (PWA). It keeps your financial data private and encrypted on your device, with no external data transmission.

## Features

- **🔒 End-to-End Encryption**: All financial data is encrypted locally using Web Crypto API (AES-GCM)
- **📱 Progressive Web App**: Installable on mobile devices, works completely offline
- **📊 Financial Forecasting**: Projects month-end balance based on spending patterns
- **🔐 Zero-Knowledge Security**: Your data never leaves your device
- **🌙 Dark Theme Interface**: Modern, minimal design optimized for usability

## Security

- **PBKDF2 Key Derivation**: 200,000 iterations for strong password protection
- **AES-GCM Encryption**: Military-grade encryption for all stored data
- **Local-Only Storage**: Data never transmitted to external servers
- **Client-Side Only**: All encryption/decryption happens in your browser

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/money-vault.git
   cd money-vault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
money-vault/
├── src/
│   ├── components/     # React components (LockScreen, Dashboard, etc.)
│   ├── crypto/        # Encryption/decryption utilities
│   ├── db/            # Database layer (Dexie.js)
│   └── utils/         # Utility functions (forecasting)
├── public/            # Static assets and PWA manifest
└── package.json      # Project configuration
```

## Tech Stack

- **Frontend**: React + Vite
- **Database**: Dexie.js (IndexedDB wrapper)
- **Encryption**: Web Crypto API (PBKDF2 + AES-GCM)
- **Styling**: CSS3 with modern layout
- **Deployment**: Cloudflare Pages or GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist/`

### GitHub Pages
1. Push to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `/docs` folder or `gh-pages` branch

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Support

For support, please open an issue on the GitHub repository.