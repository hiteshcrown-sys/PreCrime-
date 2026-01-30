import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCity } from './CityContext';
import { livePatrolService } from '../services/livePatrolService';
import { crimeDataService } from '../api/crimeDataService';

const AlertContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const { selectedCity } = useCity();
  const [alerts, setAlerts] = useState([]);
  const [autoDispatch, setAutoDispatch] = useState(false);

  // Filtered alerts for the selected city
  const cityAlerts = alerts.filter(alert => alert.city === selectedCity);

  // Critical active alerts
  const criticalAlerts = cityAlerts.filter(
    (alert) => alert.severity === 'CRITICAL' && !alert.dispatched
  );

  // Recently dispatched alerts (for UI visibility)
  const recentDispatched = cityAlerts.filter(
    (alert) => alert.dispatched && (new Date() - new Date(alert.dispatchedAt) < 600000) // 10 minutes
  );

  const markAsDispatched = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId) {
          // Trigger patrol assignment
          const unit = livePatrolService.dispatchUnitToAlert?.(alert);

          // Add to intelligence stream via custom event
          window.dispatchEvent(new CustomEvent('intelligenceEvent', {
            detail: {
              type: 'dispatch',
              message: `Unit assigned to ${alert.zone} (${alert.type})`,
              severity: 'CRITICAL',
              timestamp: new Date(),
              unit: unit?.name
            }
          }));

          return { ...alert, dispatched: true, dispatchedAt: new Date(), assignedUnit: unit?.name };
        }
        return alert;
      })
    );
  }, []);

  const addAlert = useCallback((newAlert) => {
    const alertWithId = {
      ...newAlert,
      id: newAlert.id || `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: newAlert.timestamp || new Date(),
      dispatched: false
    };

    setAlerts((prev) => [alertWithId, ...prev].slice(0, 50));

    // Auto-dispatch logic
    if (autoDispatch && alertWithId.severity === 'CRITICAL' && alertWithId.city === selectedCity) {
      // Small delay for visual effect in feed
      setTimeout(() => markAsDispatched(alertWithId.id), 2000);
    }
  }, [autoDispatch, selectedCity, markAsDispatched]);

  // Initial load of alerts from hotspots
  useEffect(() => {
    const initAlerts = async () => {
      try {
        const hotspots = await crimeDataService.getHotspots(selectedCity);
        const initialAlerts = hotspots
          .filter(h => h.riskLevel === 'CRITICAL' || h.priority === 'CRITICAL')
          .map(h => ({
            id: `init-${h.id}`,
            city: selectedCity,
            zone: h.name,
            severity: 'CRITICAL',
            type: h.recommendations?.[0] || 'High Risk Area Detected',
            confidence: 90 + Math.floor(Math.random() * 8),
            lat: h.lat,
            lng: h.lng,
            timestamp: new Date(Date.now() - Math.random() * 3600000), // Within last hour
            dispatched: false
          }));

        setAlerts(prev => {
          // Merge avoiding duplicates
          const existingIds = new Set(prev.map(a => a.id));
          const netNew = initialAlerts.filter(a => !existingIds.has(a.id));
          return [...netNew, ...prev].slice(0, 50);
        });
      } catch (err) {
        console.error("Failed to init alerts:", err);
        // Dev Fallback: Add mock alerts if API fails
        const mockAlerts = [
          {
            id: `mock-1`,
            city: selectedCity,
            zone: "Risk Zone Alpha",
            severity: 'CRITICAL',
            type: "High Risk Pattern Detected",
            confidence: 94,
            lat: 0, lng: 0,
            timestamp: new Date(Date.now() - 120000), // 2 mins ago
            dispatched: false
          },
          {
            id: `mock-2`,
            city: selectedCity,
            zone: "Sector Gamma-4",
            severity: 'CRITICAL',
            type: "Predictive Threshold Warning",
            confidence: 89,
            lat: 0, lng: 0,
            timestamp: new Date(Date.now() - 600000), // 10 mins ago
            dispatched: false
          }
        ];
        setAlerts(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const netNew = mockAlerts.filter(a => !existingIds.has(a.id));
          return [...netNew, ...prev].slice(0, 50);
        });
      }
    };
    initAlerts();
  }, [selectedCity]);

  useEffect(() => {
    const handleCrimeDataUpdate = (event) => {
      const data = event.detail;

      // Map incoming data to alert format
      if (data.type === 'alert' || data.riskLevel === 'CRITICAL') {
        const newAlert = {
          city: data.city || selectedCity,
          zone: data.zone || data.name || 'Unknown Zone',
          severity: data.riskLevel || (data.riskRate >= 80 ? 'CRITICAL' : 'HIGH'),
          type: data.message || data.crimeType || 'Risk Threshold Exceeded',
          confidence: data.confidence || 85,
          lat: data.lat,
          lng: data.lng,
          predictedRate: data.riskRate || data.predictedRate
        };

        addAlert(newAlert);
      }
    };

    window.addEventListener('crimeDataUpdate', handleCrimeDataUpdate);
    return () => window.removeEventListener('crimeDataUpdate', handleCrimeDataUpdate);
  }, [selectedCity, addAlert]);

  // Clear alerts if city changes (optional, but requested "city-aware")
  // Actually, we filter them in the computed property, but maybe we want to keep history?
  // Let's keep them but filter by city in the getter.

  const value = {
    alerts,
    criticalAlerts,
    recentDispatched,
    markAsDispatched,
    autoDispatch,
    setAutoDispatch,
    addAlert
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
