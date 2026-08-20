import { Routes, Route, Navigate } from "react-router-dom";
import LenderLayout from "../components/layout/LenderLayout";
import SignIn from "../pages/lender/SignIn";
import TwoFactorAuth from "../pages/lender/TwoFactorAuth";
import CommandCenter from "../pages/lender/CommandCenter";
import Operations from "../pages/lender/Operations";
import ApprovalDesk from "../pages/lender/ApprovalDesk";
import CrmProfiles from "../pages/lender/CrmProfiles";

export default function LenderRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lender/signin" replace />} />


      {/* Auth screens — no sidebar */}
      <Route path="/lender/signin" element={<SignIn />} />
      <Route path="/lender/mfa" element={<TwoFactorAuth />} />

      {/* App screens — wrapped in sidebar layout */}
      <Route path="/lender" element={<LenderLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CommandCenter />} />
        <Route path="operations" element={<Operations />} />
        <Route path="approvals" element={<ApprovalDesk />} />
        <Route path="crm" element={<CrmProfiles />} />
      </Route>
    </Routes>
  );
}