import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Navigation, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DispatchAlert({ isVisible, onDispatch, onDismiss }) {
  const [isDispatching, setIsDispatching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setShowSuccess(true);
      onDispatch?.();
      setTimeout(() => {
        setShowSuccess(false);
        onDismiss?.();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-20"
        >
          {!showSuccess ? (
            <div className="bg-gradient-to-br from-red-900/95 to-orange-900/95 backdrop-blur-md border-2 border-red-500/50 rounded-xl p-5 shadow-2xl min-w-[380px]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Smart Dispatch Alert</p>
                    <p className="text-xs text-red-200">High-Risk Zone Uncovered</p>
                  </div>
                </div>
                <button 
                  onClick={onDismiss}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 mb-3 border border-red-500/30">
                <p className="text-sm text-white mb-2">
                  <span className="font-bold text-red-400">Zone West-5:</span> 87% Risk | 
                  <span className="text-red-300"> NO PATROL</span>
                </p>
                <div className="h-px bg-red-500/30 my-2" />
                <p className="text-xs text-cyan-400 mb-2">
                  <span className="font-semibold">AI Suggests:</span> Redirect Unit 2
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">From:</span> 
                    <span className="text-white ml-1">East-3</span>
                  </div>
                  <div>
                    <span className="text-slate-400">To:</span> 
                    <span className="text-white ml-1">West-5</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Distance:</span> 
                    <span className="text-white ml-1">6.5 km</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ETA:</span> 
                    <span className="text-white ml-1">12 min</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              >
                {isDispatching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <Navigation className="w-4 h-4 mr-2" />
                )}
                {isDispatching ? "Dispatching..." : "Dispatch Now"}
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-md border-2 border-green-500/50 rounded-xl p-5 shadow-2xl min-w-[380px]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Dispatch Successful</p>
                  <p className="text-xs text-green-200">Unit 2 en route to West-5</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}