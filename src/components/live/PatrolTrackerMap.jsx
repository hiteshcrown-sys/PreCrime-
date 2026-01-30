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

// Custom Patrol Icon
const createPatrolIcon = (status) => {
    const color = status === 'Responding' ? '#ef4444' : status === 'En Route' ? '#06b6d4' : '#94a3b8';
    return L.divIcon({
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; items-center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
           </div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

// Component to handle map view reset when city changes
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 12, { animate: true });
    }, [center, map]);
    return null;
}

export default function PatrolTrackerMap({ city, showRoutes = true }) {
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
                setHotspots(hotspotData);

                if (hotspotData.length > 0) {
                    setMapCenter([hotspotData[0].lat, hotspotData[0].lng]);
                }

                const initialPatrols = livePatrolService.getCityPatrols(city, hotspotData);
                setPatrols(initialPatrols);
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
            }
        }, 4000); // Update every 4 seconds

        return () => clearInterval(interval);
    }, [city, hotspots]);

    const getRiskColor = (level) => {
        switch (level) {
            case 'CRITICAL': return '#ef4444';
            case 'HIGH': return '#f97316';
            case 'MEDIUM': return '#eab308';
            case 'LOW': return '#22c55e';
            default: return '#94a3b8';
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium">Initializing Patrol Network for {city}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <MapContainer
                center={mapCenter}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', background: '#0a0f1a' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <ChangeView center={mapCenter} />

                {/* Render Hotspots */}
                {hotspots.map((hotspot) => (
                    <Circle
                        key={hotspot.id}
                        center={[hotspot.lat, hotspot.lng]}
                        radius={800} // fixed radius for visualization
                        pathOptions={{
                            fillColor: getRiskColor(hotspot.riskLevel),
                            fillOpacity: 0.2,
                            color: getRiskColor(hotspot.riskLevel),
                            weight: 2,
                            className: hotspot.riskLevel === 'CRITICAL' ? 'animate-pulse' : ''
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h4 className="font-bold text-slate-900">{hotspot.name}</h4>
                                <p className="text-sm text-slate-700">Risk: <span className="font-semibold" style={{ color: getRiskColor(hotspot.riskLevel) }}>{hotspot.riskLevel}</span></p>
                                <div className="mt-2 text-xs text-slate-500 italic">ML Confidence: 94%</div>
                            </div>
                        </Popup>
                    </Circle>
                ))}

                {/* Render Patrol Units */}
                {patrols.map((patrol) => (
                    <React.Fragment key={patrol.id}>
                        <Marker
                            position={[patrol.lat, patrol.lng]}
                            icon={createPatrolIcon(patrol.status)}
                        >
                            <Popup>
                                <div className="min-w-[150px]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-slate-900">{patrol.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${patrol.status === 'Responding' ? 'bg-red-500' :
                                                patrol.status === 'En Route' ? 'bg-cyan-500' : 'bg-slate-500'
                                            }`}>
                                            {patrol.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Target: {patrol.targetHotspot?.name || 'Monitoring'}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Render Route to Target */}
                        {showRoutes && patrol.targetHotspot && (
                            <Polyline
                                positions={[
                                    [patrol.lat, patrol.lng],
                                    [patrol.targetHotspot.lat, patrol.targetHotspot.lng]
                                ]}
                                pathOptions={{
                                    color: patrol.status === 'Responding' ? '#ef4444' : '#06b6d4',
                                    weight: 2,
                                    dashArray: '5, 10',
                                    opacity: 0.6
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* Map Overlay HUD */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-xl backdrop-blur-md shadow-lg">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Network Legend</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                            <span className="text-[10px] text-white">Critical Risk Zone</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                            <span className="text-[10px] text-white">Patrol En Route</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-dashed border-cyan-500/50" />
                            <span className="text-[10px] text-white">Predictive Route</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
