import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { GOV_SAFFRON, GOV_NAVY, GOV_PRIMARY_BG } from "@/lib/designTokens";

const NCIS_NAV_ITEMS = [
  { label: "Intelligence Dashboard", path: "/", page: "MainDashboard" },
  { label: "Crime Pattern Analysis", path: null, page: "NCISDashboard" },
  { label: "Prevention Strategies", path: null, page: "PreventionPlaybooks" },
  { label: "Scenario Planning", path: null, page: "WhatIfSimulator" },
  { label: "Reports", path: null, page: "FullAnalytics" },
  { label: "IoT", path: null, page: "IoTNetwork" },
  { label: "Live Patrol Status", path: null, page: "LiveCrimePulse" },
];

function getNavHref(item) {
  if (item.path) return item.path;
  return item.page === "MainDashboard" ? "/" : (item.page === "NCISDashboard" ? "/NCISDashboard" : createPageUrl(item.page));
}

function isNavActive(item, pathname) {
  if (item.page === "MainDashboard") return pathname === "/";
  if (item.page === "NCISDashboard") return pathname === "/NCISDashboard";
  return pathname === createPageUrl(item.page);
}

export default function Layout({ children }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div
      className="min-h-screen text-gray-900 flex flex-col"
      style={{
        backgroundImage: "url(/ncis-tricolour-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Government of India top strip – subtle */}
      <div
        className="flex-shrink-0 h-9 flex items-center justify-center gap-4 text-white text-sm font-bold tracking-wide"
        style={{ background: GOV_SAFFRON }}
      >
        <span>Government of India</span>
        <span className="opacity-90">भारत सरकार</span>
      </div>

      {/* Top horizontal navigation – no sidebar */}
      <header className="flex-shrink-0 flex items-center gap-6 h-16 px-6 bg-white/95 border-b shadow-sm border-gray-200">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white flex items-center justify-center"
            style={{ border: `2px solid ${GOV_NAVY}` }}
          >
            <img
              src="/ncis-logo.png"
              alt="National Police"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              Crime DNA
            </h1>
            <p className="text-sm font-semibold text-gray-600 truncate">National Crime Intelligence System</p>
          </div>
        </Link>

        <nav className="flex-1 flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {NCIS_NAV_ITEMS.map((item) => {
            const active = isNavActive(item, pathname);
            const href = getNavHref(item);
            return (
              <Link
                key={item.page}
                to={href}
                className={cn(
                  "flex-shrink-0 px-3 py-4 text-base font-bold transition-colors border-b-2 -mb-px",
                  active
                    ? "text-gray-900 border-current"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                )}
                style={
                  active
                    ? { borderBottomColor: GOV_PRIMARY_BG, color: GOV_NAVY }
                    : {}
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Page content */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>

      {/* Government portal footer */}
      <footer className="flex-shrink-0 border-t border-gray-200 bg-white/90">
        <div className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
          <p>© National Crime Intelligence System. This is an official Government of India portal.</p>
          <p className="mt-1">Content is maintained by the concerned ministry/department.</p>
        </div>
      </footer>
    </div>
  );
}
