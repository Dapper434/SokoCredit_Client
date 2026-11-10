import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LenderLayout from "../components/layout/LenderLayout";
import CustomerLayout from "../components/layout/CustomerLayout";

const PortalSelect = lazy(() => import("../pages/PortalSelect"));
const SignIn = lazy(() => import("../pages/lender/SignIn"));
const TwoFactorAuth = lazy(() => import("../pages/lender/TwoFactorAuth"));
const RegisterStep1 = lazy(() => import("../pages/lender/RegisterStep1"));
const RegisterStep2 = lazy(() => import("../pages/lender/RegisterStep2"));
const RegisterStep3 = lazy(() => import("../pages/lender/RegisterStep3"));
const RegistrationSuccess = lazy(() => import("../pages/lender/RegistrationSuccess"));
const CommandCenter = lazy(() => import("../pages/lender/CommandCenter"));
const Operations = lazy(() => import("../pages/lender/Operations"));
const ApprovalDesk = lazy(() => import("../pages/lender/ApprovalDesk"));
const CrmProfiles = lazy(() => import("../pages/lender/CrmProfiles"));
const StaffAccess = lazy(() => import("../pages/lender/StaffAccess"));
const CustomerSignIn = lazy(() => import("../pages/customer/CustomerSignIn"));
const CustomerOtp = lazy(() => import("../pages/customer/CustomerOtp"));
const CustomerOnboardStep1 = lazy(() => import("../pages/customer/CustomerOnboardStep1"));
const CustomerOnboardStep2 = lazy(() => import("../pages/customer/CustomerOnboardStep2"));
const CustomerCreditCheck = lazy(() => import("../pages/customer/CustomerCreditCheck"));
const MyHub = lazy(() => import("../pages/customer/MyHub"));
const LoanWizard = lazy(() => import("../pages/customer/LoanWizard"));
const ActivePortfolio = lazy(() => import("../pages/customer/ActivePortfolio"));
const ProfileCenter = lazy(() => import("../pages/customer/ProfileCenter"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
      Loading…
    </div>
  );
}

export default function LenderRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
    <Routes>
      {/* Shared Landing Page */}
      <Route path="/" element={<PortalSelect />} />

      {/* Lender Portal — Public */}
      <Route path="/lender/signin" element={<SignIn />} />
      <Route path="/lender/mfa" element={<TwoFactorAuth />} />
      <Route path="/lender/register" element={<RegisterStep1 />} />
      <Route path="/lender/register/compliance" element={<RegisterStep2 />} />
      <Route path="/lender/register/settlement" element={<RegisterStep3 />} />
      <Route path="/lender/register/success" element={<RegistrationSuccess />} />

      {/* Lender Portal — Protected */}
      <Route path="/lender" element={<ProtectedRoute allowedRoles={['branch_manager', 'loan_officer']} />}>
        <Route element={<LenderLayout />}>
          <Route index element={<Navigate to="command-center" replace />} />
          
          {/* Branch Manager Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['branch_manager']} />}>
            <Route path="command-center" element={<CommandCenter />} />
            <Route path="staff" element={<StaffAccess />} />
          </Route>

          {/* Shared / Loan Officer Routes */}
          <Route path="operations" element={<Operations />} />
          <Route path="approvals" element={<ApprovalDesk />} />
          <Route path="crm" element={<CrmProfiles />} />
        </Route>
      </Route>

      {/* Customer Portal — Public (pre-login + onboarding) */}
      <Route path="/customer/signin" element={<CustomerSignIn />} />
      <Route path="/customer/otp" element={<CustomerOtp />} />
      <Route path="/customer/onboarding/1" element={<CustomerOnboardStep1 />} />
      <Route path="/customer/onboarding/2" element={<CustomerOnboardStep2 />} />
      <Route path="/customer/creditcheck" element={<CustomerCreditCheck />} />

      {/* Customer Portal — Authenticated (uses CustomerLayout) */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/customer" element={<CustomerLayout />}>        <Route index element={<Navigate to="hub" replace />} />
        <Route path="hub" element={<MyHub />} />
        <Route path="loan" element={<LoanWizard />} />
        <Route path="portfolio" element={<ActivePortfolio />} />
        <Route path="profile" element={<ProfileCenter />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
