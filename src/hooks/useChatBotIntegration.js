/**
 * ChatBot Integration Helper
 * Provides utility functions for pages to share prediction data with the chatbot
 */

import { useChatBot } from '@/hooks/useChatBot';

/**
 * Hook for pages to update chatbot with prediction context
 * Call this whenever you have prediction data to share
 * 
 * Example usage in a page:
 * const { updateChatBotContext } = useChatBotIntegration();
 * 
 * useEffect(() => {
 *   if (mlPrediction && dynamicFactors) {
 *     updateChatBotContext({
 *       prediction: mlPrediction,
 *       factors: dynamicFactors,
 *       city: selectedCity.name,
 *       hour: new Date().getHours()
 *     });
 *   }
 * }, [mlPrediction, dynamicFactors]);
 */
export const useChatBotIntegration = () => {
  const { updatePredictionContext } = useChatBot();

  return {
    updateChatBotContext: ({
      prediction,
      factors,
      city,
      hour,
      model = 'Gradient Boosting'
    }) => {
      updatePredictionContext(prediction, factors, city, hour);
    }
  };
};

/**
 * Quick update function for commonly formatted data
 */
export const updateChatBotWithPrediction = (chatBot, prediction, factors, city, hour) => {
  if (chatBot && chatBot.updatePredictionContext) {
    chatBot.updatePredictionContext(prediction, factors, city, hour);
  }
};

export default useChatBotIntegration;
