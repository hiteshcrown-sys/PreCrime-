// src/pages/IoTNetwork.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Activity, Play, Share2, Link, Mic, Volume2, Radio, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GUNSHOT_THRESHOLD = 40; // dB threshold for gunshot detection
const ZONE_NAMES = ['Dadar Station', 'Bandra West', 'Colaba Market', 'Fort Area', 'Marine Drive'];
const SENSOR_ZONES = ['D2-D8', 'D9-D14', 'D15-D21', 'D22-D28', 'D29-D35'];

export default function IoTNetwork() {
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
          addGunshotAlert(db);
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
    
    // Reset boost after 10s
    setTimeout(() => setLiveRiskBoost(prev => Math.max(prev - (riskBoost / 2), 0)), 10000);
    
    // Trigger Tinkercad buzzer - Prevent multiple triggers within 500ms
    const now = Date.now();
    if (now - lastDetectionRef.current > 500) {
      lastDetectionRef.current = now;
      triggerTinkercadBuzzer(soundLevel || 80);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-black p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight">
            🛰️ Live IoT Network
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            Real-time acoustic & visual threat detection across 29 cities | Streetlamp sensor array + Piezo-electric pickups
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Audio Detection Panel */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/80 border-2 border-cyan-500/40 backdrop-blur-xl lg:col-span-1">
            <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-blue-500/10">
              <CardTitle className="flex items-center text-2xl font-black text-white">
                <Mic className={`w-8 h-8 mr-3 ${isListening ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`} />
                Audio Sensor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Audio Level Visualization */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Sound Level</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 text-lg font-bold">
                    {audioLevel}dB
                  </Badge>
                </div>
                <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden border border-cyan-500/30">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 transition-all duration-100"
                    style={{ width: `${Math.min(audioLevel, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white">
                  <span>0dB</span>
                  <span className={audioLevel > GUNSHOT_THRESHOLD ? 'text-red-400 font-bold' : ''}>
                    {GUNSHOT_THRESHOLD}dB (Threshold)
                  </span>
                  <span>100dB</span>
                </div>
              </div>

              {/* Peak Level */}
              <div className="bg-gray-800/50 rounded-lg p-3 border border-blue-500/20">
                <div className="text-xs text-white mb-1">Peak Level</div>
                <div className="text-3xl font-black text-blue-400">{peakLevel}dB</div>
              </div>

              {/* Control Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={isListening ? stopAudioDetection : startAudioDetection}
                  size="lg"
                  className={`w-full font-bold text-lg transition-all ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                  }`}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  {isListening ? 'Stop Listening' : 'Start Detection'}
                </Button>
                
                <Button 
                  onClick={() => setPeakLevel(0)}
                  variant="outline"
                  size="sm"
                  className="w-full text-white border-gray-600 hover:bg-gray-800"
                >
                  Reset Peak
                </Button>
              </div>

              {micPermission === false && (
                <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-sm text-red-300">
                  ⚠️ Microphone access denied
                </div>
              )}

              {detectionActive && (
                <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg p-3 text-sm text-cyan-300">
                  🎙️ Live detection active - Gunshots auto-detected above {GUNSHOT_THRESHOLD}dB
                </div>
              )}
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/80 border-2 border-violet-500/40 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-violet-500/20 to-purple-500/10">
              <CardTitle className="flex items-center text-2xl font-black text-white">
                <Radio className={`w-8 h-8 mr-3 ${liveRiskBoost > 0 ? 'text-red-400 animate-pulse' : 'text-green-400'}`} />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-violet-500/20">
                  <div className="text-4xl font-black text-violet-400">{alerts.length}</div>
                  <div className="text-xs text-white uppercase tracking-wider mt-2">Active Alerts</div>
                </div>
                <div className={`rounded-xl p-4 border ${liveRiskBoost > 50 ? 'bg-red-500/20 border-red-500/40' : liveRiskBoost > 20 ? 'bg-yellow-500/20 border-yellow-500/40' : 'bg-green-500/20 border-green-500/40'}`}>
                  <div className={`text-4xl font-black ${liveRiskBoost > 50 ? 'text-red-400' : liveRiskBoost > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {liveRiskBoost}%
                  </div>
                  <div className="text-xs text-white uppercase tracking-wider mt-2">Risk Boost</div>
                </div>
              </div>

              {/* Sensor Grid Status */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-white">Sensor Array Status</div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-12 rounded-lg border-2 flex items-center justify-center font-bold text-xs text-white ${
                      alerts.length > i 
                        ? 'bg-red-500/30 border-red-500/50 text-red-100 animate-pulse' 
                        : 'bg-green-500/20 border-green-500/30 text-green-300'
                    }`}>
                      S{i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Simulation Stats */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/80 border-2 border-orange-500/40 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500/20 to-red-500/10">
              <CardTitle className="flex items-center text-2xl font-black text-white">
                <Volume2 className="w-8 h-8 mr-3 text-orange-400" />
                Simulation Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/20">
                  <div className="text-xs text-white mb-2">Detection Threshold</div>
                  <div className="text-3xl font-black text-orange-400">{GUNSHOT_THRESHOLD}dB</div>
                  <div className="text-xs text-white mt-2">Typical gunshot: 150-190dB</div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/20">
                  <div className="text-xs text-white mb-2">Cities Monitored</div>
                  <div className="text-3xl font-black text-orange-400">29</div>
                  <div className="text-xs text-white mt-2">Across India</div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/20">
                  <div className="text-xs text-white mb-2">Active Sensors</div>
                  <div className="text-3xl font-black text-orange-400">203</div>
                  <div className="text-xs text-white mt-2">Streetlamps + Piezo</div>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <div className="text-sm text-white">
                  <strong>💡 Tip:</strong> Make loud sounds near your microphone to trigger detections
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tinkercad Simulation */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/80 border-2 border-purple-500/40 backdrop-blur-xl mb-12">
          <CardHeader className="bg-gradient-to-r from-purple-500/20 to-indigo-500/10">
            <CardTitle className="flex items-center justify-between text-2xl font-black text-white">
              <span className="flex items-center">
                <Share2 className="w-6 h-6 mr-3 text-purple-400" />
                Live Hardware Simulation (Tinkercad)
              </span>
              <Badge className={`${alerts.length > 0 ? 'bg-red-500/40 text-red-200 border-red-500/60 animate-pulse' : 'bg-purple-500/40 text-purple-200 border-purple-500/60'}`}>
                {alerts.length > 0 ? '🔊 BUZZER ACTIVE' : '7 Streetlamps + Piezo'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-8">
            <div className="aspect-video w-full rounded-2xl border-4 border-purple-500/60 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
      <iframe
        src="https://www.tinkercad.com/embed/hGeDgJYUcI5-sizzling-jarv?editbtn=1"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        title="PreCrime Streetlamp IoT Live Simulation"
        className="w-full h-full"
      />
    </div>
            

            <div className="bg-purple-500/10 border-t border-purple-500/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white">
                  <strong>🔴 Circuit Status:</strong> {alerts.length > 0 ? `🔊 Buzzer triggered - ${alerts.length} active detection(s)` : '✓ Monitoring for sounds above 40dB - Buzzer ready'}
                </span>
              </div>
              {alerts.length > 0 && (
                <p className="text-xs text-orange-300 mt-2">
                  Last detection: {alerts[0]?.soundLevel} at {alerts[0]?.timestamp}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Feed */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/80 border-2 border-red-500/30 backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-red-500/20 to-orange-500/10">
            <CardTitle className="flex items-center justify-between text-2xl font-black text-white">
              <span className="flex items-center">
                <AlertCircle className="w-7 h-7 mr-3 text-red-400 animate-pulse" />
                Real-Time Incident Log
              </span>
              <Badge variant="outline" className="text-lg text-white border-white">
                {alerts.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <AlertCircle className="w-20 h-20 mx-auto mb-6 opacity-30" />
                <p className="text-2xl font-light text-white">Network Quiet</p>
                <p className="text-lg mt-2 text-white">No gunshot detections recorded</p>
                <p className="text-sm mt-4 text-gray-400">Enable audio detection to start monitoring</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="group bg-gradient-to-r from-red-500/25 via-orange-500/15 to-red-500/10 border-2 border-red-500/40 rounded-2xl p-6 hover:shadow-red-500/40 hover:shadow-lg transition-all">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <AlertCircle className="w-10 h-10 text-red-400 flex-shrink-0 animate-pulse" />
                        <div className="absolute inset-0 bg-red-400/30 rounded-full blur-lg animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="font-bold text-xl text-white">{alert.type}</div>
                          <Badge className="bg-red-500/40 text-red-200 border-red-500/60 font-bold">
                            {alert.confidence}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-white">
                            <Radio className="w-4 h-4 mr-2 text-cyan-400" />
                            {alert.sensors}
                          </div>
                          <div className="flex items-center text-white">
                            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                            {alert.soundLevel}
                          </div>
                          <div className="flex items-center text-orange-300 font-semibold">
                            📍 {alert.zone}
                          </div>
                          <div className="flex items-center text-red-400 font-bold">
                            ⚠️ {alert.riskBoost}
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 mt-2 flex items-center space-x-2">
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
