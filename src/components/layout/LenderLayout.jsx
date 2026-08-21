import { NavLink, Outlet, useNavigate } from "react-router-dom";
// We import mock institution data to display the user's name in the sidebar
import { institution } from "../../data/mockLenderData";

// Navigation links for the sidebar
const navItems = [
  { to: "/lender/dashboard", label: "Command Center" },
  { to: "/lender/operations", label: "Operations" },
  { to: "/lender/approvals", label: "Approval Desk" },
  { to: "/lender/crm", label: "CRM & Profiles" },
];

export default function LenderLayout() {
  const navigate = useNavigate();

  // Handles signing out and returning to the landing page
  const handleSignOut = () => {
    navigate("/");
  };

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
            SK
          </div>
          <div>
            <p className="font-semibold">{institution.staffName}</p>
            <p className="text-xs text-white/50 uppercase tracking-wide">
              {institution.staffRole}
            </p>
          </div>
        </div>

        {/* Navigation menu mapping through navItems */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/70 hover:bg-sidebar-item-bg"
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