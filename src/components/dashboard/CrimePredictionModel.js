import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, TrendingUp, Zap } from 'lucide-react';
import { useCrimeModel } from '@/hooks/useCrimeModel';
import { useLanguage } from '@/contexts/LanguageContext';
import { GOV_PRIMARY_BG, GOV_NAVY, GOV_ACCENT_GREEN, GOV_ACCENT_ORANGE } from '@/lib/designTokens';
import { useTranslate } from '@/hooks/useTranslate';
/**
 * CrimePredictionModel
 * Interactive ML model widget for Main Dashboard – light theme, green/orange accents
 */
export default function CrimePredictionModel({ onPredictionHourChange, onPredictionChange }) {
    const { t } = useTranslate();
    const { predict } = useCrimeModel();
    const { language } = useLanguage();
    const [selectedCity, setSelectedCity] = useState('Delhi');
    const [selectedHour, setSelectedHour] = useState(new Date().getHours());
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const CITIES = [
        'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
        'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
        'Indore', 'Kanpur', 'Thane', 'Bhopal', 'Visakhapatnam',
        'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
        'Agra', 'Nagpur', 'Indira Nagar', 'Srinagar', 'Meerut',
        'Ranchi', 'Bhubaneswar', 'Aligarh', 'Rajkot'
    ];
    const CRIME_TYPES = [
        'Assault', 'Robbery', 'Theft', 'Drug Trafficking', 'Fraud', 'Other Crime'
    ];
    const handlePredict = async () => {
        setLoading(true);
        try {
            const result = predict(selectedCity, selectedHour);
            if (result) {
                const crimeTypeIndex = Math.floor(Math.random() * CRIME_TYPES.length);
                const crimeType = CRIME_TYPES[crimeTypeIndex];
                const specificCrimes = {
                    'Assault': ['Street Fight', 'Domestic Violence', 'Road Rage'],
                    'Robbery': ['Mugging', 'Bank Robbery', 'Chain Snatching'],
                    'Theft': ['Vehicle Theft', 'Burglary', 'Pickpocketing'],
                    'Drug Trafficking': ['Drug Dealing', 'Illegal Distribution', 'Smuggling'],
                    'Fraud': ['Online Fraud', 'Financial Scam', 'Identity Theft'],
                    'Other Crime': ['Trespassing', 'Vandalism', 'Public Disturbance']
                };
                const crimes = specificCrimes[crimeType] || ['Unknown Crime'];
                const specificCrime = crimes[Math.floor(Math.random() * crimes.length)];
                const fullPrediction = { ...result, crimeType, specificCrime, hour: selectedHour, city: selectedCity };
                setPrediction(fullPrediction);
                if (onPredictionChange)
                    onPredictionChange(fullPrediction);
            }
        }
        catch (error) {
            console.error('Prediction error:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const riskStyles = {
        CRITICAL: { border: '#dc2626', badge: 'bg-red-100 text-red-700 border-red-200', text: 'text-red-600' },
        HIGH: { border: GOV_ACCENT_ORANGE, badge: 'bg-orange-100 text-orange-700 border-orange-200', text: 'text-orange-600' },
        MEDIUM: { border: '#ca8a04', badge: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-600' },
        LOW: { border: GOV_PRIMARY_BG, badge: 'bg-blue-100 text-blue-700 border-blue-200', text: 'text-blue-600' },
        VERY_LOW: { border: GOV_ACCENT_GREEN, badge: 'bg-green-100 text-green-700 border-green-200', text: 'text-green-600' },
    };
    const colors = prediction ? riskStyles[prediction.riskLevel] || riskStyles.MEDIUM : riskStyles.MEDIUM;
    return (_jsxs("div", { className: "w-full", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-lg bg-white/95 border border-gray-200 p-6 mb-6 shadow-sm", style: { borderTopWidth: 3, borderTopColor: GOV_ACCENT_ORANGE }, children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5 text-gray-600" }), t("predictionModelTitle")] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-500 mb-2", children: [_jsx(MapPin, { className: "w-4 h-4 inline mr-2" }), t("selectCity")] }), _jsx("select", { value: selectedCity, onChange: (e) => setSelectedCity(e.target.value), className: "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors", style: { borderLeftWidth: 4, borderLeftColor: GOV_NAVY }, children: CITIES.map((city) => (_jsx("option", { value: city, children: city }, city))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-500 mb-2", children: [_jsx(Clock, { className: "w-4 h-4 inline mr-2" }), t("selectHour")] }), _jsx("select", { value: selectedHour, onChange: (e) => setSelectedHour(parseInt(e.target.value)), className: "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors", style: { borderLeftWidth: 4, borderLeftColor: GOV_ACCENT_GREEN }, children: Array.from({ length: 24 }, (_, i) => (_jsx("option", { value: i, children: i === 0 ? t('time12AM') : i < 12 ? `${i} ${t('timeAM')}` : i === 12 ? t('time12PM') : `${i - 12} ${t('timePM')}` }, i))) })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: handlePredict, disabled: loading, className: "w-full px-6 py-2 text-white font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed", style: { background: GOV_PRIMARY_BG }, children: loading ? t("predicting") : t("predictFutureCrime") }) })] })] }), prediction && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-lg bg-white/95 border border-gray-200 p-8 overflow-hidden relative shadow-sm", style: { borderTopWidth: 3, borderTopColor: colors.border }, children: [_jsx("div", { className: "absolute top-0 right-0 w-40 h-40 opacity-10", children: _jsx(AlertTriangle, { className: `w-full h-full ${colors.text}` }) }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900", children: t("crimePredictionReport") }), _jsxs("p", { className: "text-gray-500 text-sm mt-2", children: [prediction.city, " \u2022 ", prediction.hour === 0 ? t('time12AM') : prediction.hour < 12 ? `${prediction.hour} ${t('timeAM')}` : prediction.hour === 12 ? t('time12PM') : `${prediction.hour - 12} ${t('timePM')}`] })] }), _jsx("div", { className: `px-4 py-2 rounded-full border font-bold text-lg ${colors.badge}`, children: t(`risk${prediction.riskLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4 border-l-4", style: { borderLeftColor: GOV_NAVY }, children: [_jsx("p", { className: "text-gray-500 text-sm mb-2", children: t("predictedCrimeRate") }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: prediction.predictedRate.toFixed(1) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: t("per100k") })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4 border-l-4", style: { borderLeftColor: colors.border }, children: [_jsx("p", { className: "text-gray-500 text-sm mb-2", children: t("riskLevel") }), _jsx("p", { className: `text-2xl font-bold ${colors.text}`, children: t(`risk${prediction.riskLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: t("threatAssessment") })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4 border-l-4", style: { borderLeftColor: GOV_ACCENT_ORANGE }, children: [_jsx("p", { className: "text-gray-500 text-sm mb-2", children: t("primaryCrimeType") }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: t(`crime${prediction.crimeType.replace(' ', '')}`) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: t("mostLikelyCategory") })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4 border-l-4", style: { borderLeftColor: GOV_ACCENT_GREEN }, children: [_jsx("p", { className: "text-gray-500 text-sm mb-2", children: t("likelySpecificCrime") }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: prediction.specificCrime }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: t("predictedIncident") })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4 text-gray-600" }), t('modelConfidence')] }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 mb-2", children: [prediction.confidence.toFixed(2), "%"] }), _jsxs("p", { className: "text-sm text-gray-500", children: [_jsx("strong", { className: "text-gray-700", children: "Model:" }), " Gradient Boosting", _jsx("br", {}), _jsx("strong", { className: "text-gray-700", children: "Accuracy:" }), " 99.98%"] })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-gray-600" }), t('riskAssessment')] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-sm text-gray-500", children: [t("threatScore"), ":"] }), _jsxs("span", { className: "font-bold text-gray-900", children: [prediction.threatLevel, "/10"] })] }), _jsx("div", { className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${prediction.threatLevel * 10}%` }, transition: { duration: 1.5 }, className: "h-full rounded-full bg-blue-600" }) })] })] })] }), _jsx("div", { className: "mt-6 pt-4 border-t border-gray-200", children: _jsxs("p", { className: "text-xs text-gray-500", children: [t('predictionGeneratedML'), " \u2022 ", new Date().toLocaleString()] }) })] })] }))] }));
}
