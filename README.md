# Property Intelligence Portal

A full-stack AI-powered property valuation and market analysis platform built as a microservices architecture. The system combines a Machine Learning regression model, two independent backend services (Python and Java), and a unified Next.js frontend portal.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Services](#services)
- [ML Model](#ml-model)
- [API Endpoints](#api-endpoints)
- [Prerequisites](#prerequisites)
- [Local Setup & Testing](#local-setup--testing)
- [Docker Setup & Testing](#docker-setup--testing)
- [Application Walkthrough](#application-walkthrough)

---

## Project Overview

The platform consists of two applications hosted inside a single Next.js portal:

- **App 1 — Property Value Estimator**: Users input property details and receive an instant AI-generated price prediction. Estimates are stored in history and can be compared side-by-side.
- **App 2 — Property Market Analysis**: An interactive dashboard showing market statistics, filterable property data, what-if scenario analysis, and data export options.

Both applications communicate with a central ML model service that runs a Linear Regression algorithm trained on a real estate dataset.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Portal :3000                       │
│          App 1 (Estimator)  |  App 2 (Market Analysis)      │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
  property-estimator-api          market-analysis-api
     Python / FastAPI              Java 21 / Spring Boot
          :8001                          :8080
               │                          │
               └──────────────┬───────────┘
                              ▼
                     house-price-api
                  Python / FastAPI / scikit-learn
                           :8000
                    (ML Model — Linear Regression)
```

---

## Services

| Service | Technology | Port | Role |
|---|---|---|---|
| `house-price-api` | Python 3.12 · FastAPI · scikit-learn | 8000 | Trains and serves the ML model |
| `property-estimator-api` | Python 3.12 · FastAPI | 8001 | App 1 backend — estimates + history |
| `market-analysis-api` | Java 21 · Spring Boot 3.4.4 | 8080 | App 2 backend — market analytics |
| `nextjs-portal` | Next.js 15 · TypeScript · Tailwind CSS | 3000 | Unified frontend portal |

---

## ML Model

**Algorithm:** Linear Regression (scikit-learn)

**Input Features (7):**

| Feature | Description |
|---|---|
| `square_footage` | Total size of the house in sqft |
| `bedrooms` | Number of bedrooms |
| `bathrooms` | Number of bathrooms (0.5 increments) |
| `year_built` | Year the house was constructed |
| `lot_size` | Size of the land plot in sqft |
| `distance_to_city_center` | Distance to city center in miles |
| `school_rating` | School district quality rating (0–10) |

**Target:** `price` — predicted house price in USD

**Performance (on 20% holdout test set):**
- R² Score: **0.98** (98% variance explained)
- MAE: ~$7,916
- RMSE: ~$10,277

The model is trained automatically every time the service starts. Features are normalized using `StandardScaler` before training.

---

## API Endpoints

### house-price-api (ML Model) — :8000

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/predict` | Predict price for a single property |
| POST | `/predict/batch` | Predict prices for multiple properties |
| GET | `/model-info` | Model coefficients and performance metrics |

### property-estimator-api — :8001

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/estimate` | Submit property, get prediction, store in history |
| GET | `/history` | Retrieve all past estimates |
| DELETE | `/history/{id}` | Delete a specific estimate |
| DELETE | `/history` | Clear all estimates |

### market-analysis-api — :8080

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/market/health` | Health check |
| GET | `/api/market/stats` | Market statistics (avg price, by bedrooms, by decade) |
| GET | `/api/market/properties` | List properties with filtering and sorting |
| POST | `/api/market/what-if` | Predict price for a hypothetical property |
| GET | `/api/market/export/csv` | Download full dataset as CSV |

---

## Prerequisites

### Local

| Tool | Version | Install |
|---|---|---|
| Python | 3.12+ | https://python.org |
| Java JDK | 21 | `winget install EclipseAdoptium.Temurin.21.JDK` |
| Maven | 3.9+ | https://maven.apache.org/download.cgi → extract to `C:\maven` |
| Node.js | 22+ | https://nodejs.org |

Add Maven to PATH after extracting:
```powershell
# Run as Administrator
[System.Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\maven\bin", "Machine")
```

### Docker

| Tool | Version |
|---|---|
| Docker Desktop | Latest (requires virtualization enabled in BIOS) |

---

## Local Setup & Testing

### Step 1 — Clone and enter the project

```bash
git clone <repo-url>
cd deloitte
```

### Step 2 — Set up Python virtual environments

```bash
# ML Model API
cd house-price-api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Property Estimator API
cd property-estimator-api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 3 — Install Java dependencies

```bash
cd market-analysis-api
mvn dependency:go-offline
cd ..
```

### Step 4 — Install Next.js dependencies

```bash
cd nextjs-portal
npm install
cd ..
```

### Step 5 — Start all services (4 terminals, in this order)

**Terminal 1 — ML Model API (start this first)**
```bash
cd house-price-api
.venv\Scripts\activate
uvicorn app.main:app --port 8000 --reload
```

**Terminal 2 — Property Estimator API**
```bash
cd property-estimator-api
.venv\Scripts\activate
uvicorn app.main:app --port 8001 --reload
```

**Terminal 3 — Market Analysis API**
```bash
cd market-analysis-api
mvn spring-boot:run
```
> First run downloads Spring Boot dependencies (~2–3 min)

**Terminal 4 — Next.js Portal**
```bash
cd nextjs-portal
npm run dev
```

Or use the Makefile shortcuts (Git Bash only):
```bash
make ml        # Terminal 1
make estimator # Terminal 2
make market    # Terminal 3
make portal    # Terminal 4
```

### Step 6 — Verify all services are running

```bash
curl http://localhost:8000/health   # {"status":"healthy","model_trained":true,...}
curl http://localhost:8001/health   # {"status":"healthy",...}
curl http://localhost:8080/api/market/health  # {"status":"healthy",...}
curl http://localhost:3000          # Next.js portal HTML
```

### Local URLs

| URL | Description |
|---|---|
| http://localhost:3000 | Main portal (start here) |
| http://localhost:3000/app1 | Property Value Estimator |
| http://localhost:3000/app2 | Property Market Analysis |
| http://localhost:8000/docs | ML Model API — Swagger UI |
| http://localhost:8001/docs | Estimator API — Swagger UI |
| http://localhost:8080/api/market/stats | Market stats JSON |

### Test a prediction manually

```bash
# Single prediction via ML Model
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d "{\"square_footage\":1850,\"bedrooms\":3,\"bathrooms\":2,\"year_built\":1998,\"lot_size\":7500,\"distance_to_city_center\":5.6,\"school_rating\":8.2}"

# Via Estimator (stores in history)
curl -X POST http://localhost:8001/estimate \
  -H "Content-Type: application/json" \
  -d "{\"label\":\"Test House\",\"square_footage\":1850,\"bedrooms\":3,\"bathrooms\":2,\"year_built\":1998,\"lot_size\":7500,\"distance_to_city_center\":5.6,\"school_rating\":8.2}"

# Market stats
curl http://localhost:8080/api/market/stats
```

---

## Docker Setup & Testing

> **Requires:** Docker Desktop running with virtualization enabled in BIOS.

### Step 1 — Start all services with one command

```bash
cd deloitte
docker-compose up --build
```

This builds and starts all 4 services automatically. First build takes ~5–10 minutes.

### Step 2 — Verify containers are running

```bash
docker-compose ps
```

Expected output:
```
NAME                    STATUS          PORTS
ml-model                Up              0.0.0.0:8000->8000/tcp
property-estimator      Up              0.0.0.0:8001->8001/tcp
market-analysis         Up              0.0.0.0:8080->8080/tcp
nextjs-portal           Up              0.0.0.0:3000->3000/tcp
```

### Step 3 — Open the portal

```
http://localhost:3000
```

### Useful Docker commands

```bash
# Start in background
docker-compose up --build -d

# View logs for a specific service
docker-compose logs -f ml-model
docker-compose logs -f market-analysis

# Stop all services
docker-compose down

# Rebuild a single service
docker-compose up --build market-analysis

# Run a one-off test against the ML model
docker-compose exec ml-model curl http://localhost:8000/health
```

### Docker URLs (same as local)

| URL | Description |
|---|---|
| http://localhost:3000 | Main portal |
| http://localhost:8000/docs | ML Model Swagger UI |
| http://localhost:8001/docs | Estimator Swagger UI |
| http://localhost:8080/api/market/stats | Market stats |

---

## Application Walkthrough

### App 1 — Property Value Estimator

1. Navigate to http://localhost:3000/app1
2. Fill in the 7 property fields (square footage, bedrooms, etc.)
3. Optionally add a label (e.g. "Dream Home")
4. Click **Get Estimate** → predicted price appears instantly
5. Submit multiple estimates → they appear in the **History** table below
6. Check 2+ estimates → click **Compare** to see a side-by-side comparison with charts

### App 2 — Property Market Analysis

1. Navigate to http://localhost:3000/app2
2. The dashboard loads with:
   - Key stats (avg price, min/max, school rating)
   - Bar charts (price by bedrooms, price by decade built)
   - Full property table (50 records)
3. Use the filter row above the table to filter by bedrooms, year, or price range
4. Click column headers to sort
5. Click **Export CSV** to download the dataset
6. Click **What-If Analysis** → adjust any property feature → see predicted price vs. market average in real time
