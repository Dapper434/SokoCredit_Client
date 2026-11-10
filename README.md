# SokoCredit

A loan management platform connecting Kenyan microfinance lenders with mama mboga (market women) and small-scale traders. Two connected portals — a mobile-first **Customer Portal** for borrowers, and a desktop-first **Lender Portal** for institution staff — built as a Moringa School capstone project (Project 34, cohort SDF-FT17).

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 (custom design tokens, see `src/index.css`) |
| Routing | React Router |
| Charts | Recharts |
| Backend | Python (Flask), in the [SokoCredit-Server](https://github.com/Dapper434/SokoCredit-Server) repo |
| Database | SQLAlchemy (SQLite locally; PostgreSQL-ready) |
| Payments | M-Pesa Daraja API (sandbox integration on the backend) |
| Auth | JWT-based sessions, role-based access control |

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default. The backend (once running) is expected at `http://localhost:5000` — see `src/lib/api.js`.

To build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── LenderLayout.jsx      # Dark sidebar shell — wraps every Lender Portal screen
│   │   ├── CustomerLayout.jsx    # Post-login Customer Portal shell (top nav on desktop, bottom nav on mobile)
│   │   └── CustomerAuthFrame.jsx # Pre-login Customer Portal wrapper (sign in, OTP, onboarding)
│   ├── shared/
│   │   └── StatusBadge.jsx       # One component, color-coded by loan/application status
│   └── otp/
│       └── OtpInput.jsx          # Six-box MFA/OTP entry with auto-advance focus
│
├── pages/
│   ├── PortalSelect.jsx          # Landing page — choose Customer or Lender portal
│   ├── lender/
│   │   ├── SignIn.jsx            # Includes Branch Manager / Loan Officer role toggle
│   │   ├── TwoFactorAuth.jsx
│   │   ├── RegisterStep1.jsx     # Institution onboarding — Business Identity
│   │   ├── RegisterStep2.jsx     # Institution onboarding — Operational & Settlement
│   │   ├── CommandCenter.jsx     # Portfolio KPIs, PAR aging, market risk (Branch Manager only)
│   │   ├── Operations.jsx        # Daily targets, overdue queue, live collections feed
│   │   ├── ApprovalDesk.jsx      # New applications + reschedule requests
│   │   ├── CrmProfiles.jsx       # Searchable borrower directory + 360° profile
│   │   └── StaffAccess.jsx       # Staff roster, invites, settlement change requests (Branch Manager only)
│   └── customer/
│       ├── CustomerSignIn.jsx
│       ├── CustomerOtp.jsx
│       ├── CustomerOnboardStep1.jsx   # Personal Identity
│       ├── CustomerOnboardStep2.jsx   # Business & Credit
│       ├── CustomerCreditCheck.jsx    # In-house credit-reference splash
│       ├── MyHub.jsx                  # Landing dashboard
│       ├── LoanWizard.jsx             # 2-step loan application
│       ├── ActivePortfolio.jsx        # Live repayment schedule + arrears states
│       └── ProfileCenter.jsx          # KYC, badges, documents
│
├── data/
│   ├── mockLenderData.js         # Institution, staff roster, borrowers, applications, market risk
│   └── mockCustomerData.js       # Borrower profile, loan config, repayment schedule, badges
│
├── routes/
│   └── LenderRoutes.jsx          # All application routes (despite the name, covers both portals)
│
└── lib/
    └── api.js                    # Backend requests, session storage (login, saveSession, getSession)
```

## Role-Based Access (Lender Portal)

Two staff roles. A toggle on Lender Sign In is used for local mock-data flows; a `role` field from the backend login response overrides it:

- **Branch Manager** — full access to every screen
- **Loan Officer** — Operations, Approval Desk, and CRM & Profiles only; Command Center and Staff & Access are hidden from the sidebar and redirect if accessed directly by URL

Role is stored in the session (`localStorage`) and read by `LenderLayout` and `TwoFactorAuth`. Once the backend returns a real `role` field on login, it overrides the manual toggle automatically — no frontend change needed.

## Current Status

The live frontend is at [soko-credit-client.vercel.app](https://soko-credit-client.vercel.app/) and talks to the API at [sokocredit-server.onrender.com](https://sokocredit-server.onrender.com/api/health).

**Built:**
- Full Lender Portal — staff-facing screens, RBAC, institution onboarding
- Full Customer Portal — borrower-facing screens, responsive from mobile through desktop
- Shared design system (Tailwind tokens, StatusBadge, OTP input)
- Backend in [SokoCredit-Server](https://github.com/Dapper434/SokoCredit-Server): auth, origination, servicing, and M-Pesa sandbox integration

**Still in progress:**
- Some portal screens still use mock data from `src/data/` rather than the live API
- Real credit scoring / risk engine
- SMS/WhatsApp notification pipeline

## Team Workflow

- The default branch is `development` (there is no `main` branch yet)
- Feature branches per screen/feature, merged via PR

## Design Reference

Figma design: covers both portals across 10 screens, including the visual/interaction spec (status color language, disabled-state reasoning, empty/loading states) this build follows.
