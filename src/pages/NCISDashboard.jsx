import { useState } from "react";
import { Fingerprint, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import NCISPatternCluster from "@/components/crimedna/NCISPatternCluster";
import usePatternDetection from "@/hooks/usePatternDetection";
import { useLanguage } from "@/contexts/LanguageContext";
import { GOV_SAFFRON, GOV_GREEN, GOV_NAVY, GOV_PRIMARY_BG } from "@/lib/designTokens";
import { useTranslate } from "@/hooks/useTranslate";

export default function NCISDashboard() {
  const { t } = useTranslate();
  const [selectedPattern, setSelectedPattern] = useState(null);
  const {
    patterns,
    connections,
    loading,
    error,
    refreshPatterns,
    statistics,
  } = usePatternDetection();

  const stats = {
    totalPatterns: statistics?.totalPatterns ?? 0,
    crimeTypes: statistics?.uniqueCrimeTypes ?? 0,
    avgSimilarity: statistics?.avgSimilarity ?? 0,
    clusters: statistics?.clusters ?? 0,
  };

  const SAFFRON = GOV_SAFFRON;
  const GREEN = GOV_GREEN;
  const NAVY = GOV_NAVY;

  return (
    <div className="space-y-6">
      {/* Refresh + Top metrics – four rectangular stat cards (Indian flag accents) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-w-0">
          <div className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4" style={{ borderLeftColor: NAVY }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("totalPatterns")}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPatterns}</p>
          </div>
          <div className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4" style={{ borderLeftColor: GREEN }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("crimeTypes")}</p>
            <p className="text-2xl font-bold" style={{ color: GREEN }}>{stats.crimeTypes}</p>
          </div>
          <div className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4" style={{ borderLeftColor: SAFFRON }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("avgSimilarity")}</p>
            <p className="text-2xl font-bold" style={{ color: "#b45309" }}>{stats.avgSimilarity}%</p>
          </div>
          <div className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4" style={{ borderLeftColor: NAVY }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("clusters")}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.clusters}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={refreshPatterns}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
          style={{ background: GOV_PRIMARY_BG }}
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          {t("refresh")}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Main area: visualization + right panel */}
      <div className="flex gap-6 min-h-0">
        {/* Crime pattern cluster visualization */}
        <div className="flex-1 min-w-0 flex flex-col bg-white/95 border rounded-lg shadow-sm overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "#e5e7eb", borderTopWidth: 3, borderTopColor: NAVY }}>
            <h2 className="font-semibold text-gray-900">{t("crimePatternClusterVisualization")}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading
                ? t("loading")
                : `${patterns.length} ${t("patternsDetected")}`}
            </p>
          </div>
          <div className="flex-1 p-4 min-h-[420px]">
            {!loading && patterns.length > 0 ? (
              <NCISPatternCluster
                patterns={patterns}
                connections={connections}
                onPatternSelect={setSelectedPattern}
                selectedPattern={selectedPattern}
              />
            ) : loading ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm">{t("analyzingCrimePatterns")}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p className="text-sm">{t("noPatternsDetected")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right-side Pattern Analysis panel */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white/95 border rounded-lg shadow-sm overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "#e5e7eb", borderTopWidth: 3, borderTopColor: GREEN }}>
            <h2 className="font-semibold text-gray-900">{t("patternAnalysis")}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{t("mlDetectedPatternDetails")}</p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedPattern ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/80">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("patternId")}</p>
                  <p className="font-semibold text-gray-900">{selectedPattern.id}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/80">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("similarity")}</p>
                  <p className="font-semibold" style={{ color: NAVY }}>{selectedPattern.similarity}%</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/80">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("crimeTypes")}</p>
                  <p className="font-semibold text-gray-900">{selectedPattern.type}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/80">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("peakHour")}</p>
                  <p className="font-semibold text-gray-900">
                    {String(selectedPattern.hour).padStart(2, "0")}:00
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/80">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("crimeDensity")}</p>
                  <p className="font-semibold text-gray-900">
                    {Math.round(selectedPattern.density)}%
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/80">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("severity")}</p>
                  <p className="font-semibold text-gray-900">
                    {Math.round(selectedPattern.severity)}/100
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/80">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("primaryZone")}</p>
                  <p className="font-semibold text-gray-900">{selectedPattern.zone}</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-gray-500 text-sm">
                <Fingerprint className="w-10 h-10 mb-2 opacity-40" />
                <p>{t("selectPatternNode")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
