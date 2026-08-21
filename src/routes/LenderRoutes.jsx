import { Routes, Route, Navigate } from "react-router-dom";

// Layouts and Pages
import LenderLayout from "../components/layout/LenderLayout";
import PortalSelect from "../pages/PortalSelect";
import SignIn from "../pages/lender/SignIn";
import TwoFactorAuth from "../pages/lender/TwoFactorAuth";
import RegisterStep1 from "../pages/lender/RegisterStep1";
import RegisterStep2 from "../pages/lender/RegisterStep2";

// Dashboard Pages (Placeholders)
import CommandCenter from "../pages/lender/CommandCenter";
import Operations from "../pages/lender/Operations";
import ApprovalDesk from "../pages/lender/ApprovalDesk";
import CrmProfiles from "../pages/lender/CrmProfiles";

export default function LenderRoutes() {
  return (
    <Routes>
      {/* Landing page where user selects Customer vs Lender portal */}
      <Route path="/" element={<PortalSelect />} />

      {/* Auth screens — These render without the sidebar */}
      <Route path="/lender/signin" element={<SignIn />} />
      <Route path="/lender/mfa" element={<TwoFactorAuth />} />
      <Route path="/lender/register" element={<RegisterStep1 />} />
      <Route path="/lender/register/settlement" element={<RegisterStep2 />} />
      
      {/* App screens — These render inside the LenderLayout (with sidebar) */}
      <Route path="/lender" element={<LenderLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CommandCenter />} />
        <Route path="operations" element={<Operations />} />
        <Route path="approvals" element={<ApprovalDesk />} />
        <Route path="crm" element={<CrmProfiles />} />
      </Route>

      {/* Catch-all fallback route - redirects unknown URLs back to the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}