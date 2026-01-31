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

  // English, Hindi, Marathi keywords for classification
  if (lower.includes('why') || lower.includes('reason') || lower.includes('cause') ||
    lower.includes('क्यों') || lower.includes('कारण') ||
    lower.includes('का')) {
    return 'explanation_why';
  }
  if ((lower.includes('how') && (lower.includes('work') || lower.includes('decide') || lower.includes('predict'))) ||
    lower.includes('कैसे काम') || lower.includes('कसे कार्य')) {
    return 'how_it_works';
  }
  if (lower.includes('trust') || lower.includes('reliable') || lower.includes('accurate') ||
    lower.includes('भरोसा') || lower.includes('विश्वास')) {
    return 'trust_reliability';
  }
  if (lower.includes('factor') || lower.includes('affect') || lower.includes('influence') ||
    lower.includes('कारक') || lower.includes('घटक')) {
    return 'factors_importance';
  }
  if (lower.includes('confident') || lower.includes('confidence') || lower.includes('sure') ||
    lower.includes('आश्वस्त') || lower.includes('खात्री')) {
    return 'confidence';
  }
  if (lower.includes('simple') || lower.includes('easy') || lower.includes('explain') ||
    lower.includes('सरल') || lower.includes('सोप्या')) {
    return 'simplify';
  }
  if (lower.includes('help') || lower.includes('what can you') || lower.includes('what do you') ||
    lower.includes('मदद') || lower.includes('मदत')) {
    return 'help';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') ||
    lower.includes('नमस्ते') || lower.includes('नमस्कार')) {
    return 'greeting';
  }

  return 'general_question';
};

/**
 * Determine if chatbot should provide responses without active prediction context
 */
const generateContextlesResponse = (queryType, t) => {
  const responses = {
    greeting: t('cbGreeting'),
    help: t('cbHelp'),
    how_it_works: t('cbHowItWorks'),
    trust_reliability: t('cbTrustReliability'),
    factors_importance: t('cbFactorsImportance'),
    confidence: t('cbConfidence'),
    simplify: t('cbSimplify'),
    general_question: t('cbGeneralQuestion')
  };

  return responses[queryType] || responses.general_question;
};

/**
 * Main chatbot response generator
 * Intelligently routes queries to appropriate handlers
 */
export const generateChatbotResponse = (query, predictionContext, t) => {
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
      predictionContext.hour,
      t
    );
  }

  // No context - provide general responses
  return generateContextlesResponse(queryType, t);
};

/**
 * Generate suggestion pills for quick common questions
 * Helps users discover what they can ask about
 */
export const getQuickSuggestions = (t, hasPrediction = false) => {
  if (hasPrediction) {
    return [
      { label: t('sugWhyRisk'), query: "Why is this area marked high risk?" },
      { label: t('sugHowConfident'), query: "How confident is this prediction?" },
      { label: t('sugWhatFactors'), query: "What factors affected this result the most?" },
      { label: t('sugExplainSimply'), query: "Explain this prediction in simple words" },
      { label: t('sugCanITrust'), query: "Can I trust this prediction?" },
      { label: t('sugHowItWorks'), query: "How does the AI decide crime rate?" }
    ];
  }

  return [
    { label: t('sugHowItWorks'), query: "How does the AI work?" },
    { label: t('sugCanITrust'), query: "Can I trust crime predictions?" },
    { label: t('sugWhatFactors'), query: "What factors affect predictions?" },
    { label: t('sugWhatHelp'), query: "What can you help me with?" },
    { label: t('sugExplainSimply'), query: "Explain predictions in simple words" }
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
export const getEthicalDisclaimer = (prediction, t) => {
  const riskDesc = getRiskDescription(prediction?.rate || 0, t);
  const confidence = getConfidenceLevel(prediction?.confidence || 85, t);

  if (riskDesc.level === 'high') {
    return t('cbEthicalHighRisk');
  }

  if (confidence.level === 'low') {
    return t('cbEthicalLowConfidence');
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
export const getOutOfScopeResponse = (t) => {
  return t('cbOutOfScope');
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
