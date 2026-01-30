/**
 * Chatbot Intelligence Service
 * 
 * Handles smart query matching, context awareness, and dynamic response generation
 * Ensures all responses are:
 * - Non-technical and accessible
 * - Transparent about limitations
 * - Based on actual model outputs
 * - Ethical and non-alarmist
 */

import {
  generateAnswerForQuery,
  generateFeatureExplanation,
  generateDynamicInsights,
  getRiskDescription,
  getConfidenceLevel,
  getConfidencePercentage
} from './explanationGenerator';

/**
 * Query classifier - identifies what type of question the user is asking
 */
const classifyQuery = (query) => {
  const lower = query.toLowerCase();

  if (lower.includes('why') || lower.includes('reason') || lower.includes('cause')) {
    return 'explanation_why';
  }
  if (lower.includes('how') && (lower.includes('work') || lower.includes('decide') || lower.includes('predict'))) {
    return 'how_it_works';
  }
  if (lower.includes('trust') || lower.includes('reliable') || lower.includes('accurate')) {
    return 'trust_reliability';
  }
  if (lower.includes('factor') || lower.includes('affect') || lower.includes('influence')) {
    return 'factors_importance';
  }
  if (lower.includes('confident') || lower.includes('confidence') || lower.includes('sure')) {
    return 'confidence';
  }
  if (lower.includes('simple') || lower.includes('easy') || lower.includes('explain')) {
    return 'simplify';
  }
  if (lower.includes('help') || lower.includes('what can you') || lower.includes('what do you')) {
    return 'help';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'greeting';
  }

  return 'general_question';
};

/**
 * Determine if chatbot should provide responses without active prediction context
 */
const generateContextlesResponse = (queryType) => {
  const responses = {
    greeting: `Hi there! 👋 I'm your AI Assistant for understanding crime predictions. I can explain:
• How crime predictions work
• What factors influence risk levels
• How confident the model is
• Whether you can trust these predictions
• And much more!

Try asking a question about crime predictions or the platform!`,

    help: `I can help you understand:
✓ **Crime Predictions** - Why certain areas show different risk levels
✓ **How the AI Works** - What data and logic goes into predictions
✓ **Factors & Importance** - What influences the prediction results
✓ **Confidence Levels** - How sure the model is about its predictions
✓ **Trust & Reliability** - Whether you can rely on these predictions
✓ **General Questions** - Anything about the platform

Just ask me any question! When you select a city and time, I can give specific, personalized explanations.`,

    how_it_works: `The AI prediction works like this:

1. **Historical Analysis** 📚 - Looks at patterns from the past
2. **Pattern Matching** 🔍 - Finds similar situations to today
3. **Pattern Estimation** 📊 - Estimates likelihood based on those patterns
4. **Confidence Assessment** ✅ - Tells how sure it is

**Key Insight:** More historical data = better predictions, but uncertainty always exists.

Select a city and time to see a specific prediction and I can explain it in detail!`,

    trust_reliability: `Good question! Here's the honest answer about trusting predictions:

**Strengths:** ✓
• Based on real historical data
• Tested and evaluated on many cases
• Helps identify patterns and trends
• Useful for planning and resource allocation

**Limitations:** ✗
• Never 100% certain
• Based on historical patterns (future may differ)
• Cannot account for all variables
• Not meant for individual-level decisions

**Bottom Line:** Use this as ONE tool among many, not THE tool. Combine with professional judgment, local knowledge, and other data sources.

Select a city to see confidence levels for specific predictions!`,

    factors_importance: `Factors affecting crime predictions include:

🕐 **Time of Day** - Crime varies significantly by hour
📍 **Location History** - Past patterns in the specific area
🏙️ **City Characteristics** - Each city has its own patterns
📈 **Trends** - How crime is changing over time
👥 **Activity Levels** - Density of people and activities

**How they're ranked:** More important factors have stronger influence on the prediction.

Select a city and time to see which factors matter most for that specific prediction!`,

    confidence: `Confidence scores show how sure the model is:

✅ **High (85%+)** - Model has seen many similar cases
⚠️ **Medium (60-85%)** - Model is fairly sure but some uncertainty
❓ **Low (<60%)** - Limited data for these conditions

Higher confidence means:
• More historical similar cases exist
• Patterns are consistent
• More reliable prediction

Lower confidence means:
• Fewer similar cases in history
• More uncertainty
• Treat as exploratory

Select a city to see confidence scores for specific conditions!`,

    simplify: `Here's the simple version of how it works:

**Past:** "What happened before in similar situations?"
**Present:** "What conditions do we have now?"
**Future:** "What does past tell us about now?"

That's it! The model finds patterns from the past and applies them to present conditions to estimate the future.`,

    general_question: `That's an interesting question! I can help with crime prediction explanations when you select a city and time. 

I can explain:
• Why a prediction is high, medium, or low risk
• How the AI made that prediction
• What factors influenced the result
• How confident the prediction is
• Whether you can trust it

Try asking about a specific prediction!`
  };

  return responses[queryType] || responses.general_question;
};

/**
 * Main chatbot response generator
 * Intelligently routes queries to appropriate handlers
 */
export const generateChatbotResponse = (query, predictionContext) => {
  // Classify the query
  const queryType = classifyQuery(query);

  // Check if we have active prediction context
  if (predictionContext?.prediction && predictionContext?.factors) {
    // Use context-aware responses with actual prediction data
    return generateAnswerForQuery(
      query,
      predictionContext.prediction,
      predictionContext.factors,
      predictionContext.model || 'Gradient Boosting',
      predictionContext.city,
      predictionContext.hour
    );
  }

  // No context - provide general responses
  return generateContextlesResponse(queryType);
};

/**
 * Generate suggestion pills for quick common questions
 * Helps users discover what they can ask about
 */
export const getQuickSuggestions = (hasPrediction = false) => {
  if (hasPrediction) {
    return [
      { label: "Why is it this risk?", query: "Why is this area marked high risk?" },
      { label: "How confident?", query: "How confident is this prediction?" },
      { label: "What factors matter?", query: "What factors affected this result the most?" },
      { label: "Explain simply", query: "Explain this prediction in simple words" },
      { label: "Can I trust it?", query: "Can I trust this prediction?" },
      { label: "How does AI work?", query: "How does the AI decide crime rate?" }
    ];
  }

  return [
    { label: "How it works", query: "How does the AI work?" },
    { label: "Can I trust it?", query: "Can I trust crime predictions?" },
    { label: "What factors?", query: "What factors affect predictions?" },
    { label: "Help me!", query: "What can you help me with?" },
    { label: "Explain simply", query: "Explain predictions in simple words" }
  ];
};

/**
 * Validate if response needs ethical disclaimer
 */
export const shouldIncludeDisclaimer = (prediction) => {
  // High-risk predictions should include disclaimers
  if (prediction?.rate >= 70) {
    return true;
  }
  // Low confidence predictions should include disclaimers
  const confidence = getConfidenceLevel(prediction?.confidence || 85);
  return confidence.level !== 'high';
};

/**
 * Get ethical disclaimer message
 */
export const getEthicalDisclaimer = (prediction) => {
  const riskDesc = getRiskDescription(prediction?.rate || 0);
  const confidence = getConfidenceLevel(prediction?.confidence || 85);

  if (riskDesc.level === 'high') {
    return `⚠️ **Important Reminder:** This high-risk prediction is based on historical patterns, not certainty. It's meant to inform preparation and planning, not to cause alarm. Always consider local knowledge and professional judgment.`;
  }

  if (confidence.level === 'low') {
    return `❓ **Note:** This prediction has low confidence due to limited historical data. Treat it as exploratory and combine with other information sources.`;
  }

  return null;
};

/**
 * Format response for display (handles markdown, spacing, etc.)
 */
export const formatResponseForDisplay = (response) => {
  if (!response) return '';

  // Already formatted - just return it
  return response;
};

/**
 * Check if user query is asking for something the chatbot can't provide
 */
export const isOutOfScope = (query) => {
  const lower = query.toLowerCase();

  const scopeKeywords = [
    'phone number', 'address', 'contact', 'email',
    'personal data', 'name', 'individual',
    'arrest', 'conviction', 'criminal record',
    'specific incident', 'specific crime'
  ];

  return scopeKeywords.some(keyword => lower.includes(keyword));
};

/**
 * Generate out-of-scope response
 */
export const getOutOfScopeResponse = () => {
  return `I can't help with that request. I'm designed to explain **crime predictions and patterns**, not:

✗ Personal information or data
✗ Specific arrests or incidents
✗ Contact information
✗ Individual-level targeting

What I CAN help with:
✓ How predictions work
✓ What factors influence them
✓ Confidence and reliability
✓ General crime patterns

Feel free to ask about predictions instead! 😊`;
};

/**
 * Determine if a query is asking for "more details"
 */
export const isFollowUpQuestion = (currentQuery, previousQueries = []) => {
  const lower = currentQuery.toLowerCase();
  const followUpIndicators = [
    'more', 'explain', 'what', 'why', 'how', 'tell me',
    'details', 'elaborate', 'clarify', 'else'
  ];

  return followUpIndicators.some(indicator => lower.startsWith(indicator)) && previousQueries.length > 0;
};
