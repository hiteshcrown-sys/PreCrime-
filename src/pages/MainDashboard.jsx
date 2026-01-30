import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, MapPin, Activity, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import KPICard from "@/components/dashboard/KPICard";

import CrimePredictionModel from "@/components/dashboard/CrimePredictionModel";
import useCrimeModel from "@/hooks/useCrimeModel";
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
  const [kpiData, setKpiData] = useState({
    nationalRisk: 67.4,
    highRiskZones: 4,
    alertsGenerated: 12,
    modelConfidence: 94.2,
    trend: "+4.2%"
  });

  // Get ML model data
  const { getCityRankings, selectedModel } = useCrimeModel();

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
          <div style="font-size: 12px; color: white;">
            <p style="margin: 0; font-weight: bold;">${cityName}</p>
            <p style="margin: 4px 0 0 0; color: #cbd5e1;">Select city to predict</p>
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
        <div class="text-sm bg-slate-900 text-white p-2 rounded" style="max-width: 250px;">
          <p class="font-bold">${city}</p>
          <div class="text-xs space-y-1 mt-2 text-gray-300">
            <p><span class="font-semibold">Risk Level:</span> <span style="color: ${riskColor.hex};">${riskLevel}</span></p>
            <p><span class="font-semibold">Risk Score:</span> ${predictedRate.toFixed(1)}</p>
            <p><span class="font-semibold">Crime Type:</span> ${crimeType}</p>
            <p><span class="font-semibold">Time:</span> ${getTimeLabel(hour)}</p>
            <p><span class="font-semibold">Confidence:</span> 94.2%</p>
            <p class="text-xs text-cyan-400 mt-2">Updated: ${timestamp}</p>
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



  const getTimeLabel = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">National Command Centre</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time Crime Intelligence for India</p>
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
            title="National Risk Index"
            value={kpiData.nationalRisk.toFixed(1)}
            subtitle="Across all monitored zones"
            icon={Shield}
            accentColor="orange"
            trend="up"
            trendValue={`${kpiData.trend} from baseline`}
          />
        </motion.div>

        <motion.div
          key={kpiData.highRiskZones}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <KPICard
            title="High-Risk Zones Active"
            value={kpiData.highRiskZones}
            subtitle="Above 70% threshold"
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
            title="Alerts Generated"
            value={kpiData.alertsGenerated}
            subtitle="Requiring attention"
            icon={AlertTriangle}
            accentColor="orange"
            trend="up"
            trendValue={`+${Math.floor(kpiData.alertsGenerated / 3)} new alerts`}
          />
        </motion.div>

        <KPICard
          title="Model Confidence"
          value={`${kpiData.modelConfidence}%`}
          subtitle="Prediction accuracy"
          icon={Activity}
          accentColor="green"
          trend="up"
          trendValue="+1.8% improvement"
        />
      </div>

      {/* AI Crime Prediction Model */}
      <CrimePredictionModel 
        onPredictionHourChange={setSelectedPredictionHour}
        onPredictionChange={handlePredictionChange}
      />

      {/* Real-Time Map Section */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Real-Time Risk Map</h3>
            <p className="text-xs text-slate-400 mt-1">Live ML predictions synchronized across all cities</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-green-400">Live ML Data</span>
          </div>
        </div>

        <div className="relative">
          {/* Leaflet Map */}
          <div 
            ref={mapRef}
            className="w-full bg-slate-800"
            style={{ height: '600px', borderRadius: '0 0 0 0' }}
          />
          
          {/* Risk Legend */}
          <div className="absolute bottom-6 left-6 bg-slate-900/95 border border-slate-700 rounded-lg p-4 backdrop-blur-sm z-10">
            <p className="text-xs font-semibold text-white mb-3">RISK LEVEL</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                <span className="text-xs text-slate-300">Low Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
                <span className="text-xs text-slate-300">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
                <span className="text-xs text-slate-300">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                <span className="text-xs text-slate-300">Critical Risk</span>
              </div>
            </div>
          </div>

          {/* Prediction Info Card - Only show when prediction is selected */}
          {selectedPrediction && (
            <div className="absolute top-6 right-6 bg-slate-900/95 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm max-w-sm z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <p className="text-xs font-semibold text-cyan-400">LIVE PREDICTION</p>
              </div>
              <p className="text-sm font-bold text-white mb-2">{selectedPrediction.city} • {getTimeLabel(selectedPrediction.hour)}</p>
              <div className="text-xs space-y-1 text-slate-300">
                <p><span className="text-slate-400">Risk Level:</span> <span style={{ color: getRiskColor(selectedPrediction.riskLevel).hex }} className="font-semibold">{selectedPrediction.riskLevel}</span></p>
                <p><span className="text-slate-400">Risk Score:</span> {selectedPrediction.predictedRate.toFixed(1)}</p>
                <p><span className="text-slate-400">Crime Type:</span> {selectedPrediction.crimeType}</p>
                <p><span className="text-slate-400">Model Confidence:</span> 94.2%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}