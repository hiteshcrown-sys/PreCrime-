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
                targetAlert: null,
                history: [{ lat: startLat, lng: startLng }]
            };
        });
    }

    /**
     * Explicitly dispatch a unit to an alert
     * @param {Object} alert 
     */
    dispatchUnitToAlert(alert) {
        const city = alert.city;
        const units = this.patrols.get(city);
        if (!units) return null;

        // Find nearest idle or en-route unit
        let nearestUnit = null;
        let minDist = Infinity;

        units.forEach(unit => {
            const dx = alert.lat - unit.lat;
            const dy = alert.lng - unit.lng;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Prioritize Idle units
            const weight = unit.status === "Idle" ? 0.5 : 1.0;
            const weightedDist = dist * weight;

            if (weightedDist < minDist) {
                minDist = weightedDist;
                nearestUnit = unit;
            }
        });

        if (nearestUnit) {
            nearestUnit.targetAlert = alert;
            nearestUnit.status = "Responding";
            nearestUnit.targetHotspot = null; // Clear hotspot target
            return nearestUnit;
        }

        return null;
    }

    /**
     * Update patrol positions based on targets
     */
    updatePatrols(city, hotspots) {
        if (!this.patrols.has(city)) return [];

        const cityUnits = this.patrols.get(city);
        const updatedUnits = cityUnits.map(unit => {
            let target = unit.targetAlert || unit.targetHotspot;

            // If no active alert target, look for critical hotspots
            if (!unit.targetAlert) {
                const highRiskHotspots = hotspots.filter(h => h.riskLevel === 'CRITICAL' || h.riskLevel === 'HIGH');
                if (!target || (target.riskLevel !== 'CRITICAL' && highRiskHotspots.length > 0)) {
                    target = highRiskHotspots[Math.floor(Math.random() * highRiskHotspots.length)];
                    unit.targetHotspot = target;
                }
            }

            const newUnit = { ...unit };

            if (target) {
                // Move towards target
                const dx = target.lat - unit.lat;
                const dy = target.lng - unit.lng;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Step size (simulating patrol speed)
                // Dispatched alerts get faster speed
                const step = unit.targetAlert ? 0.003 : 0.002;

                if (dist > 0.001) {
                    newUnit.lat += (dx / dist) * step;
                    newUnit.lng += (dy / dist) * step;
                    newUnit.status = dist < 0.01 ? "Responding" : "En Route";
                } else {
                    newUnit.status = "Responding";
                    // If arrived at alert, clear it (simplified)
                    if (unit.targetAlert && dist < 0.002) {
                        newUnit.targetAlert = null;
                    }
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
