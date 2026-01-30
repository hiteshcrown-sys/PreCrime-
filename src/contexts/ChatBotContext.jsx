import { createContext, useState, useCallback } from 'react';

export const ChatBotContext = createContext();

export const ChatBotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! 👋 I'm your AI Assistant. Ask me about crime predictions, how the model works, or anything else about this platform. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [currentFactors, setCurrentFactors] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const addMessage = useCallback((text, type = 'user') => {
    const newMessage = {
      id: Date.now(),
      type,
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const addBotMessage = useCallback((text) => {
    addMessage(text, 'bot');
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: "Hi! 👋 I'm your AI Assistant. Ask me about crime predictions, how the model works, or anything else about this platform. What would you like to know?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const updatePredictionContext = useCallback((prediction, factors, city, hour) => {
    setCurrentPrediction(prediction);
    setCurrentFactors(factors);
    setSelectedCity(city);
    setSelectedHour(hour);
  }, []);

  const value = {
    isOpen,
    toggleChat,
    messages,
    addMessage,
    addBotMessage,
    clearMessages,
    isLoading,
    setIsLoading,
    currentPrediction,
    currentFactors,
    selectedCity,
    selectedHour,
    updatePredictionContext
  };

  return (
    <ChatBotContext.Provider value={value}>
      {children}
    </ChatBotContext.Provider>
  );
};

export default ChatBotContext;
