import { NavLink, Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { clearSession, getSession } from "../../lib/api";
import { institution } from "../../data/mockLenderData";

// Navigation links for the sidebar, gated by staff role.
// "branch_manager" sees everything; "loan_officer" only sees the
// day-to-day operational screens.
const navItems = [
  { to: "/lender/dashboard", label: "Command Center", roles: ["branch_manager"] },
  { to: "/lender/operations", label: "Operations", roles: ["branch_manager", "loan_officer"] },
  { to: "/lender/approvals", label: "Approval Desk", roles: ["branch_manager", "loan_officer"] },
  { to: "/lender/crm", label: "CRM & Profiles", roles: ["branch_manager", "loan_officer"] },
  { to: "/lender/staff", label: "Staff & Access", roles: ["branch_manager"] },
];

// Routes a loan officer should never land on directly via URL —
// redirected back to Operations if they try.
const MANAGER_ONLY_PATHS = ["/lender/dashboard", "/lender/staff"];

export default function LenderLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const session = getSession();
  // Backend doesn't return a role yet, so default to branch_manager
  // (full access) until that's wired up.
  const role = session?.role || "branch_manager";
  const staffName = session?.user?.full_name?.trim() || institution.staffName;

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
      <main className="flex-1 bg-ground overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}