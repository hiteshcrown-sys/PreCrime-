import React, { useState } from 'react';
import { MapPin, TrendingDown, TrendingUp, Award } from 'lucide-react';

/**
 * Feature 2: City Ranking & Hotspots
 * 
 * Data:
 * - 29 Indian cities ranked by crime rate
 * - Crime rate range: 33.28 (Rajkot - Safest) to 542.82 (Delhi - Most Dangerous)
 * - 159 hotspots identified using K-means clustering
 */

const Feature2_CityRanking = () => {
  const [sortBy, setSortBy] = useState('dangerous'); // 'dangerous' or 'safe'
  const [selectedCity, setSelectedCity] = useState(null);

  const cityData = [
    { rank: 1, city: 'Delhi', crimes: 542.82, risk: 'CRITICAL', hotspots: 24, topHour: '07:00' },
    { rank: 2, city: 'Mumbai', crimes: 437.96, risk: 'HIGH', hotspots: 18, topHour: '03:00' },
    { rank: 3, city: 'Bangalore', crimes: 360.52, risk: 'HIGH', hotspots: 12, topHour: '09:00' },
    { rank: 4, city: 'Hyderabad', crimes: 285.40, risk: 'HIGH', hotspots: 8, topHour: '14:00' },
    { rank: 5, city: 'Kolkata', crimes: 195.30, risk: 'MEDIUM', hotspots: 6, topHour: '19:00' },
    { rank: 6, city: 'Pune', crimes: 178.45, risk: 'MEDIUM', hotspots: 5, topHour: '11:00' },
    { rank: 7, city: 'Ahmedabad', crimes: 168.20, risk: 'MEDIUM', hotspots: 4, topHour: '22:00' },
    { rank: 8, city: 'Jaipur', crimes: 145.60, risk: 'MEDIUM', hotspots: 3, topHour: '18:00' },
    { rank: 9, city: 'Lucknow', crimes: 128.35, risk: 'MEDIUM', hotspots: 3, topHour: '20:00' },
    { rank: 10, city: 'Chandigarh', crimes: 95.70, risk: 'LOW', hotspots: 2, topHour: '16:00' },
    { rank: 11, city: 'Surat', crimes: 87.50, risk: 'LOW', hotspots: 2, topHour: '13:00' },
    { rank: 12, city: 'Chennai', crimes: 82.30, risk: 'LOW', hotspots: 2, topHour: '01:00' },
    { rank: 13, city: 'Indore', crimes: 76.45, risk: 'LOW', hotspots: 1, topHour: '15:00' },
    { rank: 14, city: 'Thane', crimes: 72.60, risk: 'LOW', hotspots: 1, topHour: '17:00' },
    { rank: 15, city: 'Bhopal', crimes: 68.90, risk: 'LOW', hotspots: 1, topHour: '12:00' },
    { rank: 16, city: 'Visakhapatnam', crimes: 64.20, risk: 'LOW', hotspots: 1, topHour: '19:00' },
    { rank: 17, city: 'Pimpri-Chinchwad', crimes: 59.80, risk: 'LOW', hotspots: 1, topHour: '14:00' },
    { rank: 18, city: 'Patna', crimes: 55.40, risk: 'LOW', hotspots: 1, topHour: '21:00' },
    { rank: 19, city: 'Vadodara', crimes: 51.20, risk: 'VERY_LOW', hotspots: 0, topHour: '10:00' },
    { rank: 20, city: 'Ghaziabad', crimes: 48.65, risk: 'VERY_LOW', hotspots: 0, topHour: '09:00' },
    { rank: 21, city: 'Ludhiana', crimes: 45.30, risk: 'VERY_LOW', hotspots: 0, topHour: '16:00' },
    { rank: 22, city: 'Agra', crimes: 42.10, risk: 'VERY_LOW', hotspots: 0, topHour: '11:00' },
    { rank: 23, city: 'Nashik', crimes: 39.85, risk: 'VERY_LOW', hotspots: 0, topHour: '08:00' },
    { rank: 24, city: 'Faridabad', crimes: 37.50, risk: 'VERY_LOW', hotspots: 0, topHour: '15:00' },
    { rank: 25, city: 'Meerut', crimes: 35.75, risk: 'VERY_LOW', hotspots: 0, topHour: '12:00' },
    { rank: 26, city: 'Kalyan-Dombivali', crimes: 34.50, risk: 'VERY_LOW', hotspots: 0, topHour: '07:00' },
    { rank: 27, city: 'Vasai-Virar', crimes: 34.08, risk: 'VERY_LOW', hotspots: 0, topHour: '06:00' },
    { rank: 28, city: 'Varanasi', crimes: 33.65, risk: 'VERY_LOW', hotspots: 0, topHour: '04:00' },
    { rank: 29, city: 'Rajkot', crimes: 33.28, risk: 'VERY_LOW', hotspots: 0, topHour: '13:00' },
  ];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-blue-600 bg-blue-50';
      case 'VERY_LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskBadgeColor = (risk) => {
    switch(risk) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-blue-500 text-white';
      case 'VERY_LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const displayedCities = sortBy === 'dangerous' 
    ? cityData 
    : [...cityData].reverse();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="text-red-600" size={32} />
          🏙️ Feature 2: City Ranking & Crime Hotspots
        </h2>
        <p className="text-gray-600 mt-2">All 29 Indian cities ranked by crime rate | 159 hotspots identified</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSortBy('dangerous')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
            sortBy === 'dangerous'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 border-2 border-red-600'
          }`}
        >
          <TrendingUp size={18} />
          Most Dangerous First
        </button>
        <button
          onClick={() => setSortBy('safe')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
            sortBy === 'safe'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border-2 border-green-600'
          }`}
        >
          <TrendingDown size={18} />
          Safest First
        </button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-600">Total Cities</p>
          <p className="text-3xl font-bold text-gray-800">29</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-600">Total Hotspots</p>
          <p className="text-3xl font-bold text-red-600">159</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-600">Crime Rate Range</p>
          <p className="text-lg font-bold text-gray-800">33.28 - 542.82</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-600">Avg per City</p>
          <p className="text-2xl font-bold text-gray-800">5.5</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">City Name</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Crime Rate</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Risk Level</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Hotspots</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Peak Hour</th>
            </tr>
          </thead>
          <tbody>
            {displayedCities.map((item, idx) => (
              <tr
                key={item.city}
                className={`border-b hover:bg-gray-50 cursor-pointer transition ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } ${selectedCity === item.city ? 'bg-yellow-100' : ''}`}
                onClick={() => setSelectedCity(selectedCity === item.city ? null : item.city)}
              >
                <td className="px-4 py-3">
                  <span className="font-bold text-lg text-gray-800">#{item.rank}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{item.city}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-800">{item.crimes}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadgeColor(item.risk)}`}>
                    {item.risk}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                    {item.hotspots}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{item.topHour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-blue-100 border-l-4 border-blue-600 rounded">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Crime rates are calculated from 40,160 historical records.
          Hotspots are identified locations with peak crime concentration using K-means clustering (k=3).
          Peak hour indicates the time slot with highest crime activity in each city.
        </p>
      </div>
    </div>
  );
};

export default Feature2_CityRanking;
