// src/pages/IoTNetwork.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Share2, Mic, Volume2, Radio, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GOV_NAVY, GOV_PRIMARY_BG, GOV_CARD_BG, GOV_BORDER, GOV_ACCENT_GREEN, GOV_ACCENT_ORANGE } from '@/lib/designTokens';
<<<<<<< HEAD
import { useTranslate } from '@/hooks/useTranslate';
=======
import { useLanguage } from '@/contexts/LanguageContext';
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0

const GUNSHOT_THRESHOLD = 40; // dB threshold for gunshot detection
const ZONE_NAMES = ['Dadar Station', 'Bandra West', 'Colaba Market', 'Fort Area', 'Marine Drive'];
const SENSOR_ZONES = ['D2-D8', 'D9-D14', 'D15-D21', 'D22-D28', 'D29-D35'];

export default function IoTNetwork() {
<<<<<<< HEAD
  const { t } = useTranslate();
=======
  const { t } = useLanguage();
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
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
    } catch (err) {
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
    } catch (error) {
      console.log('Tinkercad simulation initialized - ready for detections');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header – theme-aligned */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: GOV_NAVY }}>
<<<<<<< HEAD
            {t("iotNetworkTitle")}
          </h1>
          <p className="text-xl font-semibold text-gray-800 max-w-3xl mx-auto leading-relaxed">
            {t("iotNetworkSubtitle")}
=======
            🛰️ {t('liveIoTNetwork')}
          </h1>
          <p className="text-xl font-semibold text-gray-800 max-w-3xl mx-auto leading-relaxed">
            {t('iotSubtitle')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Audio Detection Panel */}
          <Card className="lg:col-span-1 shadow-lg border-2" style={{ background: GOV_CARD_BG, borderColor: GOV_BORDER }}>
            <CardHeader style={{ borderLeft: `4px solid ${GOV_PRIMARY_BG}` }}>
              <CardTitle className="flex items-center text-xl font-bold" style={{ color: GOV_NAVY }}>
                <Mic className={`w-7 h-7 mr-3 ${isListening ? 'animate-pulse' : ''}`} style={{ color: GOV_PRIMARY_BG }} />
<<<<<<< HEAD
                {t("audioSensor")}
=======
                {t('audioSensor')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
<<<<<<< HEAD
                  <span className="text-base font-bold text-gray-800">{t("soundLevel")}</span>
=======
                  <span className="text-base font-bold text-gray-800">{t('soundLevel')}</span>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                  <Badge className="text-base font-bold" style={{ background: GOV_PRIMARY_BG, color: 'white' }}>
                    {audioLevel}dB
                  </Badge>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden border" style={{ borderColor: GOV_BORDER }}>
                  <div
                    className="h-full transition-all duration-100"
                    style={{ width: `${Math.min(audioLevel, 100)}%`, background: GOV_PRIMARY_BG }}
                  />
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-700">
                  <span>0dB</span>
                  <span className={audioLevel > GUNSHOT_THRESHOLD ? 'text-red-600' : ''}>
                    {GUNSHOT_THRESHOLD}dB ({t("threshold") || "Threshold"})
                  </span>
                  <span>100dB</span>
                </div>
              </div>

              <div className="rounded-lg p-3 border bg-gray-50" style={{ borderColor: GOV_BORDER }}>
<<<<<<< HEAD
                <div className="text-sm font-bold text-gray-700 mb-1">{t("peakLevel")}</div>
=======
                <div className="text-sm font-bold text-gray-700 mb-1">{t('peakLevel')}</div>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                <div className="text-2xl font-bold" style={{ color: GOV_PRIMARY_BG }}>{peakLevel}dB</div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={isListening ? stopAudioDetection : startAudioDetection}
                  size="lg"
                  className="w-full font-bold text-base"
                  style={isListening ? { background: '#dc2626', color: 'white' } : { background: GOV_PRIMARY_BG, color: 'white' }}
                >
                  <Mic className="w-5 h-5 mr-2" />
<<<<<<< HEAD
                  {isListening ? t("stopListening") : t("startDetection")}
=======
                  {isListening ? t('stopListening') : t('startDetection')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                </Button>
                <Button
                  onClick={() => setPeakLevel(0)}
                  variant="outline"
                  size="sm"
                  className="w-full font-bold border-2"
                  style={{ borderColor: GOV_BORDER, color: GOV_NAVY }}
                >
<<<<<<< HEAD
                  {t("resetPeak")}
=======
                  {t('resetPeak')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                </Button>
              </div>

              {micPermission === false && (
                <div className="rounded-lg p-3 text-sm font-bold text-red-700 border-2 border-red-300 bg-red-50">
                  ⚠️ {t("micAccessDenied")}
                </div>
              )}

              {detectionActive && (
                <div className="rounded-lg p-3 text-sm font-bold border-2 bg-blue-50" style={{ borderColor: GOV_PRIMARY_BG, color: GOV_NAVY }}>
                  🎙️ {t("liveDetectionActive").replace("{threshold}", GUNSHOT_THRESHOLD)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card className="shadow-lg border-2" style={{ background: GOV_CARD_BG, borderColor: GOV_BORDER }}>
            <CardHeader style={{ borderLeft: `4px solid ${GOV_ACCENT_GREEN}` }}>
              <CardTitle className="flex items-center text-xl font-bold" style={{ color: GOV_NAVY }}>
                <Radio className={`w-7 h-7 mr-3 ${liveRiskBoost > 0 ? 'animate-pulse text-red-600' : ''}`} style={liveRiskBoost > 0 ? {} : { color: GOV_ACCENT_GREEN }} />
<<<<<<< HEAD
                {t("networkStatus")}
=======
                {t('networkStatus')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-xl p-4 border-2 bg-gray-50" style={{ borderColor: GOV_BORDER }}>
                  <div className="text-3xl font-bold" style={{ color: GOV_NAVY }}>{alerts.length}</div>
<<<<<<< HEAD
                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-2">{t("activeAlerts")}</div>
=======
                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-2">{t('activeAlertsCount')}</div>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                </div>
                <div className={`rounded-xl p-4 border-2 ${liveRiskBoost > 50 ? 'bg-red-50 border-red-400' : liveRiskBoost > 20 ? 'bg-amber-50 border-amber-400' : 'bg-green-50'}`} style={liveRiskBoost <= 20 ? { borderColor: GOV_ACCENT_GREEN } : {}}>
                  <div className={`text-3xl font-bold ${liveRiskBoost > 50 ? 'text-red-700' : liveRiskBoost > 20 ? 'text-amber-700' : ''}`} style={liveRiskBoost <= 20 ? { color: GOV_ACCENT_GREEN } : {}}>
                    {liveRiskBoost}%
                  </div>
<<<<<<< HEAD
                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-2">{t("riskBoost")}</div>
=======
                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-2">{t('riskBoost')}</div>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                </div>
              </div>

              <div className="space-y-2">
<<<<<<< HEAD
                <div className="text-base font-bold text-gray-800">{t("sensorArrayStatus")}</div>
=======
                <div className="text-base font-bold text-gray-800">{t('sensorArrayStatus')}</div>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${alerts.length > i
                          ? 'bg-red-100 border-red-400 text-red-800 animate-pulse'
                          : 'bg-green-50 text-gray-800'
                        }`}
                      style={alerts.length > i ? {} : { borderColor: GOV_ACCENT_GREEN }}
                    >
                      S{i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Data */}
          <Card className="shadow-lg border-2" style={{ background: GOV_CARD_BG, borderColor: GOV_BORDER }}>
            <CardHeader style={{ borderLeft: `4px solid ${GOV_ACCENT_ORANGE}` }}>
              <CardTitle className="flex items-center text-xl font-bold" style={{ color: GOV_NAVY }}>
                <Volume2 className="w-7 h-7 mr-3" style={{ color: GOV_ACCENT_ORANGE }} />
<<<<<<< HEAD
                {t("simulationData")}
=======
                {t('simulationData')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="rounded-lg p-4 border-2 bg-gray-50" style={{ borderColor: GOV_BORDER }}>
<<<<<<< HEAD
                  <div className="text-sm font-bold text-gray-700 mb-2">{t("detectionThreshold")}</div>
                  <div className="text-2xl font-bold" style={{ color: GOV_ACCENT_ORANGE }}>{GUNSHOT_THRESHOLD}dB</div>
                  <div className="text-sm font-bold text-gray-600 mt-2">{t("typicalGunshot")}</div>
                </div>
                <div className="rounded-lg p-4 border-2 bg-gray-50" style={{ borderColor: GOV_BORDER }}>
                  <div className="text-sm font-bold text-gray-700 mb-2">{t("citiesMonitored")}</div>
                  <div className="text-2xl font-bold" style={{ color: GOV_ACCENT_ORANGE }}>29</div>
                  <div className="text-sm font-bold text-gray-600 mt-2">{t("acrossIndia")}</div>
                </div>
                <div className="rounded-lg p-4 border-2 bg-gray-50" style={{ borderColor: GOV_BORDER }}>
                  <div className="text-sm font-bold text-gray-700 mb-2">{t("activeSensorsCount")}</div>
                  <div className="text-2xl font-bold" style={{ color: GOV_ACCENT_ORANGE }}>203</div>
                  <div className="text-sm font-bold text-gray-600 mt-2">{t("streetlampsPiezo")}</div>
=======
                  <div className="text-sm font-bold text-gray-700 mb-2">{t('detectionThreshold')}</div>
                  <div className="text-2xl font-bold" style={{ color: GOV_ACCENT_ORANGE }}>{GUNSHOT_THRESHOLD}dB</div>
                  <div className="text-sm font-bold text-gray-600 mt-2">{t('typicalGunshot')}</div>
                </div>
                <div className="rounded-lg p-4 border-2 bg-gray-50" style={{ borderColor: GOV_BORDER }}>
                  <div className="text-sm font-bold text-gray-700 mb-2">{t('citiesMonitored')}</div>
                  <div className="text-2xl font-bold" style={{ color: GOV_ACCENT_ORANGE }}>29</div>
                  <div className="text-sm font-bold text-gray-600 mt-2">{t('acrossIndia')}</div>
                </div>
                <div className="rounded-lg p-4 border-2 bg-gray-50" style={{ borderColor: GOV_BORDER }}>
                  <div className="text-sm font-bold text-gray-700 mb-2">{t('activeSensors')}</div>
                  <div className="text-2xl font-bold" style={{ color: GOV_ACCENT_ORANGE }}>203</div>
                  <div className="text-sm font-bold text-gray-600 mt-2">{t('streetlampsPiezo')}</div>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                </div>
              </div>
              <div className="rounded-lg p-3 border-2 bg-amber-50" style={{ borderColor: GOV_ACCENT_ORANGE }}>
                <div className="text-sm font-bold text-gray-800">
<<<<<<< HEAD
                  💡 <strong>{t("tip") || "Tip"}:</strong> {t("micDetectionTip")}
=======
                  💡 <strong>{t('tip')}:</strong> {t('iotTip')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tinkercad Simulation */}
        <Card className="shadow-lg border-2 mb-12" style={{ background: GOV_CARD_BG, borderColor: GOV_BORDER }}>
          <CardHeader style={{ borderLeft: `4px solid ${GOV_PRIMARY_BG}` }}>
            <CardTitle className="flex items-center justify-between text-xl font-bold" style={{ color: GOV_NAVY }}>
              <span className="flex items-center">
                <Share2 className="w-6 h-6 mr-3" style={{ color: GOV_PRIMARY_BG }} />
<<<<<<< HEAD
                {t("liveHardwareSim")}
=======
                {t('liveHardwareSimulation')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </span>
              <Badge className="font-bold" style={alerts.length > 0 ? { background: '#dc2626', color: 'white' } : { background: GOV_PRIMARY_BG, color: 'white' }}>
                {alerts.length > 0 ? `🔊 ${t("buzzerActive")}` : t("streetlampsSensors").replace("{count}", 7)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-8">
            <div className="aspect-video w-full rounded-xl border-2 shadow-lg overflow-hidden bg-gray-100" style={{ borderColor: GOV_BORDER }}>
              <iframe
                src="https://www.tinkercad.com/embed/hGeDgJYUcI5-sizzling-jarv?editbtn=1"
                width="100%"
                height="100%"
                frameBorder="0"
                title="PreCrime IoT Streetlamps"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; picture-in-picture; microphone"
                className="w-full h-full"
              />
            </div>
            <div className="rounded-lg p-4 border-2 bg-gray-50" style={{ borderColor: GOV_BORDER }}>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-800">
<<<<<<< HEAD
                  🔴 <strong>{t("circuitStatus")}:</strong> {alerts.length > 0 ? t("buzzerTriggered").replace("{count}", alerts.length) : t("monitoringForSounds").replace("{threshold}", GUNSHOT_THRESHOLD)}
=======
                  🔴 <strong>{t('circuitStatus')}:</strong> {alerts.length > 0 ? `🔊 Buzzer triggered – ${alerts.length} active detection(s)` : `✓ ${t('monitoringReady')}`}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
                </span>
              </div>
              {alerts.length > 0 && (
                <p className="text-sm font-bold text-gray-600 mt-2">
                  {t("lastDetection")}: {alerts[0]?.soundLevel} at {alerts[0]?.timestamp}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Feed */}
        <Card className="shadow-lg border-2" style={{ background: GOV_CARD_BG, borderColor: GOV_BORDER }}>
          <CardHeader style={{ borderLeft: '4px solid #dc2626' }}>
            <CardTitle className="flex items-center justify-between text-xl font-bold" style={{ color: GOV_NAVY }}>
              <span className="flex items-center">
                <AlertCircle className="w-7 h-7 mr-3 text-red-600" />
<<<<<<< HEAD
                {t("realTimeIncidentLog")}
              </span>
              <Badge variant="outline" className="text-base font-bold" style={{ borderColor: GOV_NAVY, color: GOV_NAVY }}>
                {alerts.length} {t("activeAlerts")}
=======
                {t('realTimeIncidentLog')}
              </span>
              <Badge variant="outline" className="text-base font-bold" style={{ borderColor: GOV_NAVY, color: GOV_NAVY }}>
                {alerts.length} {t('active')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <AlertCircle className="w-20 h-20 mx-auto mb-6 opacity-40" style={{ color: GOV_NAVY }} />
<<<<<<< HEAD
                <p className="text-2xl font-bold text-gray-800">{t("networkQuiet")}</p>
                <p className="text-lg font-bold mt-2 text-gray-700">{t("noGunshotRecorded")}</p>
                <p className="text-base font-bold mt-4 text-gray-600">{t("enableAudioStart")}</p>
=======
                <p className="text-2xl font-bold text-gray-800">{t('networkQuiet')}</p>
                <p className="text-lg font-bold mt-2 text-gray-700">{t('noDetections')}</p>
                <p className="text-base font-bold mt-4 text-gray-600">{t('enableAudioToMonitor')}</p>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl p-6 border-2 border-red-200 bg-red-50 hover:shadow-md transition-all">
                    <div className="flex items-start space-x-4">
                      <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="font-bold text-lg text-gray-900">{alert.type}</div>
                          <Badge className="font-bold bg-red-600 text-white">{alert.confidence}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-base font-bold text-gray-800">
                          <div className="flex items-center">
                            <Radio className="w-4 h-4 mr-2" style={{ color: GOV_PRIMARY_BG }} />
                            {alert.sensors}
                          </div>
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2 text-amber-600" />
                            {alert.soundLevel}
                          </div>
                          <div className="flex items-center">📍 {alert.zone}</div>
                          <div className="flex items-center text-red-700">⚠️ {alert.riskBoost}</div>
                        </div>
                        <div className="text-sm font-bold text-gray-600 mt-2 flex items-center space-x-2">
                          <span>🕐 {alert.timestamp}</span>
                          <span>•</span>
                          <span>{alert.piezo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
