import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { livePatrolService } from '@/services/livePatrolService';
import { crimeDataService } from '@/api/crimeDataService';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, Navigation, Info } from 'lucide-react';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Police Car Icon
const createPatrolIcon = (status) => {
    const color = status === 'Responding' ? '#ef4444' : status === 'En Route' ? '#06b6d4' : '#000000';
    const strokeColor = '#000000';
    return L.divIcon({
        html: `<div style="transform: rotate(0deg); transition: transform 0.5s;">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11L3 13V19C3 19.5523 3.44772 20 4 20H5C5.55228 20 6 19.5523 6 19V18H18V19C18 19.5523 18.4477 20 19 20H20C20.5523 20 21 19.5523 21 19V13L19 11M5 11L7 5H17L19 11M5 11H19M8 15H8.01M16 15H16.01" stroke="${strokeColor}" stroke-width="2" fill="rgba(255,255,255,0.4)" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="9" y="3" width="6" height="2" rx="1" fill="${status === 'Responding' ? '#ef4444' : (status === 'En Route' ? '#06b6d4' : '#000000')}" stroke="${strokeColor}" stroke-width="0.5" class="${status === 'Responding' ? 'animate-pulse' : ''}"/>
            </svg>
            <div style="position: absolute; top: -5px; right: -5px; width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; border: 2px solid white;"></div>
           </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
};

// Component to handle map view reset when city changes
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13, { duration: 1.5 });
    }, [center, map]);
    return null;
}

export default function PatrolTrackerMap({ city, showRoutes = true, onStatusChange }) {
    const [hotspots, setHotspots] = useState([]);
    const [patrols, setPatrols] = useState([]);
    const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi default
    const [loading, setLoading] = useState(true);

    // Fetch hotspots and initialize patrols
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const hotspotData = await crimeDataService.getHotspots(city);
                const hotspotsArray = Array.isArray(hotspotData) ? hotspotData : (hotspotData?.hotspots || []);
                setHotspots(hotspotsArray);

                if (hotspotsArray.length > 0) {
                    const first = hotspotsArray[0];
                    setMapCenter([first.lat || first.coordinates?.[0], first.lng || first.coordinates?.[1]]);
                }

                const initialPatrols = livePatrolService.getCityPatrols(city, hotspotsArray);
                setPatrols(initialPatrols);

                // Initial status report
                if (onStatusChange) {
                    const counts = initialPatrols.reduce((acc, p) => {
                        acc[p.status] = (acc[p.status] || 0) + 1;
                        return acc;
                    }, {});
                    onStatusChange(counts);
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to load map data:", error);
                setLoading(false);
            }
        };

        loadData();
    }, [city]);

    // Simulation interval for patrol movements
    useEffect(() => {
        const interval = setInterval(() => {
            if (hotspots.length > 0) {
                const updated = livePatrolService.updatePatrols(city, hotspots);
                setPatrols([...updated]);

                if (onStatusChange) {
                    const counts = updated.reduce((acc, p) => {
                        acc[p.status] = (acc[p.status] || 0) + 1;
                        return acc;
                    }, {});
                    onStatusChange(counts);
                }
            }
        }, 4000); // Update every 4 seconds

        return () => clearInterval(interval);
    }, [city, hotspots, onStatusChange]);

    const getRiskColor = (level) => {
        switch (level) {
            case 'CRITICAL': return '#ef4444';
            case 'HIGH': return '#f97316';
            case 'MEDIUM': return '#eab308';
            case 'LOW': return '#22c55e';
            default: return '#3b82f6';
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium">Calibrating Satellite Matrix for {city}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', background: '#f8fafc' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeView center={mapCenter} />

                {/* Render Hotspots */}
                {Array.isArray(hotspots) && hotspots.map((hotspot) => (
                    <React.Fragment key={hotspot.id}>
                        <Circle
                            center={[hotspot.lat || hotspot.coordinates?.[0], hotspot.lng || hotspot.coordinates?.[1]]}
                            radius={800}
                            pathOptions={{
                                fillColor: getRiskColor(hotspot.riskLevel || hotspot.priority),
                                fillOpacity: 0.15,
                                color: getRiskColor(hotspot.riskLevel || hotspot.priority),
                                weight: 1,
                                dashArray: '5, 5'
                            }}
                        />
                        {/* Core marker for the spot */}
                        <Marker
                            position={[hotspot.lat || hotspot.coordinates?.[0], hotspot.lng || hotspot.coordinates?.[1]]}
                            icon={L.divIcon({
                                html: `<div class="relative">
                        <div class="absolute -inset-2 rounded-full border-2 border-dashed animate-spin" style="border-color: ${getRiskColor(hotspot.riskLevel || hotspot.priority)}; opacity: 0.5;"></div>
                        <div class="w-4 h-4 rounded-full shadow-lg" style="background-color: ${getRiskColor(hotspot.riskLevel || hotspot.priority)}; border: 2px solid white;"></div>
                        ${(hotspot.riskLevel === 'CRITICAL' || hotspot.priority === 'CRITICAL') ? `<div class="absolute -inset-4 rounded-full bg-red-500/20 animate-ping"></div>` : ''}
                       </div>`,
                                className: '',
                                iconSize: [20, 20],
                                iconAnchor: [10, 10]
                            })}
                        >
                            <Popup className="custom-popup">
                                <div className="p-3 bg-white">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Zone</div>
                                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">{hotspot.name}</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Risk Level</span>
                                            <span className="font-bold" style={{ color: getRiskColor(hotspot.riskLevel || hotspot.priority) }}>{hotspot.riskLevel || hotspot.priority}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Detection Conf.</span>
                                            <span className="text-slate-900 font-medium">94.2%</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    </React.Fragment>
                ))}

                {/* Render Patrol Units */}
                {patrols.map((patrol) => (
                    <React.Fragment key={patrol.id}>
                        <Marker
                            position={[patrol.lat, patrol.lng]}
                            icon={createPatrolIcon(patrol.status)}
                        >
                            <Popup>
                                <div className="min-w-[160px] p-1">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-slate-900 text-sm">{patrol.name}</span>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full text-white font-bold tracking-tighter ${patrol.status === 'Responding' ? 'bg-red-500' :
                                            patrol.status === 'En Route' ? 'bg-cyan-500' : 'bg-slate-500'
                                            }`}>
                                            {patrol.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-600">
                                            <Navigation className="w-3 h-3 text-cyan-500" />
                                            <span>{patrol.status === 'Idle' ? 'Area Patrol' : `To: ${patrol.targetHotspot?.name}`}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                            <div className={`h-full bg-cyan-500 ${patrol.status !== 'Idle' ? 'animate-pulse' : ''}`} style={{ width: patrol.status === 'Responding' ? '90%' : '40%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Render Route to Target */}
                        {showRoutes && patrol.targetHotspot && (
                            <Polyline
                                positions={[
                                    [patrol.lat, patrol.lng],
                                    [patrol.targetHotspot.lat || patrol.targetHotspot.coordinates?.[0], patrol.targetHotspot.lng || patrol.targetHotspot.coordinates?.[1]]
                                ]}
                                pathOptions={{
                                    color: patrol.status === 'Responding' ? '#ef4444' : '#06b6d4',
                                    weight: 3,
                                    dashArray: '10, 10',
                                    opacity: 0.5,
                                    className: 'animate-dash'
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* Map Overlay HUD */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <div className="bg-white/95 border border-slate-200 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Unit Telemetry</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-1 px-2 rounded-md bg-red-100 text-red-600 font-bold text-[10px]">SOS</div>
                            <span className="text-[11px] text-slate-700 font-medium">Responding (Critical)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 px-2 rounded-md bg-cyan-100 text-cyan-600 font-bold text-[10px]">NAV</div>
                            <span className="text-[11px] text-slate-700 font-medium">Intercepting Pattern</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 px-2 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">IDL</div>
                            <span className="text-[11px] text-slate-700 font-medium">Standard Surveillance</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
