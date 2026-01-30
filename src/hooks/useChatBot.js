import { useContext } from 'react';
import ChatBotContext from '@/contexts/ChatBotContext';

/**
 * Custom hook for accessing chatbot functionality
 * Provides interface for components to interact with chatbot state
 */
export const useChatBot = () => {
  const context = useContext(ChatBotContext);

  if (!context) {
    throw new Error('useChatBot must be used within ChatBotProvider');
  }

  return {
    // State
    isOpen: context.isOpen,
    messages: context.messages,
    isLoading: context.isLoading,
    currentPrediction: context.currentPrediction,
    currentFactors: context.currentFactors,
    selectedCity: context.selectedCity,
    selectedHour: context.selectedHour,

    // Actions
    toggleChat: context.toggleChat,
    addMessage: context.addMessage,
    addBotMessage: context.addBotMessage,
    clearMessages: context.clearMessages,
    updatePredictionContext: context.updatePredictionContext,
    setIsLoading: context.setIsLoading
  };
};

export default useChatBot;
