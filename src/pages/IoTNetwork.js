// src/pages/IoTNetwork.jsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Share2, Mic, Volume2, Radio, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GOV_NAVY, GOV_PRIMARY_BG, GOV_CARD_BG, GOV_BORDER, GOV_ACCENT_GREEN, GOV_ACCENT_ORANGE } from '@/lib/designTokens';
import { useTranslate } from '@/hooks/useTranslate';
const GUNSHOT_THRESHOLD = 40; // dB threshold for gunshot detection
const ZONE_NAMES = ['Dadar Station', 'Bandra West', 'Colaba Market', 'Fort Area', 'Marine Drive'];
const SENSOR_ZONES = ['D2-D8', 'D9-D14', 'D15-D21', 'D22-D28', 'D29-D35'];
export default function IoTNetwork() {
    const { t } = useTranslate();
    const [alerts, setAlerts] = useState([]);
    const [liveRiskBoost, setLiveRiskBoost] = useState(0);
    const [audioLevel, setAudioLevel] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [micPermission, setMicPermission] = useState(null);
    const [detectionActive, setDetectionActive] = useState(false);
    const [peakLevel, setPeakLevel] = useState(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const animationRef = useRef(null);
    const tinkercadRef = useRef(null);
    const lastDetectionRef = useRef(0);
    // Initialize microphone access and Tinkercad frame reference
    useEffect(() => {
        // Set Tinkercad frame reference
        const timer = setTimeout(() => {
            tinkercadRef.current = document.querySelector('iframe[title="PreCrime IoT Streetlamps"]');
        }, 500);
        return () => {
            clearTimeout(timer);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    const startAudioDetection = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            setMicPermission(true);
            setIsListening(true);
            setDetectionActive(true);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const analyzeAudio = () => {
                analyser.getByteFrequencyData(dataArray);
                // Calculate RMS (root mean square) for actual sound level
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i] * dataArray[i];
                }
                const rms = Math.sqrt(sum / dataArray.length);
                // Convert to dB scale (0-100)
                const db = Math.min(100, Math.round((rms / 255) * 100));
                setAudioLevel(db);
                setPeakLevel(prev => Math.max(prev, db));
                // Auto-detect gunshots when sound exceeds threshold
                if (db > GUNSHOT_THRESHOLD) {
                    const now = Date.now();
                    if (now - lastDetectionRef.current > 2000) {
                        lastDetectionRef.current = now;
                        addGunshotAlert(db);
                    }
                }
                animationRef.current = requestAnimationFrame(analyzeAudio);
            };
            analyzeAudio();
        }
        catch (err) {
            setMicPermission(false);
            setIsListening(false);
        }
    };
    const stopAudioDetection = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setIsListening(false);
        setDetectionActive(false);
        setAudioLevel(0);
        setPeakLevel(0);
    };
    const addGunshotAlert = (soundLevel = null) => {
        const randomZone = ZONE_NAMES[Math.floor(Math.random() * ZONE_NAMES.length)];
        const randomSensor = SENSOR_ZONES[Math.floor(Math.random() * SENSOR_ZONES.length)];
        const confidence = Math.min(99, Math.round(70 + Math.random() * 29));
        const riskBoost = Math.round((soundLevel || 80) / 100 * 50);
        const newAlert = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString('en-IN'),
            type: 'Gunshot Flash Detected',
            sensors: randomSensor,
            piezo: 'D9+ Active',
            zone: randomZone,
            riskBoost: `+${riskBoost}%`,
            confidence: `${confidence}%`,
            soundLevel: soundLevel ? `${Math.round(soundLevel)}dB` : 'N/A'
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 8));
        setLiveRiskBoost(prev => Math.min(prev + riskBoost, 100));
        setDetectionActive(true);
        setTimeout(() => setDetectionActive(false), 5000);
        // Reset boost after 10s
        setTimeout(() => setLiveRiskBoost(prev => Math.max(prev - (riskBoost / 2), 0)), 10000);
        // Trigger Tinkercad buzzer
        triggerTinkercadBuzzer(soundLevel || 80);
    };
    const triggerTinkercadBuzzer = (soundLevel) => {
        try {
            const tinkercadFrame = document.querySelector('iframe[title="PreCrime IoT Streetlamps"]');
            if (tinkercadFrame?.contentWindow) {
                // Send detection signal to Tinkercad circuit
                const detectionData = {
                    type: 'GUNSHOT_DETECTED',
                    command: 'DETECT',
                    soundLevel: Math.round(soundLevel),
                    confidence: Math.round(70 + Math.random() * 29),
                    timestamp: new Date().toISOString(),
                    action: 'TRIGGER_BUZZER'
                };
                // Post message to Tinkercad iframe
                tinkercadFrame.contentWindow.postMessage(detectionData, '*');
                // Also log to console for debugging
                console.log(`🔊 Gunshot Detected → Buzzer Triggered (${soundLevel}dB)`);
            }
        }
        catch (error) {
            console.log('Tinkercad simulation initialized - ready for detections');
        }
    };
    return (_jsx("div", { className: "min-h-screen p-6 md:p-12", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-6 tracking-tight", style: { color: GOV_NAVY }, children: t("iotNetworkTitle") }), _jsx("p", { className: "text-xl font-semibold text-gray-800 max-w-3xl mx-auto leading-relaxed", children: t("iotNetworkSubtitle") })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12", children: [_jsxs(Card, { className: "lg:col-span-1 shadow-lg border-2", style: { background: GOV_CARD_BG, borderColor: GOV_BORDER }, children: [_jsx(CardHeader, { style: { borderLeft: `4px solid ${GOV_PRIMARY_BG}` }, children: _jsxs(CardTitle, { className: "flex items-center text-xl font-bold", style: { color: GOV_NAVY }, children: [_jsx(Mic, { className: `w-7 h-7 mr-3 ${isListening ? 'animate-pulse' : ''}`, style: { color: GOV_PRIMARY_BG } }), t("audioSensor")] }) }), _jsxs(CardContent, { className: "space-y-6 pt-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-base font-bold text-gray-800", children: t("soundLevel") }), _jsxs(Badge, { className: "text-base font-bold", style: { background: GOV_PRIMARY_BG, color: 'white' }, children: [audioLevel, "dB"] })] }), _jsx("div", { className: "relative h-3 bg-gray-200 rounded-full overflow-hidden border", style: { borderColor: GOV_BORDER }, children: _jsx("div", { className: "h-full transition-all duration-100", style: { width: `${Math.min(audioLevel, 100)}%`, background: GOV_PRIMARY_BG } }) }), _jsxs("div", { className: "flex justify-between text-sm font-bold text-gray-700", children: [_jsx("span", { children: "0dB" }), _jsxs("span", { className: audioLevel > GUNSHOT_THRESHOLD ? 'text-red-600' : '', children: [GUNSHOT_THRESHOLD, "dB (", t("threshold") || "Threshold", ")"] }), _jsx("span", { children: "100dB" })] })] }), _jsxs("div", { className: "rounded-lg p-3 border bg-gray-50", style: { borderColor: GOV_BORDER }, children: [_jsx("div", { className: "text-sm font-bold text-gray-700 mb-1", children: t("peakLevel") }), _jsxs("div", { className: "text-2xl font-bold", style: { color: GOV_PRIMARY_BG }, children: [peakLevel, "dB"] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs(Button, { onClick: isListening ? stopAudioDetection : startAudioDetection, size: "lg", className: "w-full font-bold text-base", style: isListening ? { background: '#dc2626', color: 'white' } : { background: GOV_PRIMARY_BG, color: 'white' }, children: [_jsx(Mic, { className: "w-5 h-5 mr-2" }), isListening ? t("stopListening") : t("startDetection")] }), _jsx(Button, { onClick: () => setPeakLevel(0), variant: "outline", size: "sm", className: "w-full font-bold border-2", style: { borderColor: GOV_BORDER, color: GOV_NAVY }, children: t("resetPeak") })] }), micPermission === false && (_jsxs("div", { className: "rounded-lg p-3 text-sm font-bold text-red-700 border-2 border-red-300 bg-red-50", children: ["\u26A0\uFE0F ", t("micAccessDenied")] })), detectionActive && (_jsxs("div", { className: "rounded-lg p-3 text-sm font-bold border-2 bg-blue-50", style: { borderColor: GOV_PRIMARY_BG, color: GOV_NAVY }, children: ["\uD83C\uDF99\uFE0F ", t("liveDetectionActive").replace("{threshold}", GUNSHOT_THRESHOLD)] }))] })] }), _jsxs(Card, { className: "shadow-lg border-2", style: { background: GOV_CARD_BG, borderColor: GOV_BORDER }, children: [_jsx(CardHeader, { style: { borderLeft: `4px solid ${GOV_ACCENT_GREEN}` }, children: _jsxs(CardTitle, { className: "flex items-center text-xl font-bold", style: { color: GOV_NAVY }, children: [_jsx(Radio, { className: `w-7 h-7 mr-3 ${liveRiskBoost > 0 ? 'animate-pulse text-red-600' : ''}`, style: liveRiskBoost > 0 ? {} : { color: GOV_ACCENT_GREEN } }), t("networkStatus")] }) }), _jsxs(CardContent, { className: "space-y-6 pt-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-center", children: [_jsxs("div", { className: "rounded-xl p-4 border-2 bg-gray-50", style: { borderColor: GOV_BORDER }, children: [_jsx("div", { className: "text-3xl font-bold", style: { color: GOV_NAVY }, children: alerts.length }), _jsx("div", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider mt-2", children: t("activeAlerts") })] }), _jsxs("div", { className: `rounded-xl p-4 border-2 ${liveRiskBoost > 50 ? 'bg-red-50 border-red-400' : liveRiskBoost > 20 ? 'bg-amber-50 border-amber-400' : 'bg-green-50'}`, style: liveRiskBoost <= 20 ? { borderColor: GOV_ACCENT_GREEN } : {}, children: [_jsxs("div", { className: `text-3xl font-bold ${liveRiskBoost > 50 ? 'text-red-700' : liveRiskBoost > 20 ? 'text-amber-700' : ''}`, style: liveRiskBoost <= 20 ? { color: GOV_ACCENT_GREEN } : {}, children: [liveRiskBoost, "%"] }), _jsx("div", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider mt-2", children: t("riskBoost") })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-base font-bold text-gray-800", children: t("sensorArrayStatus") }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: [...Array(6)].map((_, i) => (_jsxs("div", { className: `h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${alerts.length > i
                                                            ? 'bg-red-100 border-red-400 text-red-800 animate-pulse'
                                                            : 'bg-green-50 text-gray-800'}`, style: alerts.length > i ? {} : { borderColor: GOV_ACCENT_GREEN }, children: ["S", i + 1] }, i))) })] })] })] }), _jsxs(Card, { className: "shadow-lg border-2", style: { background: GOV_CARD_BG, borderColor: GOV_BORDER }, children: [_jsx(CardHeader, { style: { borderLeft: `4px solid ${GOV_ACCENT_ORANGE}` }, children: _jsxs(CardTitle, { className: "flex items-center text-xl font-bold", style: { color: GOV_NAVY }, children: [_jsx(Volume2, { className: "w-7 h-7 mr-3", style: { color: GOV_ACCENT_ORANGE } }), t("simulationData")] }) }), _jsxs(CardContent, { className: "space-y-6 pt-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-lg p-4 border-2 bg-gray-50", style: { borderColor: GOV_BORDER }, children: [_jsx("div", { className: "text-sm font-bold text-gray-700 mb-2", children: t("detectionThreshold") }), _jsxs("div", { className: "text-2xl font-bold", style: { color: GOV_ACCENT_ORANGE }, children: [GUNSHOT_THRESHOLD, "dB"] }), _jsx("div", { className: "text-sm font-bold text-gray-600 mt-2", children: t("typicalGunshot") })] }), _jsxs("div", { className: "rounded-lg p-4 border-2 bg-gray-50", style: { borderColor: GOV_BORDER }, children: [_jsx("div", { className: "text-sm font-bold text-gray-700 mb-2", children: t("citiesMonitored") }), _jsx("div", { className: "text-2xl font-bold", style: { color: GOV_ACCENT_ORANGE }, children: "29" }), _jsx("div", { className: "text-sm font-bold text-gray-600 mt-2", children: t("acrossIndia") })] }), _jsxs("div", { className: "rounded-lg p-4 border-2 bg-gray-50", style: { borderColor: GOV_BORDER }, children: [_jsx("div", { className: "text-sm font-bold text-gray-700 mb-2", children: t("activeSensorsCount") }), _jsx("div", { className: "text-2xl font-bold", style: { color: GOV_ACCENT_ORANGE }, children: "203" }), _jsx("div", { className: "text-sm font-bold text-gray-600 mt-2", children: t("streetlampsPiezo") })] })] }), _jsx("div", { className: "rounded-lg p-3 border-2 bg-amber-50", style: { borderColor: GOV_ACCENT_ORANGE }, children: _jsxs("div", { className: "text-sm font-bold text-gray-800", children: ["\uD83D\uDCA1 ", _jsxs("strong", { children: [t("tip") || "Tip", ":"] }), " ", t("micDetectionTip")] }) })] })] })] }), _jsxs(Card, { className: "shadow-lg border-2 mb-12", style: { background: GOV_CARD_BG, borderColor: GOV_BORDER }, children: [_jsx(CardHeader, { style: { borderLeft: `4px solid ${GOV_PRIMARY_BG}` }, children: _jsxs(CardTitle, { className: "flex items-center justify-between text-xl font-bold", style: { color: GOV_NAVY }, children: [_jsxs("span", { className: "flex items-center", children: [_jsx(Share2, { className: "w-6 h-6 mr-3", style: { color: GOV_PRIMARY_BG } }), t("liveHardwareSim")] }), _jsx(Badge, { className: "font-bold", style: alerts.length > 0 ? { background: '#dc2626', color: 'white' } : { background: GOV_PRIMARY_BG, color: 'white' }, children: alerts.length > 0 ? `🔊 ${t("buzzerActive")}` : t("streetlampsSensors").replace("{count}", 7) })] }) }), _jsxs(CardContent, { className: "space-y-6 py-8", children: [_jsx("div", { className: "aspect-video w-full rounded-xl border-2 shadow-lg overflow-hidden bg-gray-100", style: { borderColor: GOV_BORDER }, children: _jsx("iframe", { src: "https://www.tinkercad.com/embed/hGeDgJYUcI5-sizzling-jarv?editbtn=1", width: "100%", height: "100%", frameBorder: "0", title: "PreCrime IoT Streetlamps", sandbox: "allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation", allow: "accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; picture-in-picture; microphone", className: "w-full h-full" }) }), _jsxs("div", { className: "rounded-lg p-4 border-2 bg-gray-50", style: { borderColor: GOV_BORDER }, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("span", { className: "text-base font-bold text-gray-800", children: ["\uD83D\uDD34 ", _jsxs("strong", { children: [t("circuitStatus"), ":"] }), " ", alerts.length > 0 ? t("buzzerTriggered").replace("{count}", alerts.length.toString()) : t("monitoringForSounds").replace("{threshold}", GUNSHOT_THRESHOLD.toString())] }) }), alerts.length > 0 && (_jsxs("p", { className: "text-sm font-bold text-gray-600 mt-2", children: [t("lastDetection"), ": ", alerts[0]?.soundLevel, " at ", alerts[0]?.timestamp] }))] })] })] }), _jsxs(Card, { className: "shadow-lg border-2", style: { background: GOV_CARD_BG, borderColor: GOV_BORDER }, children: [_jsx(CardHeader, { style: { borderLeft: '4px solid #dc2626' }, children: _jsxs(CardTitle, { className: "flex items-center justify-between text-xl font-bold", style: { color: GOV_NAVY }, children: [_jsxs("span", { className: "flex items-center", children: [_jsx(AlertCircle, { className: "w-7 h-7 mr-3 text-red-600" }), t("realTimeIncidentLog")] }), _jsxs(Badge, { variant: "outline", className: "text-base font-bold", style: { borderColor: GOV_NAVY, color: GOV_NAVY }, children: [alerts.length, " ", t("activeAlerts")] })] }) }), _jsx(CardContent, { children: alerts.length === 0 ? (_jsxs("div", { className: "text-center py-16 text-gray-600", children: [_jsx(AlertCircle, { className: "w-20 h-20 mx-auto mb-6 opacity-40", style: { color: GOV_NAVY } }), _jsx("p", { className: "text-2xl font-bold text-gray-800", children: t("networkQuiet") }), _jsx("p", { className: "text-lg font-bold mt-2 text-gray-700", children: t("noGunshotRecorded") }), _jsx("p", { className: "text-base font-bold mt-4 text-gray-600", children: t("enableAudioStart") })] })) : (_jsx("div", { className: "space-y-4", children: alerts.map((alert) => (_jsx("div", { className: "rounded-xl p-6 border-2 border-red-200 bg-red-50 hover:shadow-md transition-all", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx(AlertCircle, { className: "w-10 h-10 text-red-600 flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("div", { className: "font-bold text-lg text-gray-900", children: alert.type }), _jsx(Badge, { className: "font-bold bg-red-600 text-white", children: alert.confidence })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-base font-bold text-gray-800", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Radio, { className: "w-4 h-4 mr-2", style: { color: GOV_PRIMARY_BG } }), alert.sensors] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Zap, { className: "w-4 h-4 mr-2 text-amber-600" }), alert.soundLevel] }), _jsxs("div", { className: "flex items-center", children: ["\uD83D\uDCCD ", alert.zone] }), _jsxs("div", { className: "flex items-center text-red-700", children: ["\u26A0\uFE0F ", alert.riskBoost] })] }), _jsxs("div", { className: "text-sm font-bold text-gray-600 mt-2 flex items-center space-x-2", children: [_jsxs("span", { children: ["\uD83D\uDD50 ", alert.timestamp] }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: alert.piezo })] })] })] }) }, alert.id))) })) })] })] }) }));
}
