import { Routes, Route, Navigate } from "react-router-dom";

// Layouts and Pages
import LenderLayout from "../components/layout/LenderLayout";
import CustomerLayout from "../components/layout/CustomerLayout";
import PortalSelect from "../pages/PortalSelect";
import SignIn from "../pages/lender/SignIn";
import TwoFactorAuth from "../pages/lender/TwoFactorAuth";
import RegisterStep1 from "../pages/lender/RegisterStep1";
import RegisterStep2 from "../pages/lender/RegisterStep2";

// Lender dashboard pages
import CommandCenter from "../pages/lender/CommandCenter";
import Operations from "../pages/lender/Operations";
import ApprovalDesk from "../pages/lender/ApprovalDesk";
import CrmProfiles from "../pages/lender/CrmProfiles";
import StaffAccess from "../pages/lender/StaffAccess";

// Customer Portal pages
import CustomerSignIn from "../pages/customer/CustomerSignIn";
import CustomerOtp from "../pages/customer/CustomerOtp";
import CustomerOnboardStep1 from "../pages/customer/CustomerOnboardStep1";
import CustomerOnboardStep2 from "../pages/customer/CustomerOnboardStep2";
import CustomerCreditCheck from "../pages/customer/CustomerCreditCheck";
import MyHub from "../pages/customer/MyHub";
import LoanWizard from "../pages/customer/LoanWizard";
import ActivePortfolio from "../pages/customer/ActivePortfolio";
import ProfileCenter from "../pages/customer/ProfileCenter";

export default function LenderRoutes() {
  return (
    <Routes>
      {/* Landing page where user selects Customer vs Lender portal */}
      <Route path="/" element={<PortalSelect />} />

      {/* Lender auth screens — render without the sidebar */}
      <Route path="/lender/signin" element={<SignIn />} />
      <Route path="/lender/mfa" element={<TwoFactorAuth />} />
      <Route path="/lender/register" element={<RegisterStep1 />} />
      <Route path="/lender/register/settlement" element={<RegisterStep2 />} />

      {/* Lender app screens — render inside LenderLayout (sidebar, role-gated) */}
      <Route path="/lender" element={<LenderLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CommandCenter />} />
        <Route path="operations" element={<Operations />} />
        <Route path="approvals" element={<ApprovalDesk />} />
        <Route path="crm" element={<CrmProfiles />} />
        <Route path="staff" element={<StaffAccess />} />
      </Route>

      {/* Customer auth/onboarding — render without the mobile shell (full-bleed screens) */}
      <Route path="/customer/signin" element={<CustomerSignIn />} />
      <Route path="/customer/otp" element={<CustomerOtp />} />
      <Route path="/customer/onboarding/1" element={<CustomerOnboardStep1 />} />
      <Route path="/customer/onboarding/2" element={<CustomerOnboardStep2 />} />
      <Route path="/customer/creditcheck" element={<CustomerCreditCheck />} />

      {/* Customer app screens — render inside CustomerLayout (bottom nav) */}
        <Route path="/customer" element={<CustomerLayout />}>        <Route index element={<Navigate to="hub" replace />} />
        <Route path="hub" element={<MyHub />} />
        <Route path="loan" element={<LoanWizard />} />
        <Route path="portfolio" element={<ActivePortfolio />} />
        <Route path="profile" element={<ProfileCenter />} />
      </Route>

      {/* Catch-all fallback route - redirects unknown URLs back to the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
