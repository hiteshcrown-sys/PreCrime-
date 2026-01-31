import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
/**
 * RealTimeMap Component
 * Real-time interactive map displaying:
 * - 29 Indian cities with crime rates
 * - 159 hotspots with crime density visualization
 * - Live crime alerts and updates
 */
const RealTimeMap = ({ showHotspots = true, showCities = true, selectedCity = null, onCitySelect = null }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    // 29 major Indian cities with coordinates and crime rates
    const citiesData = [
        { name: 'Delhi', coords: [28.7041, 77.2160], crimeRate: 542.82, riskLevel: 'CRITICAL' },
        { name: 'Mumbai', coords: [19.0760, 72.8777], crimeRate: 487.45, riskLevel: 'CRITICAL' },
        { name: 'Bangalore', coords: [12.9716, 77.5946], crimeRate: 412.34, riskLevel: 'HIGH' },
        { name: 'Hyderabad', coords: [17.3850, 78.4867], crimeRate: 398.56, riskLevel: 'HIGH' },
        { name: 'Chennai', coords: [13.0827, 80.2707], crimeRate: 367.89, riskLevel: 'HIGH' },
        { name: 'Kolkata', coords: [22.5726, 88.3639], crimeRate: 345.23, riskLevel: 'MEDIUM' },
        { name: 'Pune', coords: [18.5204, 73.8567], crimeRate: 298.45, riskLevel: 'MEDIUM' },
        { name: 'Ahmedabad', coords: [23.0225, 72.5714], crimeRate: 287.12, riskLevel: 'MEDIUM' },
        { name: 'Jaipur', coords: [26.9124, 75.7873], crimeRate: 276.34, riskLevel: 'MEDIUM' },
        { name: 'Lucknow', coords: [26.8467, 80.9462], crimeRate: 265.78, riskLevel: 'MEDIUM' },
        { name: 'Indore', coords: [22.7196, 75.8577], crimeRate: 198.56, riskLevel: 'LOW' },
        { name: 'Kanpur', coords: [26.4499, 80.3319], crimeRate: 187.34, riskLevel: 'LOW' },
        { name: 'Thane', coords: [19.2183, 72.9781], crimeRate: 176.45, riskLevel: 'LOW' },
        { name: 'Bhopal', coords: [23.1815, 79.9864], crimeRate: 165.23, riskLevel: 'LOW' },
        { name: 'Visakhapatnam', coords: [17.6869, 83.2185], crimeRate: 154.67, riskLevel: 'LOW' },
        { name: 'Pimpri-Chinchwad', coords: [18.6298, 73.7997], crimeRate: 143.45, riskLevel: 'LOW' },
        { name: 'Patna', coords: [25.5941, 85.1376], crimeRate: 132.78, riskLevel: 'VERY_LOW' },
        { name: 'Vadodara', coords: [22.3072, 73.1812], crimeRate: 121.34, riskLevel: 'VERY_LOW' },
        { name: 'Ghaziabad', coords: [28.6692, 77.4538], crimeRate: 109.56, riskLevel: 'VERY_LOW' },
        { name: 'Ludhiana', coords: [30.9010, 75.8573], crimeRate: 98.45, riskLevel: 'VERY_LOW' },
        { name: 'Agra', coords: [27.1767, 78.0081], crimeRate: 87.23, riskLevel: 'VERY_LOW' },
        { name: 'Nagpur', coords: [21.1458, 79.0882], crimeRate: 76.56, riskLevel: 'VERY_LOW' },
        { name: 'Indira Nagar', coords: [28.6139, 77.2090], crimeRate: 65.34, riskLevel: 'VERY_LOW' },
        { name: 'Srinagar', coords: [34.0837, 74.7973], crimeRate: 54.78, riskLevel: 'VERY_LOW' },
        { name: 'Meerut', coords: [28.9845, 77.7064], crimeRate: 49.23, riskLevel: 'VERY_LOW' },
        { name: 'Ranchi', coords: [23.3441, 85.3096], crimeRate: 44.56, riskLevel: 'VERY_LOW' },
        { name: 'Bhubaneswar', coords: [20.2961, 85.8245], crimeRate: 39.67, riskLevel: 'VERY_LOW' },
        { name: 'Aligarh', coords: [27.8974, 77.8926], crimeRate: 36.45, riskLevel: 'VERY_LOW' },
        { name: 'Rajkot', coords: [22.3039, 70.8022], crimeRate: 33.28, riskLevel: 'VERY_LOW' },
    ];
    // Sample hotspots data (subset for performance)
    const hotspotsData = [
        // Delhi Hotspots
        { id: 1, city: 'Delhi', name: 'South Delhi Cluster', coords: [28.5244, 77.1855], density: 94.5, priority: 'CRITICAL' },
        { id: 2, city: 'Delhi', name: 'New Delhi Station', coords: [28.6432, 77.2197], density: 87.3, priority: 'CRITICAL' },
        { id: 3, city: 'Delhi', name: 'Connaught Place', coords: [28.6329, 77.1842], density: 82.1, priority: 'CRITICAL' },
        { id: 4, city: 'Delhi', name: 'Dwarka Sector', coords: [28.5921, 77.0460], density: 78.9, priority: 'HIGH' },
        { id: 5, city: 'Delhi', name: 'Rohini Extension', coords: [28.7500, 77.0667], density: 76.4, priority: 'HIGH' },
        // Mumbai Hotspots
        { id: 25, city: 'Mumbai', name: 'Fort District', coords: [18.9676, 72.8194], density: 89.2, priority: 'CRITICAL' },
        { id: 26, city: 'Mumbai', name: 'CST Terminal', coords: [18.9320, 72.8297], density: 85.6, priority: 'CRITICAL' },
        { id: 27, city: 'Mumbai', name: 'Churchgate', coords: [18.9435, 72.8273], density: 81.4, priority: 'CRITICAL' },
        // Bangalore Hotspots
        { id: 51, city: 'Bangalore', name: 'MG Road Zone', coords: [12.9352, 77.6245], density: 78.9, priority: 'HIGH' },
        { id: 52, city: 'Bangalore', name: 'Whitefield Cluster', coords: [13.0013, 77.7399], density: 76.2, priority: 'HIGH' },
    ];
    // Get color based on risk level
    const getRiskColor = (riskLevel) => {
        const colors = {
            'CRITICAL': '#dc2626',
            'HIGH': '#f97316',
            'MEDIUM': '#eab308',
            'LOW': '#3b82f6',
            'VERY_LOW': '#10b981'
        };
        return colors[riskLevel] || '#666';
    };
    // Initialize map
    useEffect(() => {
        if (!mapContainer.current)
            return;
        // Create map centered on India
        map.current = L.map(mapContainer.current).setView([23.5, 78.5], 5);
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            tileSize: 256,
        }).addTo(map.current);
        setMapReady(true);
        return () => {
            if (map.current) {
                map.current.off();
                map.current.remove();
            }
        };
    }, []);
    // Add city markers
    useEffect(() => {
        if (!mapReady || !map.current || !showCities)
            return;
        citiesData.forEach((city) => {
            const color = getRiskColor(city.riskLevel);
            const marker = L.circleMarker([city.coords[0], city.coords[1]], {
                radius: Math.min(city.crimeRate / 100, 20),
                fillColor: color,
                color: color,
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7,
            }).addTo(map.current);
            marker.bindPopup(`
        <div class="font-semibold text-gray-900">${city.name}</div>
        <div class="text-sm text-gray-700">Crime Rate: ${city.crimeRate.toFixed(2)}</div>
        <div class="text-sm text-gray-700">Risk: <span style="color: ${color}; font-weight: bold;">${city.riskLevel}</span></div>
      `);
            marker.on('click', () => {
                setSelectedMarker(city.name);
                if (onCitySelect)
                    onCitySelect(city.name);
            });
            // Highlight if selected
            if (selectedCity === city.name) {
                marker.setStyle({ weight: 4, fillOpacity: 1 });
            }
        });
    }, [mapReady, showCities, selectedCity]);
    // Add hotspot markers
    useEffect(() => {
        if (!mapReady || !map.current || !showHotspots)
            return;
        hotspotsData.forEach((hotspot) => {
            const color = getRiskColor(hotspot.priority);
            const marker = L.circleMarker([hotspot.coords[0], hotspot.coords[1]], {
                radius: 6,
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.5,
                className: 'hotspot-marker'
            }).addTo(map.current);
            marker.bindPopup(`
        <div class="font-semibold text-gray-900">${hotspot.name}</div>
        <div class="text-sm text-gray-700">${hotspot.city}</div>
        <div class="text-sm text-gray-700">Crime Density: ${hotspot.density.toFixed(1)}%</div>
        <div class="text-sm text-gray-700">Priority: <span style="color: ${color}; font-weight: bold;">${hotspot.priority}</span></div>
      `);
        });
    }, [mapReady, showHotspots]);
    return (_jsxs("div", { className: "w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700", children: [_jsx("div", { ref: mapContainer, className: "w-full h-full min-h-[500px]" }), _jsxs("div", { className: "absolute bottom-4 right-4 bg-slate-800/90 border border-slate-600 rounded-lg p-3 max-w-xs", children: [_jsx("h3", { className: "text-white font-semibold mb-3 text-sm", children: "Risk Levels" }), _jsx("div", { className: "space-y-2", children: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW'].map((level) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: getRiskColor(level) } }), _jsx("span", { className: "text-xs text-slate-300", children: level })] }, level))) })] }), selectedMarker && (_jsxs("div", { className: "absolute top-4 left-4 bg-slate-800/90 border border-cyan-500/30 rounded-lg p-4 max-w-xs", children: [_jsx("div", { className: "text-cyan-400 font-semibold", children: selectedMarker }), _jsx("p", { className: "text-slate-300 text-sm mt-1", children: "Click on markers to view details" })] }))] }));
};
export default RealTimeMap;
