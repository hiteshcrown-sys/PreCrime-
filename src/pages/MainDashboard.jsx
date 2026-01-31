import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, MapPin, Activity } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";

import CrimePredictionModel from "@/components/dashboard/CrimePredictionModel";
import useCrimeModel from "@/hooks/useCrimeModel";
import useChatBot from "@/hooks/useChatBot";
import { useAlerts } from "@/contexts/AlertContext";
import { Switch } from "@/components/ui/switch";
import PatrolCommand from "@/components/patrol/PatrolCommand";
import { livePatrolService } from "@/services/livePatrolService";
import { useCity } from "@/contexts/CityContext";
<<<<<<< HEAD
import { useTranslate } from "@/hooks/useTranslate";
=======
import { useLanguage } from "@/contexts/LanguageContext";
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
import L from 'leaflet';

// City coordinates mapping (latitude, longitude)
const CITY_COORDINATES = {
  'Delhi': [28.7041, 77.1025],
  'Mumbai': [19.0760, 72.8777],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Indore': [22.7196, 75.8577],
  'Kanpur': [26.4499, 80.3319],
  'Thane': [19.2183, 72.9781],
  'Bhopal': [23.1815, 79.9864],
  'Visakhapatnam': [17.6869, 83.2185],
  'Pimpri-Chinchwad': [18.6298, 73.7997],
  'Patna': [25.5941, 85.1376],
  'Vadodara': [22.3072, 73.1812],
  'Ghaziabad': [28.6692, 77.4538],
  'Ludhiana': [30.9010, 75.8573],
  'Agra': [27.1767, 78.0081],
  'Nagpur': [21.1458, 79.0882],
  'Indira Nagar': [12.9789, 77.6469],
  'Srinagar': [34.0837, 74.7973],
  'Meerut': [28.9845, 77.7064],
  'Ranchi': [23.3441, 85.3096],
  'Bhubaneswar': [20.2961, 85.8245],
  'Aligarh': [27.8974, 77.8926],
  'Rajkot': [22.3039, 70.8022]
};

export default function MainDashboard() {
<<<<<<< HEAD
  const { t } = useTranslate();
=======
  const { t } = useLanguage();
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
  const [timeOfDay, setTimeOfDay] = useState(20);
  const [hoveredState, setHoveredState] = useState(null);

  const [showDispatchAlert, setShowDispatchAlert] = useState(true);
  const [selectedPredictionHour, setSelectedPredictionHour] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [patrolUnits, setPatrolUnits] = useState([]);
  const patrolMarkersRef = useRef({});
  const patrolRoutesRef = useRef({});
  const { selectedCity } = useCity();
  const [kpiData, setKpiData] = useState({
    nationalRisk: 67.4,
    highRiskZones: 4,
    alertsGenerated: 12,
    modelConfidence: 94.2,
    trend: "+4.2%"
  });

  // Get ML model data
  const { getCityRankings, selectedModel } = useCrimeModel();
  const { updatePredictionContext } = useChatBot();
  const { autoDispatch, setAutoDispatch } = useAlerts();

  // Real-time polling - refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle prediction change from Crime Prediction Model
  const handlePredictionChange = (prediction) => {
    setSelectedPrediction(prediction);
  };

  // Update chatbot context when prediction changes
  useEffect(() => {
    if (selectedPrediction) {
      // Extract factors from the prediction if available
      const factors = selectedPrediction.factors || [];
      updatePredictionContext(
        selectedPrediction,
        factors,
        selectedPrediction.city || 'Selected City',
        timeOfDay
      );
    }
  }, [selectedPrediction, timeOfDay, updatePredictionContext]);

  // Update KPI data based on selected prediction OR city rankings
  useEffect(() => {
    let nationalRisk = 67.4;
    let highRiskZones = 4;
    let alertsGenerated = 12;
    let trendValue = "+4.2%";

    // If a specific prediction is selected, use that data
    if (selectedPrediction) {
      // Calculate National Risk based on risk level to ensure variety
      // CRITICAL: 80-99, HIGH: 60-80, MEDIUM: 40-60, LOW: 20-40, VERY_LOW: 10-20
      const riskRanges = {
        'CRITICAL': { min: 80, max: 99 },
        'HIGH': { min: 60, max: 80 },
        'MEDIUM': { min: 40, max: 60 },
        'LOW': { min: 20, max: 40 },
        'VERY_LOW': { min: 10, max: 20 }
      };

      const range = riskRanges[selectedPrediction.riskLevel] || { min: 40, max: 60 };
      const predictedRate = selectedPrediction.predictedRate;

      // If predictedRate is within range, use it; otherwise calculate based on range
      if (predictedRate >= range.min && predictedRate <= range.max) {
        nationalRisk = Math.round(predictedRate * 10) / 10;
      } else {
        // Distribute within the range based on the raw predicted rate
        const normalized = (predictedRate % (range.max - range.min)) + range.min;
        nationalRisk = Math.round(normalized * 10) / 10;
      }

      // High-Risk Zones = count nearby cities with similar risk level + current city
      const currentHour = selectedPrediction.hour;
      const rankings = getCityRankings(currentHour);

      if (rankings && rankings.length > 0) {
        // Count all high-risk cities
        const highRiskCount = rankings.filter(city =>
          city.riskLevel === 'CRITICAL' || city.riskLevel === 'HIGH'
        ).length;
        highRiskZones = highRiskCount;

        // Alerts = based on the selected city's risk level
        if (selectedPrediction.riskLevel === 'CRITICAL') {
          alertsGenerated = 8;
        } else if (selectedPrediction.riskLevel === 'HIGH') {
          alertsGenerated = 5;
        } else if (selectedPrediction.riskLevel === 'MEDIUM') {
          alertsGenerated = 2;
        } else {
          alertsGenerated = 0;
        }
      }

      // Trend based on selected prediction's risk
      if (selectedPrediction.riskLevel === 'CRITICAL') {
        trendValue = "+18.5%";
      } else if (selectedPrediction.riskLevel === 'HIGH') {
        trendValue = "+12.3%";
      } else if (selectedPrediction.riskLevel === 'MEDIUM') {
        trendValue = "+5.2%";
      } else {
        trendValue = "+1.8%";
      }
    } else {
      // Fallback to time-based rankings
      const currentHour = selectedPredictionHour !== null ? selectedPredictionHour : timeOfDay;
      const rankings = getCityRankings(currentHour);

      if (rankings && rankings.length > 0) {
        const allCitiesRisk = rankings.map(city => city.predictedRate);
        const avgRisk = allCitiesRisk.reduce((sum, rate) => sum + rate, 0) / allCitiesRisk.length;

        const highRiskCount = rankings.filter(city =>
          city.riskLevel === 'CRITICAL' || city.riskLevel === 'HIGH'
        ).length;

        const alertCount = rankings.reduce((total, city) => {
          if (city.riskLevel === 'CRITICAL') return total + 2;
          if (city.riskLevel === 'HIGH') return total + 1;
          return total;
        }, 0);

        nationalRisk = Math.min(99, Math.round(avgRisk * 10) / 10);
        highRiskZones = highRiskCount;
        alertsGenerated = alertCount;

        const baseTrend = currentHour >= 22 || currentHour <= 6 ? "+12.3%" : "+4.2%";
        const riskIncrease = avgRisk > 70 ? "+8.5%" : avgRisk > 50 ? "+5.2%" : "+2.1%";
        trendValue = highRiskCount > 5 ? riskIncrease : baseTrend;
      }
    }

    setKpiData(prev => ({
      nationalRisk,
      highRiskZones,
      alertsGenerated,
      modelConfidence: 94.2,
      trend: trendValue
    }));
  }, [selectedPrediction, selectedPredictionHour, timeOfDay, getCityRankings, refreshTrigger]);

  // Get risk color based on risk level
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'VERY_LOW':
      case 'LOW':
        return { color: '#22c55e', hex: '#22c55e' }; // Green
      case 'MEDIUM':
        return { color: '#eab308', hex: '#eab308' }; // Yellow
      case 'HIGH':
        return { color: '#f97316', hex: '#f97316' }; // Orange
      case 'CRITICAL':
        return { color: '#ef4444', hex: '#ef4444' }; // Red
      default:
        return { color: '#64748b', hex: '#64748b' }; // Gray
    }
  };

  // Initialize Leaflet map
  const initMap = () => {
    // Return if already initialized or no ref
    if (mapInitialized || !mapRef.current) {
      return;
    }

    try {
      // Create map instance
      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true,
      });

      // Add OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 3,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add all city markers with visible styling
      Object.entries(CITY_COORDINATES).forEach(([cityName, [lat, lng]]) => {
        const marker = L.circleMarker([lat, lng], {
          radius: 10,
          fillColor: '#64748b',
          color: '#1e293b',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        });

        marker.bindPopup(`
          <div style="font-size: 12px; color: #111827;">
            <p style="margin: 0; font-weight: bold;">${cityName}</p>
<<<<<<< HEAD
            <p style="margin: 4px 0 0 0; color: #6b7280;">${t("selectCityToPredict")}</p>
=======
            <p style="margin: 4px 0 0 0; color: #6b7280;">${t('selectCityToPredict')}</p>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
          </div>
        `);

        marker.addTo(map);
        markersRef.current[cityName] = marker;
      });

      setMapInitialized(true);
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  };

  // Update map markers from prediction
  const updateMapFromPrediction = (prediction) => {
    if (!mapInstanceRef.current || !prediction) return;

    const { city, riskLevel, predictedRate, crimeType, hour } = prediction;
    const coords = CITY_COORDINATES[city];

    if (!coords) return;

    const riskColor = getRiskColor(riskLevel);
    const radius = Math.min(25, 8 + (predictedRate / 5)); // Scale radius by risk score

    const marker = markersRef.current[city];
    if (marker) {
      // Update marker style
      marker.setStyle({
        fillColor: riskColor.hex,
        color: riskColor.hex,
        weight: 3,
        fillOpacity: 0.8,
      });

      // Update radius
      marker.setRadius(radius);

      // Update popup
      const timestamp = new Date().toLocaleTimeString();
      marker.setPopupContent(`
        <div class="text-sm bg-white text-gray-900 p-2 rounded border border-gray-200" style="max-width: 250px;">
          <p class="font-bold">${city}</p>
          <div class="text-xs space-y-1 mt-2 text-gray-600">
<<<<<<< HEAD
            <p><span class="text-gray-500">${t("riskLevel")}:</span> <span style="color: ${riskColor.hex}; font-weight: 600;">${riskLevel}</span></p>
            <p><span class="text-gray-500">${t("riskScore")}:</span> ${predictedRate.toFixed(1)}</p>
            <p><span class="text-gray-500">${t("crimeType")}:</span> ${crimeType}</p>
            <p><span class="text-gray-500">${t("time")}:</span> ${getTimeLabel(hour)}</p>
            <p><span class="text-gray-500">${t("confidence")}:</span> 94.2%</p>
            <p class="text-xs text-gray-500 mt-2">${t("updated")}: ${timestamp}</p>
=======
            <p><span class="text-gray-500">${t('riskLevel')}:</span> <span style="color: ${riskColor.hex}; font-weight: 600;">${riskLevel}</span></p>
            <p><span class="text-gray-500">${t('riskScore')}:</span> ${predictedRate.toFixed(1)}</p>
            <p><span class="text-gray-500">${t('crimeType')}:</span> ${crimeType}</p>
            <p><span class="text-gray-500">${t('timeLabel')}</span> ${getTimeLabel(hour)}</p>
            <p><span class="text-gray-500">${t('confidence')}:</span> 94.2%</p>
            <p class="text-xs text-gray-500 mt-2">${t('updated')} ${timestamp}</p>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
          </div>
        </div>
      `);
    }

    // Pan to selected city
    mapInstanceRef.current.flyTo(coords, 10, { duration: 0.8 });
  };

  // Initialize map on component mount
  useEffect(() => {
    // Use a longer delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (mapRef.current) {
        initMap();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [mapInitialized]);

  // Update map when prediction changes
  useEffect(() => {
    if (selectedPrediction) {
      updateMapFromPrediction(selectedPrediction);
    }
  }, [selectedPrediction]);

  // Update marker popups when language changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;
    const sub = t('selectCityToPredict');
    Object.entries(markersRef.current).forEach(([cityName, marker]) => {
      marker.setPopupContent(
        `<div style="font-size: 12px; color: #111827;"><p style="margin: 0; font-weight: bold;">${cityName}</p><p style="margin: 4px 0 0 0; color: #6b7280;">${sub}</p></div>`
      );
    });
    if (selectedPrediction) updateMapFromPrediction(selectedPrediction);
  }, [t, selectedPrediction]);

  // Handle patrol unit updates and marker rendering
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInitialized) return;

    // Simulation loop for patrol movements
    const interval = setInterval(() => {
      // Get current alerts to help patrol service make decisions
      const currentAlerts = []; // This could be synced from useAlerts if needed
      const updatedUnits = livePatrolService.updatePatrols(selectedCity, []);
      setPatrolUnits([...updatedUnits]);

      // Update markers on map
      updatedUnits.forEach(unit => {
        const { id, lat, lng, status, name, targetAlert, targetHotspot } = unit;

        // 1. Update Marker
        if (!patrolMarkersRef.current[id]) {
          const icon = L.divIcon({
            html: `
              <div class="patrol-marker-container" style="transition: all 0.5s ease-in-out;">
                <div class="relative">
                  <div class="patrol-icon ${status === 'Responding' ? 'animate-pulse' : ''}" style="color: ${status === 'Responding' ? '#ef4444' : '#06b6d4'};">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" opacity="0.9">
                      <path d="M5 11L3 13V19C3 19.5523 3.44772 20 4 20H5C5.55228 20 6 19.5523 6 19V18H18V19C18 19.5523 18.4477 20 19 20H20C20.5523 20 21 19.5523 21 19V13L19 11M5 11L7 5H17L19 11M5 11H19M8 15H8.01M16 15H16.01" stroke="black" stroke-width="1.5" />
                    </svg>
                  </div>
                  <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white" style="background-color: ${status === 'Responding' ? '#ef4444' : '#06b6d4'};"></div>
                </div>
              </div>`,
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });

          patrolMarkersRef.current[id] = L.marker([lat, lng], { icon }).addTo(mapInstanceRef.current);
          patrolMarkersRef.current[id].bindPopup(`<b>${name}</b><br>Status: ${status}`);
        } else {
          patrolMarkersRef.current[id].setLatLng([lat, lng]);
          // Update icon if status changed (color)
          const icon = L.divIcon({
            html: `
              <div class="patrol-marker-container">
                <div class="relative">
                  <div class="patrol-icon ${status === 'Responding' ? 'animate-pulse' : ''}" style="color: ${status === 'Responding' ? '#ef4444' : '#06b6d4'};">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" opacity="0.9">
                      <path d="M5 11L3 13V19C3 19.5523 3.44772 20 4 20H5C5.55228 20 6 19.5523 6 19V18H18V19C18 19.5523 18.4477 20 19 20H20C20.5523 20 21 19.5523 21 19V13L19 11M5 11L7 5H17L19 11M5 11H19M8 15H8.01M16 15H16.01" stroke="black" stroke-width="1.5" />
                    </svg>
                  </div>
                  <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white" style="background-color: ${status === 'Responding' ? '#ef4444' : '#06b6d4'};"></div>
                </div>
              </div>`,
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          patrolMarkersRef.current[id].setIcon(icon);
        }

        // 2. Update Route Polyline
        const target = targetAlert || targetHotspot;
        if (target) {
          const targetCoords = [target.lat, target.lng];
          if (!patrolRoutesRef.current[id]) {
            patrolRoutesRef.current[id] = L.polyline([[lat, lng], targetCoords], {
              color: status === 'Responding' ? '#ef4444' : '#06b6d4',
              weight: 2,
              dashArray: '5, 10',
              opacity: 0.5
            }).addTo(mapInstanceRef.current);
          } else {
            patrolRoutesRef.current[id].setLatLngs([[lat, lng], targetCoords]);
            patrolRoutesRef.current[id].setStyle({
              color: status === 'Responding' ? '#ef4444' : '#06b6d4'
            });
          }
        } else if (patrolRoutesRef.current[id]) {
          mapInstanceRef.current.removeLayer(patrolRoutesRef.current[id]);
          delete patrolRoutesRef.current[id];
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [mapInitialized, selectedCity]);



  const getTimeLabel = (hour) => {
    if (hour === 0) return t('time12AM');
    if (hour < 12) return `${hour} ${t('timeAM')}`;
    if (hour === 12) return t('time12PM');
    return `${hour - 12} ${t('timePM')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
<<<<<<< HEAD
        <h1 className="text-xl font-semibold text-gray-900">{t("dashboardTitle")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("dashboardSubtitle")}</p>
=======
        <h1 className="text-xl font-semibold text-gray-900">{t('dashboardTitle')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('realTimeCrimeIntel')}</p>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          key={kpiData.nationalRisk}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <KPICard
<<<<<<< HEAD
            title={t("nationalRiskIndex")}
            value={kpiData.nationalRisk.toFixed(1)}
            subtitle={t("monitoredZones")}
=======
            title={t('nationalRiskIndex')}
            value={kpiData.nationalRisk.toFixed(1)}
            subtitle={t('acrossAllMonitoredZones')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
            icon={Shield}
            accentColor="orange"
            trend="up"
            trendValue={`${kpiData.trend} ${t("trendBaseline")}`}
          />
        </motion.div>

        <motion.div
          key={kpiData.highRiskZones}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <KPICard
<<<<<<< HEAD
            title={t("highRiskZonesActive")}
            value={kpiData.highRiskZones}
            subtitle={t("aboveThreshold")}
=======
            title={t('highRiskZones')}
            value={kpiData.highRiskZones}
            subtitle={t('above70Threshold')}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
            icon={MapPin}
            accentColor="red"
          />
        </motion.div>

        <motion.div
          key={kpiData.alertsGenerated}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <KPICard
<<<<<<< HEAD
            title={t("alertsGenerated")}
            value={kpiData.alertsGenerated}
            subtitle={t("requiringAttention")}
            icon={AlertTriangle}
            accentColor="orange"
            trend="up"
            trendValue={`+${Math.floor(kpiData.alertsGenerated / 3)} ${t("newAlerts")}`}
=======
            title={t('alertsGenerated')}
            value={kpiData.alertsGenerated}
            subtitle={t('requiringAttention')}
            icon={AlertTriangle}
            accentColor="orange"
            trend="up"
            trendValue={`+${Math.floor(kpiData.alertsGenerated / 3)} ${t('newAlerts')}`}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
          />
        </motion.div>

        <KPICard
<<<<<<< HEAD
          title={t("modelConfidence")}
          value={`${kpiData.modelConfidence}%`}
          subtitle={t("predictionAccuracy")}
          icon={Activity}
          accentColor="green"
          trend="up"
          trendValue={`+1.8% ${t("improvement")}`}
=======
          title={t('modelConfidence')}
          value={`${kpiData.modelConfidence}%`}
          subtitle={t('predictionAccuracy')}
          icon={Activity}
          accentColor="green"
          trend="up"
          trendValue={`+1.8% ${t('improvement')}`}
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
        />
      </div>

      {/* AI Crime Prediction Model */}
      <CrimePredictionModel
        onPredictionHourChange={setSelectedPredictionHour}
        onPredictionChange={handlePredictionChange}
      />

      {/* Real-Time Map Section */}
      <div className="rounded-lg bg-white/95 border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between" style={{ borderTopWidth: 3, borderTopColor: '#000080' }}>
          <div>
<<<<<<< HEAD
            <h3 className="font-semibold text-gray-900">{t("realTimeRiskMap")}</h3>
            <p className="text-xs text-gray-500 mt-1">{t("liveMLPredictions")}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span className="text-xs font-medium text-green-800">{t("liveMLData")}</span>
=======
            <h3 className="font-semibold text-gray-900">{t('realTimeRiskMap')}</h3>
            <p className="text-xs text-gray-500 mt-1">{t('liveMLPredictionsSync')}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span className="text-xs font-medium text-green-800">{t('liveMLData')}</span>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/95 border border-gray-200 border-l-4" style={{ borderLeftColor: "#138808" }}>
            <div className="flex flex-col">
<<<<<<< HEAD
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t("patrolCommand")}</span>
              <span className="text-xs text-gray-500">{t("autoDispatchAlerts")}</span>
=======
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t('patrolCommand')}</span>
              <span className="text-xs text-gray-500">{t('autoDispatchCriticalAlerts')}</span>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
            </div>
            <Switch
              checked={autoDispatch}
              onCheckedChange={setAutoDispatch}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>

        <div className="relative">
          <div ref={mapRef} className="w-full bg-gray-100" style={{ height: '600px' }} />
          <div className="absolute bottom-6 left-6 bg-white/95 border border-gray-200 rounded-lg p-4 shadow-sm z-10">
<<<<<<< HEAD
            <p className="text-xs font-semibold text-gray-900 mb-3">{t("riskLevel")}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600">{t("lowRisk")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-600">{t("mediumRisk")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-600">{t("highRisk")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-xs text-gray-600">{t("criticalRisk")}</span>
=======
            <p className="text-xs font-semibold text-gray-900 mb-3">{t('riskLevelLegend')}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600">{t('lowRisk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-600">{t('mediumRisk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-600">{t('highRisk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-xs text-gray-600">{t('criticalRisk')}</span>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </div>
            </div>
          </div>
          {selectedPrediction && (
            <div className="absolute top-6 right-6 bg-white/95 border border-gray-200 rounded-lg p-4 shadow-sm max-w-sm z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
<<<<<<< HEAD
                <p className="text-xs font-semibold text-gray-900">{t("livePrediction")}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">{selectedPrediction.city} • {getTimeLabel(selectedPrediction.hour)}</p>
              <div className="text-xs space-y-1 text-gray-600">
                <p><span className="text-gray-500">{t("riskLevel")}:</span> <span style={{ color: getRiskColor(selectedPrediction.riskLevel).hex }} className="font-semibold">{selectedPrediction.riskLevel}</span></p>
                <p><span className="text-gray-500">{t("riskScore")}:</span> {selectedPrediction.predictedRate.toFixed(1)}</p>
                <p><span className="text-gray-500">{t("crimeType")}:</span> {selectedPrediction.crimeType}</p>
                <p><span className="text-gray-500">{t("confidence")}:</span> 94.2%</p>
=======
                <p className="text-xs font-semibold text-gray-900">{t('livePrediction')}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">{selectedPrediction.city} • {getTimeLabel(selectedPrediction.hour)}</p>
              <div className="text-xs space-y-1 text-gray-600">
                <p><span className="text-gray-500">{t('riskLevel')}:</span> <span style={{ color: getRiskColor(selectedPrediction.riskLevel).hex }} className="font-semibold">{selectedPrediction.riskLevel}</span></p>
                <p><span className="text-gray-500">{t('riskScore')}:</span> {selectedPrediction.predictedRate.toFixed(1)}</p>
                <p><span className="text-gray-500">{t('crimeType')}:</span> {selectedPrediction.crimeType}</p>
                <p><span className="text-gray-500">{t('modelConfidence')}:</span> 94.2%</p>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Patrol Command System – light theme */}
      <div id="patrol-command-section" className="pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/95 border border-gray-200 border-l-4" style={{ borderLeftColor: "#000080" }}>
            <Shield className="w-5 h-5 text-gray-700" />
          </div>
          <div>
<<<<<<< HEAD
            <h2 className="text-xl font-semibold text-gray-900 uppercase tracking-tight">{t("tacticalOperations")}</h2>
            <p className="text-xs text-gray-500">{t("tacticalOpsSubtitle")}</p>
=======
            <h2 className="text-xl font-semibold text-gray-900 uppercase tracking-tight">{t('tacticalOperations')}</h2>
            <p className="text-xs text-gray-500">{t('manualAIDispatchCommand')}</p>
>>>>>>> 57a111b526fdc52a8a2277e3f0c638363d3bf4c0
          </div>
        </div>
        <PatrolCommand />
      </div>
    </div>
  );
}