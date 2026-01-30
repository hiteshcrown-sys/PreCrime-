import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const voiceExamples = [
  "Show high-risk zones tonight",
  "Explain prediction for Delhi",
  "Simulate patrol deployment",
  "Compare Mumbai and Bangalore risk",
  "Display crime patterns in Zone 5"
];

export default function VoiceCommand({ onCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleVoiceClick = () => {
    if (isListening) {
      setIsListening(false);
      setTranscript("");
    } else {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        const randomExample = voiceExamples[Math.floor(Math.random() * voiceExamples.length)];
        setTranscript(randomExample);
        setTimeout(() => {
          onCommand?.(randomExample);
          setIsListening(false);
          setTranscript("");
        }, 1500);
      }, 2000);
    }
  };

  return (
    <div className="relative">
      {/* Main voice button */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleVoiceClick}
          onMouseEnter={() => setShowExamples(true)}
          onMouseLeave={() => setShowExamples(false)}
          className={`w-14 h-14 rounded-full ${
            isListening 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-gradient-to-br from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        {/* Pulsing ring when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500"
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </motion.div>

      {/* Transcript display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-slate-900 border border-cyan-500/30 rounded-lg px-4 py-2 whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <p className="text-sm text-white">"{transcript}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example commands tooltip */}
      <AnimatePresence>
        {showExamples && !isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl p-4 w-64 z-50"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Voice Examples:</p>
            <div className="space-y-2">
              {voiceExamples.map((example, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Mic className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-300">{example}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}