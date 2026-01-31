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
    lower.includes('नमस्ते') || lower.includes('नमस्कार') || lower.includes('हॅलो')) {
    return 'greeting';
  }
  if ((lower.includes('how') && lower.includes('trust')) || lower.includes('data input') || 
    lower.includes('city time') || lower.includes('input trust') ||
    lower.includes('कैसे भरोसा') || lower.includes('डेटा इनपुट')) {
    return 'data_input_trust';
  }
  if (lower.includes('dashboard') || lower.includes('flags') || lower.includes('ml model') || 
    lower.includes('model check') || lower.includes('how dashboard') ||
    lower.includes('डॅशबोर्ड') || lower.includes('एमएल मॉडल')) {
    return 'dashboard_ml_integration';
  }
  if (lower.includes('display') || lower.includes('show') || lower.includes('same as dashboard') ||
    lower.includes('dashboard display') || lower.includes('दाखवते') || lower.includes('डिस्प्ले')) {
    return 'dashboard_display_consistency';
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
    data_input_trust: t('cbDataInputTrust'),
    dashboard_ml_integration: t('cbDashboardMLIntegration'),
    dashboard_display_consistency: t('cbDashboardDisplayConsistency'),
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

  // Handle city awareness even without specific prediction data
  if (predictionContext?.city) {
    const cityResponse = generateAnswerForQuery(
      query,
      null,
      null,
      null,
      predictionContext.city,
      predictionContext.hour,
      t
    );
    // If we got a specific answer (not the default fallback), return it
    if (!cityResponse.includes(t('rememberNote'))) {
      return cityResponse;
    }

    // Otherwise, maybe prefix the contextless response with city awareness
    const contextless = generateContextlesResponse(queryType, t);
    return `${t('basedOnCurrentConditions').replace('{city}', predictionContext.city).replace('{time}', predictionContext.hour !== null ? `${predictionContext.hour}:00` : '').trim()}\n\n${contextless}`;
  }

  // No context - provide general responses
  return generateContextlesResponse(queryType, t);
};

/**
 * Generate suggestion pills for quick common questions
 * Helps users discover what they can ask about
 */
export const getQuickSuggestions = (t, context = {}) => {
  const { city, prediction } = context;
  const hasPrediction = !!prediction;

  if (hasPrediction) {
    const riskLevel = prediction?.riskLevel || 'MEDIUM';
    const riskKey = `risk${riskLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`;
    const riskLabel = t(riskKey) || riskLevel;
    const cityLabel = city || (prediction?.city) || 'this area';
    const timeLabel = prediction?.hour !== undefined ? 
      (prediction.hour === 0 ? '12 AM' : 
       prediction.hour < 12 ? `${prediction.hour} AM` : 
       prediction.hour === 12 ? '12 PM' : 
       `${prediction.hour - 12} PM`) : 'this time';

    return [
      {
        label: t('sugWhyCityRisk').replace('{city}', cityLabel).replace('{risk}', riskLabel),
        query: t('queryWhyRisk').replace('this area', cityLabel)
      },
      {
        label: t('sugWhyCityPatternsMatter'),
        query: t('queryWhyCityPatternsMatter')
      },
      {
        label: t('sugHowTimeAffectsPredictions'),
        query: t('queryHowTimeAffectsPredictions')
      },
      {
        label: t('sugMLInsightsForCity').replace('{city}', cityLabel),
        query: t('queryMLInsightsForCity').replace('{city}', cityLabel)
      },
      {
        label: t('sugCompareCityPatterns'),
        query: t('queryCompareCityPatterns')
      },
      {
        label: t('sugTimeInfluenceOnRisk'),
        query: t('queryTimeInfluenceOnRisk')
      },
      { label: t('sugCanITrust'), query: t('queryCanITrust') },
      { label: t('sugDataInputTrust'), query: t('queryDataInputTrust') }
    ];
  }

  return [
    { label: t('sugHowItWorks'), query: t('queryHowItWorksDefault') },
    { label: t('sugCanITrust'), query: t('queryCanITrustDefault') },
    { label: t('sugWhatFactors'), query: t('queryWhatFactorsDefault') },
    { label: t('sugWhatHelp'), query: t('queryWhatHelp') },
    { label: t('sugExplainSimply'), query: t('queryExplainSimplyDefault') }
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
