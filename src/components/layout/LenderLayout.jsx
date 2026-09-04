import { NavLink, Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { clearSession, getSession } from "../../lib/api";
import { institution } from "../../data/mockLenderData";

// Navigation links for the sidebar, gated by staff role.
// "branch_manager" sees everything; "loan_officer" only sees the
// day-to-day operational screens.
const navItems = [
  { to: "/lender/command-center", label: "Command Center", roles: ["branch_manager"] },
  { to: "/lender/operations", label: "Operations", roles: ["branch_manager", "loan_officer"] },
  { to: "/lender/approvals", label: "Approval Desk", roles: ["branch_manager", "loan_officer"] },
  { to: "/lender/crm", label: "CRM & Profiles", roles: ["branch_manager", "loan_officer"] },
  { to: "/lender/staff", label: "Staff & Access", roles: ["branch_manager"] },
];

// Routes a loan officer should never land on directly via URL —
// redirected back to Operations if they try.
const MANAGER_ONLY_PATHS = ["/lender/command-center", "/lender/staff"];

export default function LenderLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const session = getSession();

  // The Lender Portal has two access levels: Branch Manager and Loan Officer.
  // The backend may return roles like super_admin, admin, or manager —
  // all of these map to "branch_manager" (full access) on the frontend.
  const rawRole = session?.role || session?.user?.role || "branch_manager";
  const role = rawRole === "loan_officer" ? "loan_officer" : "branch_manager";
  const staffName = session?.user?.full_name?.trim() || session?.user?.name?.trim() || institution.staffName;

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  const handleSignOut = () => {
    clearSession();
    navigate("/");
  };

  // Guard against a loan officer hitting a manager-only route directly by URL.
  if (role === "loan_officer" && MANAGER_ONLY_PATHS.includes(location.pathname)) {
    return <Navigate to="/lender/operations" replace />;
  }

  return (
    // Main layout wrapper spanning the full screen
    <div className="flex min-h-screen">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-sidebar-bg text-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <p className="text-xs tracking-widest text-white/50">SOKOCREDIT</p>
          <h1 className="text-lg font-bold mt-1">Lender Portal</h1>
        </div>

        {/* User Profile Info */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-semibold">
            {staffName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{staffName}</p>
            <p className="text-xs text-white/50 uppercase tracking-wide">
              {role === "branch_manager" ? "Branch Manager" : "Loan Officer"}
            </p>
          </div>
        </div>

        {/* Navigation menu, filtered by role */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-md text-sm font-medium ${
                  isActive ? "bg-primary text-white" : "text-white/70 hover:bg-sidebar-item-bg"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer of the sidebar with Sign Out functionality */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="text-sm text-white/70 hover:text-white flex items-center gap-2 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area where child routes render */}
      <main className="flex-1 bg-ground overflow-y-auto relative">
        {/* Global Badges */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2 md:gap-3 z-10 flex-wrap justify-end max-w-[50%] md:max-w-none">
          <div className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-sm bg-status-missed-bg/30 border border-status-missed-text/40">
            <span className="w-1.5 h-1.5 rounded-full bg-status-missed-text"></span>
            <span className="text-[9px] md:text-[10px] font-bold text-status-missed-text uppercase tracking-widest whitespace-nowrap">
              {session?.user?.institution_name || "New Institution"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-sm bg-status-paid-bg/30 border border-status-paid-text/40">
            <span className="text-[9px] md:text-[10px] font-bold text-status-paid-text uppercase tracking-widest whitespace-nowrap">System Live</span>
          </div>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
}