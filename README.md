# ZimVest - Send Money Home. Build Wealth Together.

ZimVest is a high-fidelity, interactive fintech platform designed for the Zimbabwean diaspora. It allows users to remit money and invest in a single transaction — supporting fractional shares, bonds, gold, and education funds on the ZSE & VFEX.

## Project Structure

- **presentation/**: Contains the interactive presentation webapp.
  - `index.html`: The main presentation deck (10 slides).
  - `styles.css`: Custom Spotify-inspired dark mode design system.
  - `app.js`: Interactive engine with auto-demo cursor logic for Web, Mobile, and USSD UIs.
- **frontend/**: Contains the standalone product web application.
  - `index.html`: Landing page with hero, features, and impact stats.
  - `login.html`: Auth system with mock registration/login logic.
  - `dashboard.html`: User dashboard with portfolio tracking and recent activity.
  - `send_invest.html`: The Send & Invest transaction split flow.
  - `kyc.html`: Identity verification onboarding.
  - `admin.html`: Administrative oversight dashboard.

## Key Features

- **Remit & Invest**: Split any remittance between family and investments using a simple allocation slider.
- **Multi-Channel**: Supports Mukuru, WorldRemit, and EcoCash integrations.
- **Cross-Platform**: Full Web UI, Mobile App design, and USSD terminal simulation (*384*123#).
- **Secure**: Bank-grade KYC and encrypted data handling.

## Getting Started

1. Open `presentation/index.html` to view the interactive pitch.
2. Open `frontend/index.html` to explore the product landing page.
3. Use the demo credentials `demo@zimvest.co.zw` / `demo123` to access the dashboard.

Built for the Zimbabwean Diaspora.
