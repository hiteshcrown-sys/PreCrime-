import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Fingerprint,
  Activity,
  BookOpen,
  Brain,
  FlaskConical,
  Radio,
  Menu,
  X,
  Shield,
  Bell,
  MapPin
} from "lucide-react";
import { useCity } from "./contexts/CityContext";
import { CITY_BASE_RATES } from "./utils/crimeModelService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navItems = [
  { name: "Main Dashboard", icon: LayoutDashboard, page: "MainDashboard" },
  { name: "Crime DNA™", icon: Fingerprint, page: "CrimeDNA" },
  { name: "Prevention Playbooks™", icon: BookOpen, page: "PreventionPlaybooks" },
  { name: "Scenario Simulator", icon: FlaskConical, page: "WhatIfSimulator" },
  { name: "Full Analytics", icon: Activity, page: "FullAnalytics" },
  { name: "Live Crime Pulse", icon: Radio, page: "LiveCrimePulse" },
  { name: "IoT Network", icon: Activity, page: "IoTNetwork" },     // New!
  { name: "Alerts", icon: Bell, page: "IoTAlerts" }  
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedCity, setSelectedCity } = useCity();
  const cities = Object.keys(CITY_BASE_RATES);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d1320] border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-cyan-400" />
          <span className="font-bold text-lg">PRECRIME</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#0d1320] z-40 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  currentPageName === item.page
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[#0d1320] border-r border-slate-800 z-40 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
          <div className="relative">
            <Shield className="w-8 h-8 text-cyan-400" />
            <motion.div
              className="absolute inset-0 rounded-full bg-cyan-400/20"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg tracking-tight">PRECRIME</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">India Intelligence</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                currentPageName === item.page
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                currentPageName === item.page ? "text-cyan-400" : "group-hover:text-cyan-400"
              )} />
              {sidebarOpen && (
                <span className="font-medium text-sm truncate">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "min-h-screen transition-all duration-300 pt-16 lg:pt-0",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Top bar */}
        <div className="hidden lg:flex h-16 items-center justify-between px-6 bg-[#0d1320]/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px] h-8 bg-transparent border-none text-white focus:ring-0 p-0">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1320] border-slate-700 text-white z-[9999]">
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="h-8 w-px bg-slate-800 mx-2" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-400">System Online</span>
            </div>

            <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}