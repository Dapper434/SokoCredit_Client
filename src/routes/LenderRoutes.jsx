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
      {/* We will add auth screens here shortly! */}
      
      {/* App screens — These render inside the LenderLayout (with sidebar) */}
      {/* We will add the app screens here shortly! */}

      {/* Catch-all fallback route - redirects unknown URLs back to the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}