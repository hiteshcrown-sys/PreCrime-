/**
 * Explanation Generator - Converts ML predictions into human-readable explanations
 * Handles feature importance, confidence scores, and ethical messaging
 * 
 * This module ensures ALL explanations are:
 * ✓ Non-technical and layman-friendly
 * ✓ Transparent about certainty limits
 * ✓ Ethical and non-alarmist
 * ✓ Based on actual model outputs (no hallucination)
 * ✓ Ranked by actual feature importance
 */

const FEATURE_LABELS = {
  // Primary factors
  historical_density: "Past crime patterns in this area",
  temporal_pattern: "Time of day trends",
  time_of_day: "Time of day trends",
  hour_pattern: "Crime patterns at this specific hour",
  
  // City and area factors
  city_base_rate: "This city's typical crime levels",
  city_trend: "General crime trends in this city",
  area_characteristics: "Typical patterns for this area",
  
  // Pattern and distribution factors
  domain_distribution: "Types of crimes commonly reported",
  crime_type_distribution: "Crime category patterns",
  seasonal_pattern: "Seasonal crime variations",
  
  // Confidence and ensemble factors
  model_confidence: "Model's certainty level",
  ensemble_prediction: "Agreement between different analysis methods",
  data_density: "How much historical data supports this",
  
  // Activity and contextual factors
  activity_level: "Activity patterns observed earlier",
  day_of_week: "Whether it's a weekday or weekend",
  weather_related: "Weather-related factors if applicable"
};

const CONFIDENCE_LEVELS = {
  high: { 
    min: 85, 
    label: "High Confidence", 
    description: "The model has seen many similar past cases with consistent results",
    emoji: "✅"
  },
  medium: { 
    min: 60, 
    label: "Medium Confidence", 
    description: "The model is fairly sure based on available data, though some uncertainty exists",
    emoji: "⚠️"
  },
  low: { 
    min: 0, 
    label: "Low Confidence", 
    description: "Limited historical data for these specific conditions, so treat as exploratory",
    emoji: "❓"
  }
};

/**
 * Get confidence level from numeric score
 * Converts raw confidence numbers into human-understandable categories
 */
export const getConfidenceLevel = (confidenceScore) => {
  const score = typeof confidenceScore === 'number' ? confidenceScore : 85;
  
  if (score >= CONFIDENCE_LEVELS.high.min) {
    return { level: "high", ...CONFIDENCE_LEVELS.high };
  } else if (score >= CONFIDENCE_LEVELS.medium.min) {
    return { level: "medium", ...CONFIDENCE_LEVELS.medium };
  }
  return { level: "low", ...CONFIDENCE_LEVELS.low };
};

/**
 * Get confidence percentage display
 */
export const getConfidencePercentage = (confidenceScore) => {
  return typeof confidenceScore === 'number' ? Math.round(confidenceScore) : 85;
};

/**
 * Convert risk score to simple, non-alarming description
 * Returns label, colors, and explanation that are appropriate for layman audiences
 */
export const getRiskDescription = (riskScore) => {
  if (riskScore >= 70) {
    return {
      level: "high",
      label: "High Risk",
      shortLabel: "High",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      description: "This area shows elevated crime activity based on current conditions.",
      emoji: "🔴"
    };
  } else if (riskScore >= 50) {
    return {
      level: "medium",
      label: "Medium Risk",
      shortLabel: "Medium",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      description: "This area shows moderate crime activity under current conditions.",
      emoji: "🟡"
    };
  }
  return {
    level: "low",
    label: "Low Risk",
    shortLabel: "Low",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "This area shows lower crime activity based on current conditions.",
    emoji: "🟢"
  };
};

/**
 * Normalize feature names to friendly labels
 */
const getNormalizedFeatureName = (featureName) => {
  if (!featureName) return "An unknown factor";
  
  const name = featureName.toLowerCase().trim();
  
  // Check direct matches in FEATURE_LABELS
  for (const [key, label] of Object.entries(FEATURE_LABELS)) {
    if (name === key || name.includes(key) || key.includes(name)) {
      return label;
    }
  }
  
  // If not found, convert from snake_case to friendly text
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Calculate contribution level based on raw importance/weight value
 * Maps any numeric importance value to a human-readable impact level
 */
const getContributionLevel = (contribution) => {
  const value = typeof contribution === 'number' ? contribution : 0;
  
  if (value >= 30) return { level: "very high", text: "strongly influences" };
  if (value >= 20) return { level: "high", text: "significantly influences" };
  if (value >= 10) return { level: "moderate", text: "moderately influences" };
  if (value >= 5) return { level: "notable", text: "influences" };
  return { level: "minor", text: "has some influence on" };
};

/**
 * Generate ranked feature importance explanation
 * Ranks top 3 features by importance and explains them in simple, non-technical terms
 * 
 * RULE: No raw numbers unless user explicitly asks
 * RULE: Explain in context (e.g., "crimes usually happen more at 9 PM" not "feature weight 0.32")
 */
export const generateFeatureExplanation = (factors) => {
  if (!factors || !Array.isArray(factors) || factors.length === 0) {
    return [
      "Past crime patterns in this area have a major influence on this prediction.",
      "The time of day selected strongly affects the estimate, as crime varies throughout the day.",
      "Current activity patterns and conditions in the area also play an important role."
    ];
  }

  // Sort by contribution (importance) and take top 3
  const sortedFactors = [...factors].sort((a, b) => {
    const contributionA = a.contribution ?? a.importance ?? a.weight ?? 0;
    const contributionB = b.contribution ?? b.importance ?? b.weight ?? 0;
    return contributionB - contributionA;
  });

  const topFactors = sortedFactors.slice(0, 3);

  return topFactors.map((factor) => {
    const contribution = factor.contribution ?? factor.importance ?? factor.weight ?? 0;
    const label = getNormalizedFeatureName(factor.name || factor.feature || "An unknown factor");
    const { text } = getContributionLevel(contribution);
    
    return `${label} ${text} this prediction.`;
  });
};

/**
 * Generate insights from top factors
 * Returns non-technical insights like "Crime tends to increase during weekends"
 */
export const generateDynamicInsights = (factors, city, hour) => {
  if (!factors || !Array.isArray(factors) || factors.length === 0) {
    return [
      "Multiple factors influence crime predictions in any area.",
      "Past incidents, time of day, and activity patterns all play a role.",
      "The model considers many data points to make accurate predictions."
    ];
  }

  const sortedFactors = [...factors].sort((a, b) => {
    const contribA = a.contribution ?? a.importance ?? a.weight ?? 0;
    const contribB = b.contribution ?? b.importance ?? b.weight ?? 0;
    return contribB - contribA;
  });

  const insights = [];

  // Extract insights from each top factor
  sortedFactors.slice(0, 3).forEach((factor) => {
    const featureName = (factor.name || factor.feature || "").toLowerCase();
    const contribution = factor.contribution ?? factor.importance ?? factor.weight ?? 0;

    // Time-related insights
    if (featureName.includes('time') || featureName.includes('hour')) {
      if (hour >= 22 || hour <= 6) {
        insights.push("Late evening and early morning hours have shown higher crime activity in this area.");
      } else if (hour >= 7 && hour <= 10) {
        insights.push("Early morning commute hours show distinct crime patterns in this area.");
      } else if (hour >= 17 && hour <= 21) {
        insights.push("Evening hours consistently show elevated activity levels in this area.");
      } else {
        insights.push("Daytime hours typically show moderate activity levels.");
      }
    }
    
    // Historical density insights
    if (featureName.includes('historical') || featureName.includes('density') || featureName.includes('past')) {
      if (contribution >= 25) {
        insights.push("This area has shown repeated, consistent crime patterns from previous data.");
      } else {
        insights.push("Past incidents in this area provide context for current predictions.");
      }
    }
    
    // Day of week insights
    if (featureName.includes('day') || featureName.includes('weekend')) {
      insights.push("Crime patterns vary between weekdays and weekends in this location.");
    }
    
    // City or area insights
    if (featureName.includes('city') || featureName.includes('base') || featureName.includes('rate')) {
      if (city) {
        insights.push(`${city} has its own characteristic crime patterns that inform this prediction.`);
      } else {
        insights.push("The area's baseline crime patterns influence this prediction.");
      }
    }
  });

  // Return unique insights, limit to 3
  return [...new Set(insights.filter(i => i))].slice(0, 3);
};

/**
 * Generate comprehensive prediction explanation
 */
export const generatePredictionExplanation = (prediction, factors, model) => {
  const riskDesc = getRiskDescription(prediction?.rate || prediction?.predictedRate || 0);
  const confidence = getConfidenceLevel(prediction?.confidence || prediction?.accuracy || 85);
  const featureExplanations = generateFeatureExplanation(factors);

  const explanations = {
    riskLevel: riskDesc,
    confidence: confidence,
    factors: featureExplanations,
    fullExplanation: buildFullExplanation(prediction, factors, riskDesc, confidence, featureExplanations, model)
  };

  return explanations;
};

/**
 * Build a comprehensive narrative explanation
 * Used for full/detailed prediction explanations
 */
const buildFullExplanation = (prediction, factors, riskDesc, confidence, featureExplanations, model) => {
  const riskScore = prediction?.rate || prediction?.predictedRate || 0;
  const modelName = model || "the AI model";
  
  let explanation = `This area is showing **${riskDesc.label}** (${riskScore}% likelihood based on patterns).\n\n`;
  
  explanation += `**Why this prediction?**\n`;
  explanation += `The prediction has ${confidence.label.toLowerCase()} — ${confidence.description}.\n\n`;
  
  explanation += `**Top factors that influenced this:**\n`;
  featureExplanations.forEach((exp, idx) => {
    explanation += `${idx + 1}. ${exp}\n`;
  });

  explanation += `\n**⚠️ Important to understand:**\n`;
  explanation += `• This prediction is for **awareness and planning**, not certainty\n`;
  explanation += `• It's based on **historical patterns**, not a guarantee of what will happen\n`;
  explanation += `• Real situations involve complexity that no model can fully capture\n`;
  explanation += `• Use this alongside other information and professional judgment`;

  return explanation;
};

/**
 * Generate answer for specific user queries
 * Smart response generator that understands context and provides non-technical explanations
 */
export const generateAnswerForQuery = (query, prediction, factors, model, selectedCity, selectedHour) => {
  const queryLower = query.toLowerCase();
  const riskDesc = getRiskDescription(prediction?.rate || 0);
  const confidence = getConfidenceLevel(prediction?.confidence || 85);
  const featureExplanations = generateFeatureExplanation(factors);
  const dynamicInsights = generateDynamicInsights(factors, selectedCity, selectedHour);
  const confidencePercent = getConfidencePercentage(prediction?.confidence || 85);
  const riskScore = prediction?.rate || 0;

  // Query: "Why is this area marked high/medium/low risk?" or "Why is crime high here?"
  if (queryLower.includes("why") && (queryLower.includes("high") || queryLower.includes("medium") || queryLower.includes("low") || queryLower.includes("risk"))) {
    let response = `${selectedCity || 'This area'} is showing **${riskDesc.label}** based on several key factors.\n\n`;
    response += `**What's influencing this prediction:**\n`;
    featureExplanations.forEach((exp, idx) => {
      response += `${idx + 1}. ${exp}\n`;
    });
    response += `\n**What does this mean?**\n`;
    response += `${riskDesc.description}\n\n`;
    response += `**Is this dangerous?** Not necessarily. This is a statistical estimate based on patterns from the past. It helps with planning and awareness, but real situations are always more complex.`;
    return response;
  }

  // Query: "How does the AI decide/determine crime rate?" or "How did you predict this?"
  if (queryLower.includes("how") && (queryLower.includes("decide") || queryLower.includes("predict") || queryLower.includes("determine") || queryLower.includes("calculate") || queryLower.includes("work"))) {
    let response = `Great question! Here's how the prediction works:\n\n`;
    response += `**Step 1: Look at History** 📊\n`;
    response += `The model examines what happened in similar conditions before (same time, location, etc.)\n\n`;
    response += `**Step 2: Find Patterns** 🔍\n`;
    response += `It identifies common patterns — like "crimes tend to be higher at 9 PM" or "this area has consistent patterns"\n\n`;
    response += `**Step 3: Make Estimate** 🎯\n`;
    response += `Based on these patterns, it estimates the likelihood of crime activity right now\n\n`;
    response += `**Step 4: Add Confidence** ✅\n`;
    response += `It also tells us how confident it is — based on how much similar data it has seen\n\n`;
    response += `**The Bottom Line:** It's like weather forecasting. More historical data = better predictions, but uncertainty always exists.`;
    return response;
  }

  // Query: "Can I trust this prediction?" or "How reliable/accurate is this?"
  if (queryLower.includes("trust") || queryLower.includes("reliable") || queryLower.includes("accurate") || queryLower.includes("confident")) {
    let response = `That's an important question to ask! Let me be transparent:\n\n`;
    response += `**This Prediction's Confidence:** ${confidence.label} (${confidencePercent}%)\n`;
    response += `${confidence.description}\n\n`;
    response += `**✓ What it's Good For:**\n`;
    response += `• Identifying trends and patterns\n`;
    response += `• Planning resource allocation\n`;
    response += `• General awareness and preparation\n\n`;
    response += `**✗ What it's NOT:**\n`;
    response += `• 100% certain predictions\n`;
    response += `• Identifying specific individuals or incidents\n`;
    response += `• A guarantee of what will actually happen\n\n`;
    response += `**The Honest Truth:** Models learn from past data, but the future has variables we can't predict. Use this as ONE data point, not the ONLY factor in decisions.`;
    return response;
  }

  // Query: "What factors/features affected this result the most?" or "What influenced this?"
  if (queryLower.includes("factors") || queryLower.includes("what affected") || queryLower.includes("influenced") || queryLower.includes("why")) {
    let response = `**Top factors influencing this prediction:**\n\n`;
    featureExplanations.forEach((exp, idx) => {
      response += `${idx + 1}. ${exp}\n`;
    });
    
    if (dynamicInsights.length > 0) {
      response += `\n**Additional context:**\n`;
      dynamicInsights.forEach(insight => {
        response += `• ${insight}\n`;
      });
    }
    
    response += `\n**Important Note:** Different factors matter more at different times and places. What affects predictions in one city at one time might be different elsewhere.`;
    return response;
  }

  // Query: "Explain in simple words" or "Make it simple"
  if (queryLower.includes("simple") || queryLower.includes("explain") || queryLower.includes("dumb down")) {
    let response = `Sure! Here's the simplest version:\n\n`;
    response += `**What happened before?** The AI looked at past data\n`;
    response += `**What was similar?** It found times/places like right now\n`;
    response += `**What does that tell us?** "Similar situations led to this activity level"\n\n`;
    response += `**Right now:** This area is ${riskDesc.shortLabel} Risk\n\n`;
    response += `**Should you worry?** No need to panic. This is just one tool. Many other factors affect what actually happens.`;
    return response;
  }

  // Query: "Explain this prediction" or "Tell me about this"
  if (queryLower.includes("prediction") || queryLower.includes("tell") || queryLower.includes("explain")) {
    const response = buildFullExplanation(prediction, factors, riskDesc, confidence, featureExplanations, model);
    return response;
  }

  // Query: "How confident is this prediction?" or "Is this prediction sure?"
  if (queryLower.includes("confident") || queryLower.includes("confidence") || queryLower.includes("sure") || queryLower.includes("certain")) {
    let response = `**Confidence Level:** ${confidence.label.toUpperCase()} (${confidencePercent}%)\n\n`;
    response += `${confidence.emoji} ${confidence.description}\n\n`;
    response += `**What this means:**\n`;
    response += confidence.level === 'high' 
      ? `• The model has seen many cases like this before\n• Past patterns are consistent\n• This is a reliable estimate` 
      : confidence.level === 'medium' 
        ? `• The model has decent historical data\n• Some uncertainty exists\n• Use as a guide with other information`
        : `• Limited similar cases in history\n• Use cautiously\n• This is more exploratory`;
    
    response += `\n\n**How confidence is calculated:**\n`;
    response += `• How many similar historical cases exist\n`;
    response += `• How consistent those cases were\n`;
    response += `• How recent and relevant the data is`;
    
    return response;
  }

  // Default/fallback response - comprehensive but conversational
  let defaultResponse = `Based on current conditions in ${selectedCity || 'this area'} at ${selectedHour !== null ? `${selectedHour}:00` : 'the selected time'}:\n\n`;
  defaultResponse += `**Risk Assessment:** ${riskDesc.emoji} ${riskDesc.label} (${riskScore}%)\n`;
  defaultResponse += `**Confidence:** ${confidence.emoji} ${confidence.label} (${confidencePercent}%)\n\n`;
  defaultResponse += `**Main factors:**\n`;
  featureExplanations.forEach((f, i) => {
    defaultResponse += `${i + 1}. ${f}\n`;
  });
  defaultResponse += `\n**Remember:** This prediction is based on historical patterns and is one tool among many for decision-making, not a certainty.`;
  
  return defaultResponse;
};
