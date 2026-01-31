import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Shield, Lightbulb, Lock, Users, ArrowRight, RotateCcw, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslate } from "@/hooks/useTranslate";
import { predictScenario, CITY_BASE_RATES } from "@/utils/crimeModelService";
import crimeModelService from "@/utils/crimeModelService";
// Dashboard cities (same as used in IndiaMap2D component)
const DASHBOARD_CITIES = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];
// Create zones from dashboard cities only
const createZonesFromCities = () => {
    console.log('Creating zones...');
    console.log('DASHBOARD_CITIES:', DASHBOARD_CITIES);
    console.log('CITY_BASE_RATES:', CITY_BASE_RATES);
    try {
        return DASHBOARD_CITIES.map((city, index) => {
            const baseRate = crimeModelService.CITY_BASE_RATES[city] || 100; // fallback
            console.log(`City ${city}: baseRate = ${baseRate}`);
            return {
                id: index + 1,
                name: city,
                baseRisk: Math.round(baseRate),
                riskLevel: 'MEDIUM' // fallback
            };
        });
    }
    catch (error) {
        console.error('Error creating zones:', error);
        return [{
                id: 1,
                name: 'Delhi',
                baseRisk: 543,
                riskLevel: 'CRITICAL'
            }];
    }
};
const zones = createZonesFromCities();
const interventions = [
    { id: "patrols", key: "policePatrols", icon: Shield, maxValue: 10, unit: "teams", descKey: "patrolsDesc" },
    { id: "lighting", key: "streetLighting", icon: Lightbulb, maxValue: 10, unit: "sites", descKey: "lightingDesc" },
    { id: "access", key: "accessControl", icon: Lock, maxValue: 10, unit: "points", descKey: "accessDesc" },
    { id: "community", key: "communityPrograms", icon: Users, maxValue: 10, unit: "initiatives", descKey: "communityDesc" }
];
const HeatmapGrid = ({ prediction, label }) => {
    const { t } = useTranslate();
    if (!prediction)
        return null;
    const riskScore = prediction.riskScore * 100;
    const cells = [];
    for (let i = 0; i < 64; i++) {
        const cellRisk = riskScore - 15 + Math.random() * 30;
        const normalizedRisk = Math.max(0, Math.min(100, cellRisk));
        cells.push(normalizedRisk);
    }
    return (_jsxs("div", { className: "p-4 rounded-lg bg-white/95 border border-gray-200", children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider mb-3", children: t(label) }), _jsx("div", { className: "grid grid-cols-8 gap-1 mb-3", children: cells.map((cellRisk, i) => (_jsx(motion.div, { className: "aspect-square rounded", initial: { opacity: 0 }, animate: {
                        opacity: 1,
                        backgroundColor: cellRisk >= 70 ? `rgba(239, 68, 68, ${cellRisk / 100})` :
                            cellRisk >= 50 ? `rgba(249, 115, 22, ${cellRisk / 100})` :
                                cellRisk >= 30 ? `rgba(234, 179, 8, ${cellRisk / 100})` :
                                    `rgba(34, 197, 94, ${cellRisk / 100})`
                    }, transition: { delay: i * 0.01 } }, i))) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-2xl font-bold text-gray-900", children: Math.round(prediction.predictedRate) }), _jsx("span", { className: "text-xs text-gray-500", children: t("predictedCrimes") })] }), _jsxs("div", { className: "mt-2 text-xs text-gray-500", children: [t("riskLevel"), ": ", _jsx("span", { className: `font-medium ${prediction.riskLevel === 'CRITICAL' ? 'text-red-400' :
                            prediction.riskLevel === 'HIGH' ? 'text-orange-400' :
                                prediction.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                                    prediction.riskLevel === 'LOW' ? 'text-blue-400' : 'text-green-400'}`, children: t(`risk${prediction.riskLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`) })] })] }));
};
export default function WhatIfSimulator() {
    const { t } = useTranslate();
    console.log('WhatIfSimulator rendering...');
    console.log('zones:', zones);
    console.log('zones[0]:', zones[0]);
    const [selectedZone, setSelectedZone] = useState(zones[0] || { name: 'Delhi', baseRisk: 543, riskLevel: 'CRITICAL' });
    console.log('selectedZone:', selectedZone);
    const [interventionValues, setInterventionValues] = useState({
        patrols: 0,
        lighting: 0,
        access: 0,
        community: 0
    });
    const [isSimulating, setIsSimulating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [basePrediction, setBasePrediction] = useState(null);
    const [projectedPrediction, setProjectedPrediction] = useState(null);
    // Get base prediction for selected zone
    useEffect(() => {
        try {
            const basePred = predictScenario(selectedZone.name, new Date().getHours(), {}, 'gradientBoosting');
            // Check if it's an error response
            if (basePred && basePred.error) {
                console.error('Prediction error:', basePred.error);
                // Fallback prediction
                setBasePrediction({
                    city: selectedZone.name,
                    predictedRate: selectedZone.baseRisk,
                    riskLevel: selectedZone.riskLevel,
                    model: 'gradientBoosting',
                    accuracy: 85
                });
            }
            else {
                setBasePrediction(basePred);
            }
        }
        catch (error) {
            console.error('Error getting base prediction:', error);
            // Fallback prediction
            setBasePrediction({
                city: selectedZone.name,
                predictedRate: selectedZone.baseRisk,
                riskLevel: selectedZone.riskLevel,
                model: 'gradientBoosting',
                accuracy: 85
            });
        }
        setProjectedPrediction(null);
        setShowResults(false);
    }, [selectedZone]);
    // Calculate projected risk with interventions
    useEffect(() => {
        if (Object.values(interventionValues).some(v => v > 0)) {
            const projectedPred = predictScenario(selectedZone.name, new Date().getHours(), interventionValues, 'gradientBoosting');
            setProjectedPrediction(projectedPred);
        }
        else {
            setProjectedPrediction(null);
        }
    }, [interventionValues, selectedZone]);
    const currentRisk = projectedPrediction ? projectedPrediction.predictedRate : (basePrediction?.predictedRate || 0);
    const baseRisk = basePrediction?.predictedRate || 0;
    const riskReduction = baseRisk - currentRisk;
    const riskReductionPercent = baseRisk > 0 ? (riskReduction / baseRisk) * 100 : 0;
    const handleSimulate = () => {
        setIsSimulating(true);
        // Simulate real ML processing time
        setTimeout(() => {
            setIsSimulating(false);
            setShowResults(true);
        }, 1500);
    };
    const handleReset = () => {
        setInterventionValues({ patrols: 0, lighting: 0, access: 0, community: 0 });
        setProjectedPrediction(null);
        setShowResults(false);
    };
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-white/95 border border-gray-200 border-l-4", style: { borderLeftColor: "#ea580c" }, children: _jsx(FlaskConical, { className: "w-6 h-6 text-gray-700" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: t("navScenarioPlanning") }), _jsx("p", { className: "text-gray-500 text-sm", children: t("scenarioSubtitle") })] })] }), _jsxs(Select, { value: selectedZone.name, onValueChange: (v) => {
                            setSelectedZone(zones.find(z => z.name === v));
                            setShowResults(false);
                        }, children: [_jsx(SelectTrigger, { className: "w-64 bg-white/95 border-gray-200", children: _jsx(SelectValue, { placeholder: t('selectCityPlaceholder') }) }), _jsx(SelectContent, { children: zones.map(zone => (_jsxs(SelectItem, { value: zone.name, children: [zone.name, " (", zone.riskLevel, " - ", zone.baseRisk, " crimes)"] }, zone.id))) })] })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [_jsxs("div", { className: "rounded-lg bg-white/95 border border-gray-200 overflow-hidden", style: { borderTopWidth: 3, borderTopColor: "#2563eb" }, children: [_jsxs("div", { className: "p-4 border-b border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: t("navPreventionStrategies") }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: t("scenarioSubtitle") })] }), _jsxs("div", { className: "p-6 space-y-6", children: [interventions.map((int) => (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(int.icon, { className: "w-4 h-4 text-gray-600" }), _jsx("span", { className: "font-medium text-gray-900 text-sm", children: t(int.key) })] }), _jsxs("span", { className: "text-sm text-gray-500", children: [interventionValues[int.id], " ", t(int.unit)] })] }), _jsx(Slider, { value: [interventionValues[int.id]], onValueChange: (v) => {
                                                    setInterventionValues(prev => ({ ...prev, [int.id]: v[0] }));
                                                    setShowResults(false);
                                                }, max: int.maxValue, step: 1, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsxs("span", { children: ["0 ", t(int.unit)] }), _jsxs("span", { className: "font-medium text-gray-700", children: [interventionValues[int.id], " ", t(int.unit)] }), _jsxs("span", { children: [int.maxValue, " ", t(int.unit)] })] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: t(int.descKey) })] }, int.id))), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { onClick: handleSimulate, disabled: isSimulating, className: "flex-1", children: isSimulating ? (_jsxs(_Fragment, { children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" }, children: _jsx(RotateCcw, { className: "w-4 h-4 mr-2" }) }), t("analyzing")] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: "w-4 h-4 mr-2" }), t("testStrategy")] })) }), _jsx(Button, { variant: "outline", onClick: handleReset, className: "border-gray-300 hover:bg-gray-100 text-gray-700", children: _jsx(RotateCcw, { className: "w-4 h-4" }) })] })] })] }), _jsxs("div", { className: "rounded-lg bg-white/95 border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-200", style: { borderTopWidth: 3, borderTopColor: "#138808" }, children: [_jsx("h3", { className: "font-semibold text-gray-900", children: t("impactAnalysis") }), _jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [selectedZone.name, " - ", t("beforeVsAfter")] })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsx(HeatmapGrid, { prediction: basePrediction, label: "currentState" }), _jsx(HeatmapGrid, { prediction: projectedPrediction || basePrediction, label: "projectedState" })] }), _jsxs("div", { className: "flex items-center justify-center gap-4 p-4 rounded-lg bg-white/95 border border-gray-200", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-red-600", children: Math.round(baseRisk) }), _jsx("p", { className: "text-xs text-gray-500", children: t('currentCrimes') })] }), _jsx(ArrowRight, { className: "w-8 h-8 text-gray-500" }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-green-400", children: Math.round(currentRisk) }), _jsx("p", { className: "text-xs text-gray-500", children: t("projectedState") })] }), _jsxs("div", { className: "pl-4 border-l border-gray-200", children: [_jsxs("p", { className: `text-2xl font-bold ${riskReduction > 0 ? "text-green-600" : "text-red-600"}`, children: [riskReduction > 0 ? "-" : "+", Math.abs(Math.round(riskReduction))] }), _jsx("p", { className: "text-xs text-gray-500", children: t("crimeReduction") }), _jsxs("p", { className: "text-xs text-gray-500", children: ["(", riskReductionPercent > 0 ? "-" : "+", Math.abs(Math.round(riskReductionPercent)), "%) "] })] })] }), showResults && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-4 p-4 rounded-lg bg-green-50 border border-green-200", children: _jsxs("p", { className: "text-sm text-green-800", children: [_jsxs("strong", { children: [t("strategyAnalysisComplete"), ":"] }), " ", t("strategyReport")
                                                    .replace("{city}", selectedZone.name)
                                                    .replace("{reduction}", Math.round(riskReduction).toString())
                                                    .replace("{percent}", Math.round(riskReductionPercent).toString())
                                                    .replace("{from}", t(`risk${basePrediction?.riskLevel?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`))
                                                    .replace("{to}", t(`risk${projectedPrediction?.riskLevel?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`)), _jsx("br", {}), _jsx("span", { className: "text-xs text-gray-500 mt-1 block", children: t("basedOnPatterns") })] }) }))] })] })] })] }));
}
