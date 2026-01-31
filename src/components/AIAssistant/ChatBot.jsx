import { useContext, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Sparkles } from 'lucide-react';
import ChatBotContext from '@/contexts/ChatBotContext';
import { useAlerts } from '@/contexts/AlertContext';
import { generateChatbotResponse, getQuickSuggestions, getOutOfScopeResponse, isOutOfScope, getEthicalDisclaimer } from '@/utils/chatbotIntelligence';
import ReactMarkdown from 'react-markdown';
import { useTranslate } from '@/hooks/useTranslate';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChatBot() {
  const context = useContext(ChatBotContext);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { t } = useTranslate();
  const { selectedLanguage } = useLanguage();

  if (!context) {
    return null;
  }

  const {
    isOpen,
    toggleChat,
    messages,
    addMessage,
    addBotMessage,
    isLoading,
    setIsLoading,
    currentPrediction,
    currentFactors,
    selectedCity,
    selectedHour
  } = context;

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const { criticalAlerts, markAsDispatched } = useAlerts();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const text = inputValue.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    setInputValue('');
    setShowSuggestions(false);
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      let response = '';

      // Check for dispatch command
      const isDispatchCmd = /dispatch|send|patrol|डिस्पैच|गस्त|तैनात|गस्त/i.test(text); // Added Hindi/Marathi keywords
      if (isDispatchCmd && criticalAlerts.length > 0) {
        const targetAlert = criticalAlerts[0]; // Dispatch to highest priority/oldest active alert
        markAsDispatched(targetAlert.id);
        response = t('dispatchingPatrol')
          .replace('{type}', targetAlert.type)
          .replace('{zone}', targetAlert.zone);
      } else if (isDispatchCmd && criticalAlerts.length === 0) {
        response = t('noAlertsToDispatch');
      } else if (isOutOfScope(text)) {
        response = getOutOfScopeResponse(t);
      } else {
        // Generate intelligent response based on context
        response = generateChatbotResponse(text, {
          prediction: currentPrediction,
          factors: currentFactors,
          city: selectedCity,
          hour: selectedHour
        }, t);
      }

      addBotMessage(response);

      // Add ethical disclaimer if needed
      if (currentPrediction && getEthicalDisclaimer(currentPrediction, t)) {
        const disclaimer = getEthicalDisclaimer(currentPrediction, t);
        setTimeout(() => {
          addBotMessage(disclaimer);
        }, 800);
      }

      setIsLoading(false);
    }, 600);
  };

  const handleSuggestionClick = (suggestionQuery) => {
    inputValue.current = suggestionQuery;
    setTimeout(() => {
      const form = inputRef.current?.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 50);
  };

  const quickSuggestions = getQuickSuggestions(t, !!currentPrediction);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-2xl transition-all flex items-center justify-center hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={t('openAiAssistant')}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-[9999] w-96 max-w-[calc(100vw-24px)] h-[600px] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-b border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-white font-bold text-lg">{t('aiAssistant')}</h2>
              </div>
              <p className="text-xs text-slate-400">{t('askAboutPredictions')}</p>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${msg.type === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                      }`}
                  >
                    <div className="text-sm leading-relaxed">
                      {msg.type === 'bot' ? (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-cyan-400">{children}</strong>,
                            em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-2">{children}</ul>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            h1: ({ children }) => <h1 className="font-bold text-cyan-400 mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="font-bold text-cyan-400 mb-1">{children}</h2>,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <span className="text-xs opacity-60 mt-2 block">
                      {msg.timestamp.toLocaleTimeString(selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'mr' ? 'mr-IN' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none border border-slate-700">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick suggestions - shown when chat is empty or fresh */}
              {showSuggestions && messages.length <= 1 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 mt-4"
                >
                  <p className="text-xs text-slate-500 px-2">{t('quickQuestions')}</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion.query)}
                        className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 px-2 py-1 rounded-full border border-slate-600/50 hover:border-cyan-500/50 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                      >
                        {suggestion.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-slate-700 p-4 bg-slate-900/50 backdrop-blur-sm"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('askAnything')}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50 transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg p-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
