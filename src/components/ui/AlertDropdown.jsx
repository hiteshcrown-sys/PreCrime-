import React from 'react';
import { AlertTriangle, MapPin, Zap, Shield, Clock, Navigation } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';

export default function AlertDropdown() {
    const { criticalAlerts, recentDispatched, markAsDispatched } = useAlerts();

    if (criticalAlerts.length === 0 && recentDispatched.length === 0) {
        return (
            <div className="py-12 px-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-slate-800/50">
                        <Zap className="w-8 h-8 text-slate-600" />
                    </div>
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sector Secured</h3>
                <p className="text-[10px] text-slate-600 mt-2 leading-relaxed"> No critical alerts in this jurisdiction. Monitoring live intelligence streams...</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Active Critical Alerts */}
            {criticalAlerts.map((alert) => (
                <div
                    key={alert.id}
                    className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 group hover:border-red-500/40 transition-all shadow-lg shadow-red-500/5"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-lg bg-red-500/20 text-red-500 border border-red-500/30">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="font-black text-white text-xs uppercase tracking-tighter truncate">
                                    {alert.type || 'Operational Alert'}
                                </p>
                                <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 bg-slate-800/50 px-1.5 py-0.5 rounded">
                                    <Clock className="w-2.5 h-2.5" />
                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mb-4">
                                <MapPin className="w-3 h-3 text-red-500/70" />
                                {alert.zone || 'Monitoring Sector'}
                            </p>

                            <button
                                onClick={() => markAsDispatched(alert.id)}
                                className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-xl shadow-red-900/40 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.1em]"
                            >
                                <Navigation className="w-3.5 h-3.5" />
                                DISPATCH UNIT
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Recently Dispatched Units */}
            {recentDispatched.length > 0 && (
                <div className="space-y-4 pt-6 mt-2 border-t border-slate-800/50">
                    <div className="px-2 flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase whitespace-nowrap">Recently Dispatched</span>
                        <div className="h-px w-full bg-slate-800/50"></div>
                    </div>

                    {recentDispatched.map((alert) => (
                        <div
                            key={`dispatched-${alert.id}`}
                            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 opacity-90 backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="font-bold text-slate-200 text-xs uppercase tracking-tight truncate">
                                            {alert.zone}
                                        </p>
                                        <Badge className="bg-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase px-2 py-0.5 border-cyan-500/30">
                                            EN ROUTE
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-500">
                                        Tactical unit assigned at {new Date(alert.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Badge({ children, className }) {
    return (
        <span className={`rounded text-[10px] font-bold border ${className}`}>
            {children}
        </span>
    );
}
