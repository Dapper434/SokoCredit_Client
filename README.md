# SokoCredit

A loan management platform connecting Kenyan microfinance lenders with mama mboga (market women) and small-scale traders. Two connected portals — a mobile-first **Customer Portal** for borrowers, and a desktop-first **Lender Portal** for institution staff — built as a Moringa School capstone project (Project 34, cohort SDF-FT17).

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 (custom design tokens, see `src/index.css`) |
| Routing | React Router |
| Charts | Recharts |
| Backend | Python (Flask) — in progress |
| Database | PostgreSQL (planned) |
| Payments | M-Pesa Daraja API (planned) |
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

Two staff roles, selected via a toggle on Lender Sign In until the backend returns real role data:

- **Branch Manager** — full access to every screen
- **Loan Officer** — Operations, Approval Desk, and CRM & Profiles only; Command Center and Staff & Access are hidden from the sidebar and redirect if accessed directly by URL

Role is stored in the session (`localStorage`) and read by `LenderLayout` and `TwoFactorAuth`. Once the backend returns a real `role` field on login, it overrides the manual toggle automatically — no frontend change needed.

## Current Status

**Built:**
- Full Lender Portal — all 6 staff-facing screens, RBAC, institution onboarding
- Full Customer Portal — all 9 borrower-facing screens, responsive from mobile through desktop
- Shared design system (Tailwind tokens, StatusBadge, OTP input)
- Backend auth endpoints (login, session handling)

**Not yet built:**
- Remaining backend API surface (loans, repayments, analytics, M-Pesa integration)
- Real credit scoring / risk engine (currently mock data)
- SMS/WhatsApp notification pipeline

All screens currently run on mock data (`src/data/`) matching the shape real API responses are expected to take, so wiring up the backend should mean swapping data sources rather than rewriting components.

## Team Workflow

- All work merges into the `development` branch (no `main` yet — created once the full project is complete)
- Feature branches per screen/feature, merged via PR
- Shared foundation (design tokens, layout shells, mock data) built first; screens built in parallel once that landed

## Design Reference

Figma design: covers both portals across 10 screens, including the visual/interaction spec (status color language, disabled-state reasoning, empty/loading states) this build follows.