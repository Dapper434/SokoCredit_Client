import { NavLink, Outlet } from "react-router-dom";
import { institution } from "../../data/mockLenderData";

const navItems = [
  { to: "/lender/dashboard", label: "Command Center" },
  { to: "/lender/operations", label: "Operations" },
  { to: "/lender/approvals", label: "Approval Desk" },
  { to: "/lender/crm", label: "CRM & Profiles" },
];

export default function LenderLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-bg text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs tracking-widest text-white/50">SOKOCREDIT</p>
          <h1 className="text-lg font-bold mt-1">Lender Portal</h1>
        </div>

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

        <div className="p-4 border-t border-white/10">
          <button className="text-sm text-white/70 hover:text-white flex items-center gap-2">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-ground overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}