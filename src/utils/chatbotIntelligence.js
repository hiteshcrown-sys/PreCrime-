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
  const { city, prediction, hour } = context;
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
        label: `Why is ${cityLabel} flagged as ${riskLabel}?`,
        query: `Explain why ${cityLabel} is flagged as ${riskLabel} at ${timeLabel}. What are the main factors contributing to this risk level based on the ML model?`
      },
      {
        label: `Key factors driving the ${riskLabel} in ${cityLabel}`,
        query: `What are the top 3-5 most important ML model factors that led to the ${riskLabel} risk prediction for ${cityLabel} at ${timeLabel}?`
      },
      {
        label: `How does ${timeLabel} affect crime prediction?`,
        query: `Why is ${timeLabel} particularly significant for crime patterns? How does the model use time-based features to predict crime in ${cityLabel}?`
      },
      {
        label: `AI insights on ${cityLabel} at ${timeLabel}`,
        query: `Provide a detailed AI analysis of why ${cityLabel} shows ${riskLabel} risk at ${timeLabel}. What patterns does the trained model detect?`
      },
      {
        label: `Compare ${cityLabel} with other major cities`,
        query: `How does the crime risk in ${cityLabel} at ${timeLabel} compare with other major Indian cities? What makes this prediction unique?`
      },
      {
        label: `What data powers this prediction?`,
        query: `What historical crime data, temporal patterns, and real-time information does the ML model use to predict ${riskLabel} for ${cityLabel}?`
      },
      {
        label: `How confident is this prediction?`,
        query: `What is the model's confidence level and accuracy for the ${riskLabel} prediction for ${cityLabel} at ${timeLabel}?`
      },
      {
        label: `Can I trust this ${riskLabel} flag?`,
        query: `Why should I trust the ${riskLabel} prediction for ${cityLabel}? What are the model's strengths, limitations, and potential biases?`
      }
    ];
  }

  return [
    { label: 'How does the model predict crimes?', query: 'How does the ML model work? What data and algorithms does it use to predict crime patterns across Indian cities?' },
    { label: 'What factors matter most?', query: 'What are the most important factors the model considers when making crime predictions? How does it weight them?' },
    { label: 'How accurate are predictions?', query: 'How accurate and reliable are the crime predictions? What is the model confidence level and how is it measured?' },
    { label: 'Why should I trust it?', query: 'Why should law enforcement trust this ML model? What are its strengths, limitations, and potential biases I should know about?' },
    { label: 'Time and Crime Patterns', query: 'How do time-based factors like day of week, time of day, and seasonality affect crime predictions? Why is timing important?' },
    { label: 'Understanding Risk Levels', query: 'How are risk levels (Critical, High, Medium, Low) determined? What crime rate thresholds define each level?' },
    { label: 'Can I customize predictions?', query: 'Can I filter predictions by crime type, time range, or geographic area? What customization options are available?' },
    { label: 'How to interpret results?', query: 'How should I interpret the prediction scores, confidence levels, and risk badges? What do they mean in practical terms?' }
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
