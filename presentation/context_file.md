ZimVest — Prototype Specification

1. What Is ZimVest?
ZimVest is a fintech platform purpose-built for the Zimbabwean diaspora. Its core idea is a "send-and-invest" model: when a diaspora user (primarily based in South Africa) sends money home to Zimbabwe, they can simultaneously allocate a portion of that transfer into investment assets — fractional shares, bonds, gold savings, or education funds — while the remainder goes to their family as a standard remittance.
The platform bridges two services that currently exist in isolation:
Service Today
What ZimVest Does
Remittance (Mukuru, WorldRemit)
Remittance + automatic investment in one flow
Investment (ZSE, VFEX brokers)
Accessible to diaspora with no separate brokerage account needed

The problem it solves: Zimbabwe receives over $2.7 billion USD in annual diaspora remittances, but most of this money is spent on immediate household needs. ZimVest turns a portion of every transfer into a long-term wealth-building event for the family back home.

4. Core Features to Include in the Prototype
4.1 User Onboarding & KYC
What it does: Registers a new diaspora user and verifies their identity before they can transact.
Screens/steps to build:
Sign-up form: Full name, phone number, email, country of residence, national ID upload
OTP verification via SMS (use a mock OTP service for prototype — e.g., always accept 123456)
KYC status screen: "Verification Pending / Verified / Rejected"
On success → redirect to dashboard
Developer notes:
Store KYC status as an enum: PENDING | VERIFIED | REJECTED
Only VERIFIED users can initiate transfers
Document upload can be a file picker saving to local storage for the prototype; no real OCR needed yet

4.2 Digital Wallet & Account Dashboard
What it does: Every user gets a ZimVest wallet. This is the home screen after login.
What to display:
Wallet balance (USD)
Investment portfolio value (total)
Recent transactions (last 5)
Quick-action buttons: Send & Invest, View Portfolio, Withdraw
Developer notes:
Wallet balance is separate from investment value — user has two "buckets"
Portfolio value is calculated from mock asset prices × held units
Use static/mock asset prices for the prototype (no live market feed needed yet)

4.3 Send & Invest — The Core Flow
This is the heart of the prototype. Get this right above everything else.
What it does: The user initiates a transfer. They choose how much goes to family and how much gets invested.
Step-by-step flow to build:
Step 1: Enter Amount
  └── User enters total USD amount to send (e.g., $200)

Step 2: Fund Allocation Slider
  └── Slider UI: "Send to Family" ←→ "Invest"
  └── Example: $150 (75%) to family | $50 (25%) to invest
  └── Show both amounts updating in real time as slider moves

Step 3: Choose Investment Assets (for the investment portion)
  └── Select one or more:
      - Fractional Shares (ZSE/VFEX listed stocks)
      - SME Bonds
      - Gold Savings
      - Education Fund
  └── For prototype: show 3–4 mock asset options with static prices/returns

Step 4: Select Beneficiary
  └── Pick from saved beneficiaries OR add new (name + mobile money number)

Step 5: Select Remittance Channel
  └── Dropdown: Mukuru | WorldRemit | Bank Transfer (mock integrations for prototype)

Step 6: Review & Confirm
  └── Summary screen showing all details
  └── Fee breakdown:
      - Management fee: 5% of investment portion
      - Performance fee: 30% of returns above benchmark (show as note, not calculated at transfer time)
      - First-time users: 1% discount badge shown

Step 7: Processing
  └── Loading/progress animation
  └── Mock API call (simulate 2–3 second delay)

Step 8: Success Screen
  └── Confirmation: "$150 sent to [Beneficiary]"
  └── Confirmation: "$50 invested in [Selected Assets]"
  └── Transaction ID
  └── "View Portfolio" CTA
Developer notes:
The remittance partner integrations (Mukuru, WorldRemit) are mocked in the prototype — simulate success/failure with a configurable flag
Fees are calculated client-side for the prototype
Store transaction history in local state or a simple database

4.4 Investment Portfolio Tracker
What it does: Shows the user what they've invested, how it's performing, and lets them drill into each asset.
Screens to build:
Portfolio Overview:
Total portfolio value (USD)
% change since start (mock this with static data)
Pie/donut chart: breakdown by asset type (Shares / Gold / Bonds / Education Fund)
List of held assets with units, current price (mock), and value
Asset Detail Screen:
Asset name and description
Units held
Average buy price vs current price
Simple line chart showing price over time (use mock historical data)
Unrealised gain/loss
Developer notes:
Use static mock price data — create a JSON file of 30-day price history for each mock asset
No live market API needed for the prototype
Charts: use a library like Recharts (React) or Chart.js

4.5 Beneficiary Disbursement
What it does: Manages the family recipients in Zimbabwe who receive the remittance portion.
What to build:
Add beneficiary form: Full name, mobile money number, relationship (e.g., spouse, parent)
Saved beneficiaries list
Beneficiary receives an SMS notification (mock — log to console or show a simulated SMS UI)
Beneficiary view (separate login): can see received amount and investment summary
Developer notes:
Beneficiary portal can be a simple read-only view — no transactions from their side in the prototype
SMS notifications: mock with a toast/notification in the UI; do not call a real SMS API

4.6 Transaction History & Notifications
What it does: Full log of every action the user has taken.
What to build:
Filterable transaction list: All | Remittances | Investments | Withdrawals
Each transaction row: Date, type, amount, status badge (PENDING | COMPLETED | FAILED)
Tap to expand → full transaction detail
Notification centre: in-app bell icon showing unread alerts (investment performance updates, transfer confirmations)

4.7 Performance Reports
What it does: Gives the user a summary of their investment performance over time.
What to build:
Monthly summary card: Total invested, current value, return %
Downloadable report button (prototype: generate a simple PDF or just show a print view)
Statement of transactions (last 30 days)

4.8 Admin Dashboard (Internal — Back Office)
What it does: Lets ZimVest staff monitor platform activity.
What to build:
Widget
Data
Total active users
Count
Total transaction volume (USD)
Sum
New registrations (this week)
Count
Flagged transactions
List with reason
KYC queue
Pending verifications list

Developer notes:
Admin is a separate route/login: /admin
Role-based access: user vs admin
No complex rules engine needed — just a hardcoded list of "flagged" mock transactions for demo

5. Technical Architecture (Recommended for Prototype)
5.1 Frontend
Framework: React (web) + React Native (mobile, or use Expo for faster setup)
Styling: Tailwind CSS (web) / NativeWind (mobile)
Charts: Recharts or Chart.js
State management: Zustand or React Context API (keep it simple)
5.2 Backend
Framework: Node.js with Express OR Python with FastAPI — pick whatever the team is stronger in
Database: PostgreSQL (preferred) or SQLite for a quicker prototype start
Auth: JWT-based authentication; bcrypt for password hashing
File uploads (KYC docs): Store locally in /uploads folder for prototype; do not use cloud storage yet
5.3 Mock Integrations
All third-party integrations are mocked in the prototype:
Real Integration
Prototype Approach
Mukuru / WorldRemit API
Local mock service returning { status: "success", txId: "MOCK-001" }
ZSE / VFEX live prices
Static JSON file: mock_asset_prices.json
SMS notifications
console.log() or in-app toast notification
USSD gateway
Not implemented; placeholder screen only
AML / compliance check
Hardcoded: all transactions under $1,000 auto-pass

5.4 Database Schema (Core Tables)
users
  - id, full_name, email, phone, country, kyc_status, created_at

wallets
  - id, user_id, balance_usd

transactions
  - id, user_id, total_amount, remittance_amount, investment_amount,
    beneficiary_id, remittance_channel, status, created_at

investments
  - id, user_id, asset_type, asset_name, units, buy_price, created_at

beneficiaries
  - id, user_id, full_name, mobile_number, relationship

portfolio_snapshots
  - id, user_id, snapshot_date, total_value

notifications
  - id, user_id, message, is_read, created_at

6. Mock Assets to Include in the Prototype
Use these static assets in the investment selection screen:
Asset
Type
Mock Price
Mock 30-day Return
Econet Wireless
Fractional Share (ZSE)
$0.45/share
+3.2%
Delta Corporation
Fractional Share (ZSE)
$1.20/share
+1.8%
ZimGold Savings
Gold Savings
$0.10/unit
+2.5%
ZimSME Bond A
SME Bond
$1.00/unit
+5.0% fixed
EduFund Zimbabwe
Education Fund
$1.00/unit
+4.0%


7. Prototype User Flows Summary
[New User]
  └── Download App / Visit Web
  └── Sign Up → OTP Verify → KYC Upload → Dashboard

[Returning Sender]
  └── Login → Dashboard
  └── Tap "Send & Invest"
  └── Enter amount → Slide allocation → Pick assets → Pick beneficiary
  └── Review → Confirm → Success
  └── View updated portfolio

[Beneficiary in Zimbabwe]
  └── Receives SMS (mock)
  └── Logs into beneficiary portal
  └── Sees: Amount received + Investment summary for their account

[Admin]
  └── Login to /admin
  └── Views: user stats, transaction volume, KYC queue, flagged transactions

8. Prototype Screens Checklist
Onboarding
[ ] Splash / Landing screen
[ ] Sign Up form
[ ] OTP verification screen
[ ] KYC document upload screen
[ ] KYC pending / success screen
Main App (Sender)
[ ] Dashboard / Home
[ ] Send & Invest — Step 1: Enter Amount
[ ] Send & Invest — Step 2: Allocation Slider
[ ] Send & Invest — Step 3: Asset Selection
[ ] Send & Invest — Step 4: Beneficiary Selection
[ ] Send & Invest — Step 5: Remittance Channel
[ ] Send & Invest — Step 6: Review & Confirm
[ ] Send & Invest — Step 7: Processing
[ ] Send & Invest — Step 8: Success
[ ] Portfolio Overview
[ ] Asset Detail (with chart)
[ ] Transaction History
[ ] Notification Centre
[ ] Performance Report
[ ] Profile & Settings
Beneficiary Portal
[ ] Login screen (separate)
[ ] Received funds overview
[ ] Investment portfolio (read-only)
Admin Dashboard
[ ] Login (separate)
[ ] Stats overview
[ ] KYC queue
[ ] Flagged transactions


11. Key Design Principles for the Developer
Simplicity first. Many users are first-time investors. Every screen should explain what is happening in plain language.
Trust signals everywhere. Show fee transparency, confirmation steps, and transaction IDs — users are sending real money.
Accessibility. Support both English and (use a simple i18n setup even if only English is translated for the prototype).
Web is primary