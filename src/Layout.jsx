import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { GOV_SAFFRON, GOV_NAVY, GOV_PRIMARY_BG } from "@/lib/designTokens";
import { useLanguage } from "@/contexts/LanguageContext";

const NCIS_NAV_ITEMS = [
  { labelKey: "navIntelligenceDashboard", path: "/", page: "MainDashboard" },
  { labelKey: "navCrimePatternAnalysis", path: null, page: "NCISDashboard" },
  { labelKey: "navPreventionStrategies", path: null, page: "PreventionPlaybooks" },
  { labelKey: "navScenarioPlanning", path: null, page: "WhatIfSimulator" },
  { labelKey: "navReports", path: null, page: "FullAnalytics" },
  { labelKey: "navIoT", path: null, page: "IoTNetwork" },
  { labelKey: "navLivePatrolStatus", path: null, page: "LiveCrimePulse" },
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
  const { lang, setLang, t } = useLanguage();

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
        <span>{t("govOfIndia")}</span>
        <span className="opacity-90">{t("bharatSarkar")}</span>
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
              alt={t("nationalCrimeIntelligence")}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {t("crimeDNA")}
            </h1>
            <p className="text-sm font-semibold text-gray-600 truncate">{t("nationalCrimeIntelligence")}</p>
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
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Language toggle: EN | मराठी */}
        <div className="flex-shrink-0 flex items-center gap-1 border rounded-lg overflow-hidden border-gray-300 bg-gray-50">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "px-3 py-2 text-sm font-bold transition-colors",
              lang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            )}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("mr")}
            className={cn(
              "px-3 py-2 text-sm font-bold transition-colors",
              lang === "mr" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            )}
          >
            मराठी
          </button>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>

      {/* Government portal footer */}
      <footer className="flex-shrink-0 border-t border-gray-200 bg-white/90">
        <div className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
          <p>{t("footerCopyright")}</p>
          <p className="mt-1">{t("footerMaintained")}</p>
        </div>
      </footer>
    </div>
  );
}
