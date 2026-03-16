# Property Intelligence Portal

A full-stack AI-powered property valuation and market analysis platform built as a microservices architecture. It integrates a Machine Learning regression model with two independent backend services (Python and Java) and a unified Next.js frontend portal.

**GitHub:** https://github.com/riddhiksingh8/property_intelligence

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Services](#services)
- [ML Model](#ml-model)
- [API Endpoints](#api-endpoints)
- [Prerequisites](#prerequisites)
- [Local Setup & Testing](#local-setup--testing)
- [Docker Setup & Testing](#docker-setup--testing)
- [Application Walkthrough](#application-walkthrough)

---

## Project Overview

The platform hosts two independent applications inside a single Next.js portal:

- **App 1 — Property Value Estimator**: Users input 7 property features and receive an instant AI-generated price prediction. Results are stored in history and multiple properties can be compared side-by-side with charts.

- **App 2 — Property Market Analysis**: An interactive dashboard with market statistics, filterable/sortable property data tables, what-if scenario analysis, and CSV/PDF export.

Both apps communicate with a central ML model service that runs a Linear Regression algorithm trained on a 50-property housing dataset achieving **R² = 0.98**.

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

## Repository Structure

```
property_intelligence/
├── house-price-api/          # ML model service (Python · FastAPI · scikit-learn)
│   ├── app/
│   │   ├── main.py           # FastAPI app + endpoints
│   │   ├── model.py          # Linear Regression training & inference
│   │   └── schemas.py        # Pydantic request/response models
│   ├── data/
│   │   └── House Price Dataset.csv
│   ├── Dockerfile
│   └── requirements.txt
│
├── property-estimator-api/   # App 1 backend (Python · FastAPI)
│   ├── app/
│   │   ├── main.py           # Estimate endpoint + in-memory history
│   │   └── schemas.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── market-analysis-api/      # App 2 backend (Java 21 · Spring Boot)
│   └── src/main/java/com/deloitte/market/
│       ├── MarketAnalysisApplication.java
│       ├── controller/MarketController.java
│       ├── service/
│       │   ├── MarketService.java
│       │   ├── HousingDataService.java
│       │   └── MlModelClient.java
│       ├── model/            # Java records (Property, MarketStats, etc.)
│       └── config/           # CORS + RestTemplate config
│   ├── Dockerfile
│   └── pom.xml
│
├── nextjs-portal/            # Unified frontend (Next.js 15 · TypeScript · Tailwind)
│   ├── app/
│   │   ├── page.tsx          # Home / landing page
│   │   ├── app1/page.tsx     # Property Value Estimator
│   │   ├── app1/compare/     # Side-by-side comparison
│   │   ├── app2/page.tsx     # Market Analysis dashboard
│   │   └── app2/what-if/     # What-if scenario tool
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── app1/             # EstimatorForm, PredictionResult, HistoryTable
│   │   └── app2/             # StatsCards, PriceCharts, PropertyTable, WhatIfTool
│   └── lib/
│       ├── api.ts            # API client wrappers
│       └── types.ts          # TypeScript interfaces
│
├── docker-compose.yml        # Orchestrates all 4 services
├── Makefile                  # Shortcut commands
└── README.md
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

**Input Features:**

| Feature | Description |
|---|---|
| `square_footage` | Total size of the house in sqft |
| `bedrooms` | Number of bedrooms |
| `bathrooms` | Number of bathrooms (0.5 increments) |
| `year_built` | Year the house was constructed |
| `lot_size` | Size of the land plot in sqft |
| `distance_to_city_center` | Distance to city center in miles |
| `school_rating` | School district quality rating (0–10) |

**Performance (20% holdout test set):**

| Metric | Value |
|---|---|
| R² Score | 0.98 |
| MAE | ~$7,916 |
| RMSE | ~$10,277 |
| Training samples | 40 |
| Test samples | 10 |

Features are normalized with `StandardScaler` before training. The model trains automatically on every service startup.

---

## API Endpoints

### house-price-api — :8000 · [Swagger](http://localhost:8000/docs)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/predict` | Single property price prediction |
| POST | `/predict/batch` | Batch price predictions |
| GET | `/model-info` | Coefficients and performance metrics |

### property-estimator-api — :8001 · [Swagger](http://localhost:8001/docs)

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
| GET | `/api/market/properties` | List with optional filters: `bedrooms`, `minYear`, `maxYear`, `minPrice`, `maxPrice`, `sort`, `order` |
| POST | `/api/market/what-if` | Predict price for custom property features |
| GET | `/api/market/export/csv` | Download full dataset as CSV |

---

## Prerequisites

### For Local Development

| Tool | Version | How to Install |
|---|---|---|
| Python | 3.12+ | https://python.org |
| Java JDK | 21 | `winget install EclipseAdoptium.Temurin.21.JDK` |
| Maven | 3.9+ | Download zip from https://maven.apache.org → extract to `C:\maven` |
| Node.js | 22+ | https://nodejs.org |

After extracting Maven, add it to PATH (run PowerShell as Administrator):
```powershell
[System.Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\maven\bin", "Machine")
```

### For Docker

- Docker Desktop with virtualization enabled in BIOS

---

## Local Setup & Testing

### 1. Clone the repository

```bash
git clone https://github.com/riddhiksingh8/property_intelligence.git
cd property_intelligence
```

### 2. Set up Python virtual environments

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

### 3. Install Java dependencies

```bash
cd market-analysis-api
mvn dependency:go-offline
cd ..
```

### 4. Install Next.js dependencies

```bash
cd nextjs-portal
npm install
cd ..
```

### 5. Start all services

Open **4 separate terminals** in the project root and run one command per terminal **in this order**:

**Terminal 1 — ML Model API (must start first)**
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

Or use Makefile shortcuts (Git Bash):
```bash
make ml        # Terminal 1
make estimator # Terminal 2
make market    # Terminal 3
make portal    # Terminal 4
```

### 6. Verify everything is running

```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8080/api/market/health
```

All should return `{"status":"healthy",...}`

### 7. Local URLs

| URL | Description |
|---|---|
| http://localhost:3000 | Main portal |
| http://localhost:3000/app1 | Property Value Estimator |
| http://localhost:3000/app2 | Market Analysis Dashboard |
| http://localhost:8000/docs | ML Model API — Swagger UI |
| http://localhost:8001/docs | Estimator API — Swagger UI |

### 8. Quick API test

```bash
# Predict a house price directly via ML model
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d "{\"square_footage\":1850,\"bedrooms\":3,\"bathrooms\":2,\"year_built\":1998,\"lot_size\":7500,\"distance_to_city_center\":5.6,\"school_rating\":8.2}"

# Submit an estimate (stored in history)
curl -X POST http://localhost:8001/estimate \
  -H "Content-Type: application/json" \
  -d "{\"label\":\"Test House\",\"square_footage\":1850,\"bedrooms\":3,\"bathrooms\":2,\"year_built\":1998,\"lot_size\":7500,\"distance_to_city_center\":5.6,\"school_rating\":8.2}"

# Get market stats
curl http://localhost:8080/api/market/stats
```

---

## Docker Setup & Testing

> Requires Docker Desktop running with virtualization enabled in BIOS.

### 1. Clone the repository

```bash
git clone https://github.com/riddhiksingh8/property_intelligence.git
cd property_intelligence
```

### 2. Build and start all services

```bash
docker-compose up --build
```

First build takes ~5–10 minutes (downloads base images and dependencies). Subsequent starts are fast.

### 3. Verify containers are running

```bash
docker-compose ps
```

Expected:
```
NAME                    STATUS    PORTS
ml-model                Up        0.0.0.0:8000->8000/tcp
property-estimator      Up        0.0.0.0:8001->8001/tcp
market-analysis         Up        0.0.0.0:8080->8080/tcp
nextjs-portal           Up        0.0.0.0:3000->3000/tcp
```

### 4. Open the portal

```
http://localhost:3000
```

### Useful Docker commands

```bash
# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f ml-model
docker-compose logs -f market-analysis

# Stop all services
docker-compose down

# Rebuild a single service
docker-compose up --build market-analysis

# Shell into a container
docker-compose exec ml-model bash
```

---

## Application Walkthrough

### App 1 — Property Value Estimator

1. Go to http://localhost:3000/app1
2. Fill in the 7 property fields and optionally add a label
3. Click **Get Estimate** — predicted price appears with a feature breakdown chart
4. Submit more estimates — they appear in the **History** table
5. Check 2 or more estimates → click **Compare** for a side-by-side view with grouped bar charts

### App 2 — Property Market Analysis

1. Go to http://localhost:3000/app2
2. View the stats dashboard — average price, min/max, school rating, charts by bedrooms and decade
3. Use the filter row to narrow down properties by bedrooms, year range, or price range
4. Click column headers to sort the table
5. Click **Export CSV** to download the full dataset
6. Click **What-If Analysis** → adjust any feature slider → see the predicted price update in real time vs. the dataset average
