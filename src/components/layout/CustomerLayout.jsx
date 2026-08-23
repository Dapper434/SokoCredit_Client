import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { borrowerProfile } from "../../data/mockCustomerData";

const navItems = [
  {
    to: "/customer/hub",
    label: "My Hub",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    to: "/customer/loan",
    label: "Apply",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: "/customer/portfolio",
    label: "Portfolio",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: "/customer/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function MobileShell() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary p-0 sm:p-6">
      {/* Phone frame on desktop, full screen on mobile */}
      <div className="relative w-full sm:w-[390px] sm:max-h-[844px] bg-ground sm:rounded-[32px] sm:overflow-hidden sm:shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:h-[844px]">
        {/* Top header */}
        <header className="flex items-center justify-between px-5 py-3 bg-ground border-b border-border">
          <div>
            <span className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">SokoCredit</span>
            <p className="text-sm font-semibold text-ink leading-tight">
              Habari, {borrowerProfile.displayName.split(" ")[0]}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-ground-dim text-ink-dim hover:bg-border transition-colors cursor-pointer"
            title="Back to portals"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-missed-text rounded-full border border-ground" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Bottom nav */}
        <nav className="flex items-stretch border-t border-border bg-ground sm:rounded-b-[32px]">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-colors ${
                  isActive ? "text-primary" : "text-ink-muted hover:text-ink-dim"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? "opacity-100" : "opacity-60"}>{icon}</span>
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}