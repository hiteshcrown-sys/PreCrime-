import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Shield, Building2, MapPin, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { mlService } from "@/api/mlService";
import { Loader2 } from "lucide-react";
import { CITY_BASE_RATES } from "@/utils/crimeModelService";
import { GOV_ACCENT_GREEN, GOV_ACCENT_ORANGE, GOV_NAVY, GOV_PRIMARY_BG } from "@/lib/designTokens";
import { useTranslate } from "@/hooks/useTranslate";

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const cities = Object.keys(CITY_BASE_RATES);
const roleIcons = { police: Shield, authorities: Building2 };

const translateRecommendation = (rec, t) => {
  const mapping = {
    "Deploy maximum police presence in high-risk zones": "recDeployMaxPolice",
    "Implement 24/7 armed patrols": "recArmedPatrols",
    "Set up temporary checkpoints": "recTempCheckpoints",
    "Increase surveillance camera monitoring": "recCCTVSurveillance",
    "Coordinate with local authorities for emergency response": "recCoordAuthorities",
    "Increase police patrols during peak hours": "recPeakHourPatrols",
    "Enhance street lighting in vulnerable areas": "recStreetLighting",
    "Deploy additional security personnel": "recAddSecurity",
    "Monitor CCTV feeds continuously": "recMonitorCCTV",
    "Conduct community safety awareness programs": "recCommunitySafety",
    "Maintain regular police presence": "recRegularPresence",
    "Conduct routine security checks": "recRoutineChecks",
    "Improve community community policing initiatives": "recCommunityPolicing",
    "Monitor crime trends regularly": "recMonitorTrends",
    "Enhance public safety infrastructure": "recEnhanceInfra",
    "Continue standard policing procedures": "recStandardProcedures",
    "Focus on preventive measures": "recPreventiveMeasures",
    "Maintain community relations": "recCommunityRelations",
    "Regular safety inspections": "recSafetyInspections",
    "Maintain minimal security presence": "recMinimalSecurity",
    "Focus on general public safety": "recGeneralPublicSafety",
    "Conduct occasional safety audits": "recSafetyAudits",
    "Increase foot patrols in this area": "recFootPatrols",
    "Install additional CCTV cameras": "recInstallCCTV",
    "Enhance street lighting": "recStreetLightingHotspot",
    "Set up community watch programs": "recCommunityWatch",
    "Deploy mobile police units": "recMobileUnits",
    "Conduct regular security sweeps": "recSecuritySweeps",
    "Improve emergency response times": "recEmergencyResponse",
    "Coordinate with local businesses for security": "recCoordBusinesses"
  };

  const key = mapping[rec];
  return key ? t(key) : rec;
};

function ActionCard({ action, selectedCity }) {
  const { t } = useTranslate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-4 rounded-lg bg-white/95 border border-gray-200 shadow-sm hover:border-gray-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
            {translateRecommendation(action.title || action.description, t)}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{action.zone}</span>
            <span className="text-gray-400">•</span>
            <Clock className="w-3 h-3" />
            <span>{action.duration}</span>
          </div>
        </div>
        <Badge className={`${priorityColors[action.priority]} border text-xs`}>
          {action.priority === "high" ? t("highPriority") : action.priority === "medium" ? t("riskMedium") : t("riskLow")}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {action.descTemplate
          ? t("mlInterventionDesc")
            .replace("{city}", selectedCity)
            .replace("{riskLevel}", t(`risk${action.riskLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`))
          : translateRecommendation(action.description, t)}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{t("effectiveness")}:</span>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${action.effectiveness}%`, background: GOV_PRIMARY_BG }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700">{action.effectiveness}%</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
      </div>
    </motion.div>
  );
}

export default function PreventionPlaybooks() {
  const { t } = useTranslate();
  const [activeRole, setActiveRole] = useState("police");
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [playbooks, setPlaybooks] = useState({ police: [], authorities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const fetchMLData = async () => {
    try {
      const pred = await mlService.fetchLivePrediction(selectedCity);
      setPrediction(pred);
      const actions = await mlService.fetchPreventionActions(selectedCity, pred.riskLevel || "MEDIUM");
      setPlaybooks(actions);
      setError(null);
    } catch (err) {
      console.error("Failed to load ML playbooks:", err);
      setError("Failed to sync with ML API. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMLData();
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(() => fetchMLData(), 10000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  return (
    <div className="space-y-6">
      {/* Top metric cards – same style as Crime Pattern Analysis */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4"
          style={{ borderLeftColor: GOV_NAVY }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("navPreventionStrategies")}</p>
          <p className="text-2xl font-bold text-gray-900">{t("livePlaybooks")}</p>
        </div>
        <div
          className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4"
          style={{ borderLeftColor: GOV_ACCENT_GREEN }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("city")}</p>
          <p className="text-2xl font-bold text-gray-900">{selectedCity}</p>
        </div>
        <div
          className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4"
          style={{ borderLeftColor: GOV_ACCENT_ORANGE }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("riskLevel")}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prediction?.riskLevel ? t(`risk${prediction.riskLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`) : "N/A"}
          </p>
        </div>
        <div
          className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4"
          style={{ borderLeftColor: GOV_NAVY }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("actionsCount")}</p>
          <p className="text-2xl font-bold text-gray-900">
            {playbooks.police.length + playbooks.authorities.length}
          </p>
        </div>
      </div>

      {/* Header + city selector – primary button style */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/95 border border-gray-200" style={{ borderLeftColor: GOV_ACCENT_ORANGE, borderLeftWidth: 4 }}>
            <BookOpen className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{t("navPreventionStrategies")}</h1>
            <p className="text-sm text-gray-500">{t("preventionSubtitle")}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 border border-gray-200">
            <MapPin className="w-4 h-4 text-gray-600" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none text-sm text-gray-900 focus:ring-0 cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 border border-gray-200" style={{ borderLeftColor: GOV_ACCENT_ORANGE, borderLeftWidth: 4 }}>
            <AlertTriangle className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              {playbooks.police.length + playbooks.authorities.length} {t("actionsRecommended")}
            </span>
          </div>
        </div>
      </div>

      {loading && !playbooks.police.length ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white/95 border rounded-lg border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" style={{ color: GOV_PRIMARY_BG }} />
          <p className="text-gray-500">{t("fetchingPredictions")}</p>
        </div>
      ) : error && !playbooks.police.length ? (
        <div className="p-8 rounded-lg bg-red-50 border border-red-200 text-center">
          <p className="text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchMLData}
            className="mt-4 px-4 py-2 rounded-md text-white text-sm font-medium hover:opacity-90"
            style={{ background: GOV_PRIMARY_BG }}
          >
            {t("retryConnection")}
          </button>
        </div>
      ) : (
        <>
          <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
            <TabsList className="w-full justify-start bg-white/95 border border-gray-200 p-1 h-auto flex-wrap">
              <TabsTrigger
                value="police"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 px-4 py-2 text-gray-600"
              >
                <Shield className="w-4 h-4" />
                {t("policeOperations")}
              </TabsTrigger>
              <TabsTrigger
                value="authorities"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 px-4 py-2 text-gray-600"
              >
                <Building2 className="w-4 h-4" />
                {t("cityAuthorities")}
              </TabsTrigger>
            </TabsList>

            {Object.entries(playbooks).map(([role, actions]) => (
              <TabsContent key={role} value={role} className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {actions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ActionCard action={action} selectedCity={selectedCity} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {playbooks.police.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4" style={{ borderLeftColor: "#dc2626" }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("highPriority")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...playbooks.police, ...playbooks.authorities].filter((a) => a.priority === "high").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t("immediateAttention")}</p>
              </div>
              <div className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4" style={{ borderLeftColor: GOV_ACCENT_ORANGE }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("currentRisk")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prediction?.riskLevel ? t(`risk${prediction.riskLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`) : "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t("mlPredictionFor").replace("{city}", selectedCity)}</p>
              </div>
              <div className="bg-white/95 border rounded-lg p-4 shadow-sm border-l-4" style={{ borderLeftColor: GOV_ACCENT_GREEN }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("avgEffectiveness")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const all = [...playbooks.police, ...playbooks.authorities];
                    const avg = all.length ? all.reduce((acc, curr) => acc + curr.effectiveness, 0) / all.length : 0;
                    return Math.round(avg) + "%";
                  })()}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t("historicalOutcomes")}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
