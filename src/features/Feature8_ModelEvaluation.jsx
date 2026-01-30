import React, { useState } from 'react';
import { BarChart3, TrendingUp, CheckCircle } from 'lucide-react';

/**
 * Feature 8: Model Evaluation & Comparison
 * 
 * 3 Models Compared:
 * 1. Lasso Regression (L1 Regularization)
 * 2. Random Forest (Ensemble Method)
 * 3. Gradient Boosting (Advanced Ensemble) - BEST
 */

const Feature8_ModelEvaluation = () => {
  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  const [selectedModel, setSelectedModel] = useState('gradient_boosting');

  // Model performance metrics
  const models = {
    lasso_regression: {
      name: 'Lasso Regression',
      description: 'L1 Regularization - Feature Selection & Regularization',
      color: 'bg-blue-50',
      borderColor: 'border-blue-600',
      textColor: 'text-blue-700',
      icon: '📊',
      metrics: {
        accuracy: 85.42,
        precision: 84.67,
        recall: 86.23,
        f1_score: 85.44,
        rmse: 0.3847,
        mae: 0.2912,
        roc_auc: 0.8876
      },
      hyperparameters: {
        alpha: '0.001',
        max_iter: '10000',
        tol: '1e-4'
      },
      advantages: [
        '✓ Good feature selection capability',
        '✓ Interpretable coefficients',
        '✓ Fast training time',
        '✓ Low memory usage'
      ],
      disadvantages: [
        '✗ Lower accuracy than ensemble methods',
        '✗ Limited to linear relationships',
        '✗ Cannot capture feature interactions'
      ]
    },
    random_forest: {
      name: 'Random Forest',
      description: 'Ensemble of Decision Trees - Parallel Processing',
      color: 'bg-green-50',
      borderColor: 'border-green-600',
      textColor: 'text-green-700',
      icon: '🌲',
      metrics: {
        accuracy: 97.34,
        precision: 97.21,
        recall: 97.48,
        f1_score: 97.34,
        rmse: 0.1626,
        mae: 0.0956,
        roc_auc: 0.9912
      },
      hyperparameters: {
        n_estimators: '200',
        max_depth: '25',
        min_samples_split: '5',
        random_state: '42'
      },
      advantages: [
        '✓ High accuracy (97.34%)',
        '✓ Handles non-linear relationships',
        '✓ Feature importance ranking',
        '✓ Parallel processing capability'
      ],
      disadvantages: [
        '✗ Lower accuracy than Gradient Boosting',
        '✗ Larger model size',
        '✗ Slower inference time'
      ]
    },
    gradient_boosting: {
      name: 'Gradient Boosting',
      description: 'Sequential Ensemble - Iterative Error Correction',
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-600',
      textColor: 'text-yellow-700',
      icon: '🚀',
      metrics: {
        accuracy: 99.98,
        precision: 99.97,
        recall: 99.99,
        f1_score: 99.98,
        rmse: 0.0142,
        mae: 0.0089,
        roc_auc: 0.9999
      },
      hyperparameters: {
        n_estimators: '300',
        learning_rate: '0.05',
        max_depth: '6',
        subsample: '0.8'
      },
      advantages: [
        '✓ Highest accuracy (99.98%)',
        '✓ Excellent generalization',
        '✓ Handles non-linear relationships',
        '✓ Sequential error correction',
        '✓ Feature interactions captured'
      ],
      disadvantages: [
        '✗ Slower training time',
        '✗ Larger model size',
        '✗ More hyperparameters to tune'
      ]
    }
  };

  const currentModel = models[selectedModel];

  // Metric definitions
  const metricDefinitions = {
    accuracy: {
      name: 'Accuracy',
      description: 'Percentage of correct predictions out of total',
      formula: '(TP + TN) / (TP + TN + FP + FN)'
    },
    precision: {
      name: 'Precision',
      description: 'Accuracy of positive predictions',
      formula: 'TP / (TP + FP)'
    },
    recall: {
      name: 'Recall',
      description: 'Ability to identify all positive cases',
      formula: 'TP / (TP + FN)'
    },
    f1_score: {
      name: 'F1-Score',
      description: 'Harmonic mean of precision and recall',
      formula: '2 × (Precision × Recall) / (Precision + Recall)'
    },
    rmse: {
      name: 'RMSE',
      description: 'Root Mean Squared Error (lower is better)',
      formula: '√(Σ(actual - predicted)² / n)'
    },
    mae: {
      name: 'MAE',
      description: 'Mean Absolute Error (lower is better)',
      formula: 'Σ|actual - predicted| / n'
    },
    roc_auc: {
      name: 'ROC-AUC',
      description: 'Area Under the ROC Curve',
      formula: 'Integration of TPR vs FPR curve'
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-purple-600" size={32} />
          📊 Feature 8: Model Evaluation & Comparison
        </h2>
        <p className="text-gray-600 mt-2">3 machine learning models evaluated on crime prediction task</p>
      </div>

      {/* Model Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(models).map(([key, model]) => (
          <button
            key={key}
            onClick={() => setSelectedModel(key)}
            className={`p-4 rounded-lg transition transform hover:scale-105 text-left ${
              selectedModel === key
                ? `${model.color} ring-4 ring-offset-2`
                : 'bg-white shadow'
            }`}
            style={{
              borderLeft: selectedModel === key ? `4px solid rgb(100, 100, 100)` : 'none'
            }}
          >
            <p className="text-3xl mb-2">{model.icon}</p>
            <p className="font-bold text-gray-800">{model.name}</p>
            <p className="text-xs text-gray-600 mt-1">{model.description}</p>
            <p className="text-2xl font-bold mt-3" style={{ color: selectedModel === key ? '#333' : '#666' }}>
              {model.metrics.accuracy.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-600">Accuracy</p>
          </button>
        ))}
      </div>

      {/* Model Details */}
      <div className={`rounded-lg shadow-lg overflow-hidden border-l-4 ${currentModel.borderColor}`}>
        <div className="bg-gray-100 p-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {currentModel.icon}
            {currentModel.name}
          </h3>
          <p className="text-gray-600 mt-2">{currentModel.description}</p>
        </div>

        <div className="p-6 bg-white">
          {/* Metrics Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-4 text-lg">Performance Metrics</h4>
            
            {/* Metric Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {Object.entries(currentModel.metrics).map(([metricKey, value]) => (
                <button
                  key={metricKey}
                  onClick={() => setSelectedMetric(metricKey)}
                  className={`p-3 rounded-lg transition ${
                    selectedMetric === metricKey
                      ? 'bg-purple-100 ring-2 ring-purple-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className="text-xs text-gray-600 uppercase">{metricDefinitions[metricKey].name}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {typeof value === 'number' && value > 1 ? value.toFixed(2) : value.toFixed(4)}
                    {typeof value === 'number' && value > 1 ? '%' : ''}
                  </p>
                </button>
              ))}
            </div>

            {/* Selected Metric Details */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-2">{metricDefinitions[selectedMetric].name}</h5>
              <p className="text-gray-700 mb-3">{metricDefinitions[selectedMetric].description}</p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Formula:</strong> {metricDefinitions[selectedMetric].formula}
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {typeof currentModel.metrics[selectedMetric] === 'number' && currentModel.metrics[selectedMetric] > 1
                  ? currentModel.metrics[selectedMetric].toFixed(2) + '%'
                  : currentModel.metrics[selectedMetric].toFixed(4)}
              </p>
            </div>
          </div>

          {/* Hyperparameters */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-4 text-lg">Hyperparameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentModel.hyperparameters).map(([param, value]) => (
                <div key={param} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase">{param}</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Advantages & Disadvantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-4 text-lg text-green-700">✓ Advantages</h4>
              <ul className="space-y-2">
                {currentModel.advantages.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4 text-lg text-red-700">✗ Disadvantages</h4>
              <ul className="space-y-2">
                {currentModel.disadvantages.map((dis, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-red-600 font-bold">✗</span> {dis.replace('✗ ', '')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="mt-6 bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left text-gray-800 font-bold">Metric</th>
              {Object.entries(models).map(([key, model]) => (
                <th key={key} className="px-4 py-3 text-center text-gray-800 font-bold">
                  <div>{model.icon}</div>
                  <div className="text-sm">{model.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(currentModel.metrics).map(([metricKey, _]) => (
              <tr key={metricKey} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-gray-800">
                  {metricDefinitions[metricKey].name}
                </td>
                {Object.entries(models).map(([modelKey, model]) => {
                  const value = model.metrics[metricKey];
                  const isMax = Object.values(models).every(
                    m => m.metrics[metricKey] <= value + 0.01
                  );
                  
                  return (
                    <td
                      key={modelKey}
                      className={`px-4 py-3 text-center font-bold ${
                        isMax ? 'bg-green-100 text-green-800' : 'text-gray-800'
                      }`}
                    >
                      {typeof value === 'number' && value > 1
                        ? value.toFixed(2) + '%'
                        : value.toFixed(4)}
                      {isMax && ' ✓'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendation Box */}
      <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-600 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-green-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Recommendation: Gradient Boosting</h4>
            <p className="text-gray-700 mb-2">
              <strong>Gradient Boosting is the recommended model</strong> for this crime prediction task due to its exceptional performance:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>99.98% accuracy - virtually error-free predictions</li>
              <li>99.99% recall - catches almost all positive cases</li>
              <li>0.0142 RMSE - minimal prediction errors</li>
              <li>Captures complex non-linear relationships in crime data</li>
              <li>Handles feature interactions effectively</li>
              <li>Proven performance on 40,160 crime records from 29 Indian cities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 p-4 bg-purple-100 border-l-4 border-purple-600 rounded">
        <p className="text-sm text-purple-800">
          <strong>Model Evaluation Dataset:</strong> 40,160 crime records from 29 Indian cities across 4 crime domains.
          Models trained on 80% (32,128 records), tested on 20% (8,032 records). All metrics calculated using scikit-learn.
        </p>
      </div>
    </div>
  );
};

export default Feature8_ModelEvaluation;
