# PreCrime Backend API Implementation Guide

## 🚀 Overview

This guide provides complete API specifications for the PreCrime real-time crime prediction system backend.

## 🛠️ Technology Stack

### Recommended Stack
- **Framework**: Flask or Django (Python)
- **Real-time**: Flask-SocketIO or Django Channels (WebSocket)
- **Database**: PostgreSQL with PostGIS for spatial queries
- **Caching**: Redis for real-time data
- **Deployment**: Docker, AWS/Google Cloud

## 📋 API Endpoints

### 1. Crime Prediction Endpoint
```
GET /api/predict
Query Parameters:
  - city (string): City name (required)
  - hour (integer): Hour 0-23 (required)
  - domain (string): Crime domain (optional, default: 'All')

Response (200 OK):
{
  "city": "Delhi",
  "hour": 12,
  "domain": "All",
  "baseCrimeRate": 542.82,
  "adjustedRate": 563.45,
  "confidence": 99.98,
  "timestamp": "2026-01-30T21:00:00Z",
  "factors": {
    "hourMultiplier": 1.038,
    "dayOfWeek": "Thursday",
    "season": "Winter"
  }
}
```

### 2. City Rankings Endpoint
```
GET /api/cities/rankings
Query Parameters:
  - sort_by (string): 'crime_rate', 'hotspots', 'risk_level' (default: 'crime_rate')
  - order (string): 'asc' or 'desc' (default: 'desc')

Response (200 OK):
{
  "cities": [
    {
      "rank": 1,
      "name": "Delhi",
      "crimeRate": 542.82,
      "riskLevel": "CRITICAL",
      "hotspotCount": 24,
      "peakHour": 3,
      "incidents": 15432,
      "population": 32941000
    },
    ...
  ],
  "totalCities": 29,
  "lastUpdated": "2026-01-30T21:05:00Z"
}
```

### 3. Hourly Patterns Endpoint
```
GET /api/patterns/hourly
Query Parameters:
  - city (string): City name (required)
  - date (string): YYYY-MM-DD (optional, default: today)

Response (200 OK):
{
  "city": "Delhi",
  "date": "2026-01-30",
  "patterns": [
    {
      "hour": 0,
      "crimes": 611,
      "percentage": 3.85,
      "trend": "stable",
      "riskLevel": "MEDIUM"
    },
    ...
  ],
  "totalCrimes": 15432,
  "peakHour": 3,
  "lowestHour": 0,
  "lastUpdated": "2026-01-30T21:10:00Z"
}
```

### 4. Temporal Analysis Endpoint
```
GET /api/analysis/temporal
Query Parameters:
  - city (string): City name (optional)
  - period (string): 'daily', 'weekly', 'monthly' (default: 'daily')

Response (200 OK):
{
  "period": "daily",
  "hourlyDistribution": [
    {
      "hour": 0,
      "totalCrimes": 15432,
      "trend": "increasing",
      "confidence": 0.95
    },
    ...
  ],
  "statistics": {
    "nightCrimePercentage": 70.6,
    "peakHour": 3,
    "averageCrimesPerHour": 1619,
    "standardDeviation": 45.3
  },
  "lastUpdated": "2026-01-30T21:15:00Z"
}
```

### 5. Crime Domain Trends Endpoint
```
GET /api/trends/domains
Query Parameters:
  - city (string): City name (optional)
  - domain (string): Specific domain (optional)

Response (200 OK):
{
  "domains": [
    {
      "name": "Other Crime",
      "count": 22948,
      "percentage": 57.14,
      "trend": "stable",
      "peakHour": 3,
      "riskLevel": "HIGH"
    },
    {
      "name": "Violent Crime",
      "count": 11472,
      "percentage": 28.57,
      "trend": "increasing",
      "peakHour": 19,
      "riskLevel": "CRITICAL"
    },
    ...
  ],
  "totalCrimes": 40160,
  "lastUpdated": "2026-01-30T21:20:00Z"
}
```

### 6. Risk Classification Endpoint
```
GET /api/risk/classification
Query Parameters:
  - city (string): City name (optional)

Response (200 OK):
{
  "classifications": [
    {
      "level": "CRITICAL",
      "threshold": 300,
      "cities": ["Delhi", "Mumbai", "Bangalore"],
      "count": 3,
      "percentage": 10.3,
      "recommendations": ["Increase police presence", "Deploy armed units"]
    },
    {
      "level": "HIGH",
      "threshold": 200,
      "cities": [...],
      "count": 4,
      "percentage": 13.8,
      "recommendations": ["Enhanced monitoring", "CCTV deployment"]
    },
    ...
  ],
  "lastUpdated": "2026-01-30T21:25:00Z"
}
```

### 7. Hotspots Endpoint
```
GET /api/hotspots
Query Parameters:
  - city (string): City name (optional)
  - priority (string): 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW' (optional)
  - limit (integer): Max results (default: 100)
  - offset (integer): Pagination offset (default: 0)

Response (200 OK):
{
  "hotspots": [
    {
      "id": 1,
      "city": "Delhi",
      "name": "South Delhi Cluster",
      "coordinates": {
        "latitude": 28.5244,
        "longitude": 77.1855
      },
      "crimeDensity": 94.5,
      "priority": "CRITICAL",
      "crimes": 1245,
      "area": "South Delhi",
      "boundaries": {
        "north": 28.5350,
        "south": 28.5140,
        "east": 77.1950,
        "west": 77.1760
      },
      "recommendations": ["Armed patrol", "Increased surveillance"]
    },
    ...
  ],
  "totalHotspots": 159,
  "page": 1,
  "pageSize": 100,
  "lastUpdated": "2026-01-30T21:30:00Z"
}
```

### 8. Model Performance Endpoint
```
GET /api/model/performance
Response (200 OK):
{
  "models": [
    {
      "name": "Gradient Boosting",
      "accuracy": 99.98,
      "precision": 99.96,
      "recall": 99.95,
      "f1Score": 99.96,
      "rmse": 0.12,
      "mae": 0.08,
      "rocAuc": 0.9999,
      "hyperparameters": {
        "nEstimators": 200,
        "learningRate": 0.1,
        "maxDepth": 7
      },
      "advantages": [
        "Highest accuracy",
        "Robust to outliers",
        "Fast inference"
      ],
      "disadvantages": [
        "Higher memory usage",
        "Longer training time"
      ]
    },
    ...
  ],
  "bestModel": "Gradient Boosting",
  "trainingDate": "2026-01-25",
  "nextRetraining": "2026-02-01"
}
```

### 9. Data Export Endpoint
```
GET /api/export
Query Parameters:
  - format (string): 'json' or 'csv' (required)
  - type (string): 'summary', 'dataset', 'hotspots', 'risks', 'patterns' (optional)

Response (200 OK - with file download):
Content-Type: application/json or text/csv
Content-Disposition: attachment; filename=export_2026-01-30.json

Example JSON Export:
{
  "metadata": {
    "exportDate": "2026-01-30T21:35:00Z",
    "version": "1.0",
    "totalRecords": 40160
  },
  "summary": {
    "citiesAnalyzed": 29,
    "hotspotsIdentified": 159,
    "crimeRecords": 40160,
    "timeRange": "2020-2025"
  },
  "data": {
    "cities": [...],
    "hotspots": [...],
    "patterns": [...]
  }
}
```

### 10. Real-Time Updates Endpoint (WebSocket)
```
WebSocket: ws://localhost:5000/ws

Client Messages:
{
  "type": "subscribe",
  "channels": ["predictions", "alerts", "hotspots"]
}

Server Messages (Real-time):
{
  "type": "prediction_update",
  "data": {
    "city": "Delhi",
    "hour": 12,
    "crimeRate": 563.45,
    "timestamp": "2026-01-30T21:40:00Z"
  }
}

{
  "type": "alert",
  "severity": "CRITICAL",
  "message": "High crime spike in Delhi",
  "data": {...}
}

{
  "type": "hotspot_update",
  "data": {
    "id": 1,
    "density": 94.5,
    "priority": "CRITICAL"
  }
}
```

## 🗄️ Database Schema

### Cities Table
```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    population INTEGER,
    base_crime_rate DECIMAL(10, 2),
    risk_level VARCHAR(20),
    hotspot_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Crime Records Table
```sql
CREATE TABLE crime_records (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    incident_date DATE NOT NULL,
    incident_hour INTEGER (0-23),
    crime_type VARCHAR(50),
    domain VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_city_date ON crime_records(city_id, incident_date);
CREATE INDEX idx_hour ON crime_records(incident_hour);
CREATE INDEX idx_location ON crime_records USING GIST(ll_to_earth(latitude, longitude));
```

### Hotspots Table
```sql
CREATE TABLE hotspots (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    crime_density DECIMAL(5, 2),
    priority VARCHAR(20),
    crime_count INTEGER,
    area VARCHAR(100),
    boundary_polygon POLYGON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_city_priority ON hotspots(city_id, priority);
CREATE INDEX idx_location ON hotspots USING GIST(ll_to_earth(latitude, longitude));
```

### Model Performance Table
```sql
CREATE TABLE model_performance (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(50) NOT NULL,
    accuracy DECIMAL(5, 2),
    precision DECIMAL(5, 2),
    recall DECIMAL(5, 2),
    f1_score DECIMAL(5, 2),
    rmse DECIMAL(8, 4),
    mae DECIMAL(8, 4),
    roc_auc DECIMAL(5, 4),
    training_date DATE,
    hyperparameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Authentication & Security

### API Key Authentication
```python
# Header required:
Authorization: Bearer YOUR_API_KEY
```

### Rate Limiting
```
- Default: 1000 requests per hour per API key
- Burst: 100 requests per minute
```

### CORS Configuration
```python
ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://yourdomain.com'
]
```

## 📦 Implementation Example (Flask)

```python
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database connection (using SQLAlchemy)
from sqlalchemy import create_engine
engine = create_engine('postgresql://user:password@localhost/precrime')

# ============ REST Endpoints ============

@app.route('/api/predict', methods=['GET'])
def predict_crime():
    city = request.args.get('city', required=True)
    hour = int(request.args.get('hour', required=True))
    domain = request.args.get('domain', 'All')
    
    try:
        # Query base rate
        base_rate = get_city_base_rate(city)
        
        # Apply hour multiplier
        hour_factor = get_hour_factor(hour)
        adjusted_rate = base_rate * hour_factor
        
        return jsonify({
            'city': city,
            'hour': hour,
            'domain': domain,
            'baseCrimeRate': base_rate,
            'adjustedRate': adjusted_rate,
            'confidence': 99.98,
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/cities/rankings', methods=['GET'])
def get_city_rankings():
    try:
        cities = fetch_cities_by_crime_rate()
        return jsonify({
            'cities': cities,
            'totalCities': len(cities),
            'lastUpdated': datetime.utcnow().isoformat() + 'Z'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/hotspots', methods=['GET'])
def get_hotspots():
    city = request.args.get('city')
    priority = request.args.get('priority')
    limit = int(request.args.get('limit', 100))
    offset = int(request.args.get('offset', 0))
    
    try:
        query = "SELECT * FROM hotspots WHERE 1=1"
        params = []
        
        if city:
            query += " AND city_id = (SELECT id FROM cities WHERE name = %s)"
            params.append(city)
        
        if priority:
            query += " AND priority = %s"
            params.append(priority)
        
        query += f" LIMIT {limit} OFFSET {offset}"
        
        hotspots = execute_query(query, params)
        return jsonify({
            'hotspots': hotspots,
            'totalHotspots': 159,
            'lastUpdated': datetime.utcnow().isoformat() + 'Z'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ============ WebSocket Events ============

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('response', {'data': 'Connected to PreCrime Real-time Server'})

@socketio.on('subscribe')
def handle_subscribe(data):
    channels = data.get('channels', [])
    for channel in channels:
        join_room(channel)
    emit('subscribed', {'channels': channels})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

# Real-time update broadcaster
def broadcast_prediction_update(city, hour, crime_rate):
    socketio.emit('prediction_update', {
        'type': 'prediction_update',
        'data': {
            'city': city,
            'hour': hour,
            'crimeRate': crime_rate,
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }
    }, room='predictions')

# ============ Helper Functions ============

def get_city_base_rate(city):
    """Fetch base crime rate for city from database"""
    query = "SELECT base_crime_rate FROM cities WHERE name = %s"
    result = execute_query(query, [city])
    return result[0]['base_crime_rate'] if result else 100

def get_hour_factor(hour):
    """Get hour-based multiplier for crime rates"""
    hour_factors = {
        0: 0.98, 1: 0.96, 2: 0.95, 3: 1.12,  # Night peak at 3 AM
        4: 0.94, 5: 0.92, 6: 0.90, 7: 0.88,
        8: 0.90, 9: 0.92, 10: 0.94, 11: 0.96,
        12: 1.00, 13: 0.98, 14: 0.96, 15: 0.95,
        16: 0.96, 17: 0.98, 18: 1.02, 19: 1.05,
        20: 1.08, 21: 1.10, 22: 1.12, 23: 1.10
    }
    return hour_factors.get(hour, 1.0)

def execute_query(query, params):
    """Execute database query"""
    with engine.connect() as connection:
        result = connection.execute(query, params)
        return [dict(row) for row in result]

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
```

## 🚀 Deployment Checklist

- [ ] Database setup and migration
- [ ] API endpoints tested
- [ ] WebSocket server configured
- [ ] Authentication implemented
- [ ] Rate limiting enabled
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Database backups automated
- [ ] Monitoring alerts setup
- [ ] Load testing completed

## 📚 Additional Resources

- API Documentation: See `INTEGRATION_GUIDE.md`
- Frontend Code: `src/api/crimeDataService.js`
- Custom Hooks: `src/hooks/useCrimeData.js`
- Feature Components: `src/features/`

---

**Status**: 📋 **API SPECIFICATION COMPLETE**
**Last Updated**: January 30, 2026
