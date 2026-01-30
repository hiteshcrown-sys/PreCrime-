/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AITransparencyHub from './pages/AITransparencyHub';
import CommandCenter from './pages/CommandCenter';
import CrimeDNA from './pages/CrimeDNA';
import CrimeIntelligence from './pages/CrimeIntelligence';
import ExplainableAI from './pages/ExplainableAI';
import FairnessDashboard from './pages/FairnessDashboard';
import FullAnalytics from './pages/FullAnalytics';
import HotspotIntelligence from './pages/HotspotIntelligence';
import InterventionTracker from './pages/InterventionTracker';
import LiveCrimePulse from './pages/LiveCrimePulse';
import MainDashboard from './pages/MainDashboard';
import ModelPerformance from './pages/ModelPerformance';
import Nowcasting from './pages/Nowcasting';
import PreventionPlaybooks from './pages/PreventionPlaybooks';
import TemporalAnalytics from './pages/TemporalAnalytics';
import WhatIfSimulator from './pages/WhatIfSimulator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AITransparencyHub": AITransparencyHub,
    "CommandCenter": CommandCenter,
    "CrimeDNA": CrimeDNA,
    "CrimeIntelligence": CrimeIntelligence,
    "ExplainableAI": ExplainableAI,
    "FairnessDashboard": FairnessDashboard,
    "FullAnalytics": FullAnalytics,
    "HotspotIntelligence": HotspotIntelligence,
    "InterventionTracker": InterventionTracker,
    "LiveCrimePulse": LiveCrimePulse,
    "MainDashboard": MainDashboard,
    "ModelPerformance": ModelPerformance,
    "Nowcasting": Nowcasting,
    "PreventionPlaybooks": PreventionPlaybooks,
    "TemporalAnalytics": TemporalAnalytics,
    "WhatIfSimulator": WhatIfSimulator,
}

export const pagesConfig = {
    mainPage: "CommandCenter",
    Pages: PAGES,
    Layout: __Layout,
};