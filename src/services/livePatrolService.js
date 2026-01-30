import { crimeDataService } from '../api/crimeDataService';

/**
 * livePatrolService.js
 * 
 * Simulates real-time police patrol movements and status updates.
 * Interfaces with crimeDataService for live ML hotspot data.
 */

class LivePatrolService {
    constructor() {
        this.patrols = new Map(); // Store by city
        this.unitNames = ["Patrol Alpha", "Patrol Beta", "Patrol Gamma", "Patrol Delta", "Patrol Epsilon"];
    }

    /**
     * Initialize or get patrols for a city
     * @param {string} city 
     * @param {Array} hotspots 
     */
    getCityPatrols(city, hotspots = []) {
        if (!this.patrols.has(city)) {
            this.patrols.set(city, this.initializePatrols(city, hotspots));
        }
        return this.patrols.get(city);
    }

    /**
     * Create initial patrol units for a city
     */
    initializePatrols(city, hotspots) {
        // Default center if no hotspots
        const centerLat = 28.6139; // Delhi as default
        const centerLng = 77.2090;

        return this.unitNames.map((name, index) => {
            // Randomly stagger units around the city
            const startLat = hotspots.length > 0
                ? hotspots[index % hotspots.length].lat + (Math.random() - 0.5) * 0.05
                : centerLat + (Math.random() - 0.5) * 0.1;

            const startLng = hotspots.length > 0
                ? hotspots[index % hotspots.length].lng + (Math.random() - 0.5) * 0.05
                : centerLng + (Math.random() - 0.5) * 0.1;

            return {
                id: `unit-${city}-${index}`,
                name,
                lat: startLat,
                lng: startLng,
                status: "Idle", // Idle, En Route, Responding
                targetHotspot: null,
                history: [{ lat: startLat, lng: startLng }]
            };
        });
    }

    /**
     * Update patrol positions based on targets
     */
    updatePatrols(city, hotspots) {
        if (!this.patrols.has(city)) return [];

        const cityUnits = this.patrols.get(city);
        const updatedUnits = cityUnits.map(unit => {
            // Logic: If the unit has no target or its target has low risk, find the nearest high-risk hotspot
            const highRiskHotspots = hotspots.filter(h => h.riskLevel === 'CRITICAL' || h.riskLevel === 'HIGH');

            let target = unit.targetHotspot;

            // Assign new target if idle or current target is not critical
            if (!target || target.riskLevel !== 'CRITICAL') {
                if (highRiskHotspots.length > 0) {
                    // Find nearest available high risk hotspot
                    target = highRiskHotspots[Math.floor(Math.random() * highRiskHotspots.length)];
                }
            }

            const newUnit = { ...unit, targetHotspot: target };

            if (target) {
                // Move towards target
                const dx = target.lat - unit.lat;
                const dy = target.lng - unit.lng;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Step size (simulating patrol speed)
                const step = 0.002;

                if (dist > step) {
                    newUnit.lat += (dx / dist) * step;
                    newUnit.lng += (dy / dist) * step;
                    newUnit.status = dist < 0.01 ? "Responding" : "En Route";
                } else {
                    newUnit.status = "Responding";
                }
            } else {
                // Random drift for idle patrols
                newUnit.lat += (Math.random() - 0.5) * 0.0005;
                newUnit.lng += (Math.random() - 0.5) * 0.0005;
                newUnit.status = "Idle";
            }

            return newUnit;
        });

        this.patrols.set(city, updatedUnits);
        return updatedUnits;
    }
}

export const livePatrolService = new LivePatrolService();
