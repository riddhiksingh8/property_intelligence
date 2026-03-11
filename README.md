# Property Intelligence Portal

A full-stack property valuation and market analysis platform powered by a scikit-learn regression model.

## Services

| Service | Tech | Port |
|---|---|---|
| ML Model API | Python · FastAPI · scikit-learn | 8000 |
| Property Estimator API | Python · FastAPI | 8001 |
| Market Analysis API | Java 21 · Spring Boot 3.4.4 | 8080 |
| Next.js Portal | Next.js 15 · Tailwind CSS | 3000 |

## Prerequisites

- Python 3.12+
- Java 21
- Maven 3.9+
- Next.js 15+

## Setup

```bash
# Python services
cd house-price-api && python -m venv .venv && .venv/Scripts/activate && pip install -r requirements.txt
cd property-estimator-api && python -m venv .venv && .venv/Scripts/activate && pip install -r requirements.txt

```

## Running Locally

Open 4 terminals from the project root:

```bash
# Terminal 1 — ML Model API
cd house-price-api && .venv/Scripts/activate && uvicorn app.main:app --port 8000 --reload

# Terminal 2 — Property Estimator
cd property-estimator-api && .venv/Scripts/activate && uvicorn app.main:app --port 8001 --reload

```

Or use the Makefile:

```bash
make ml         # Terminal 1
make estimator  # Terminal 2
```

## URLs

| URL | Description |
|---|---|
| http://localhost:8000/docs | ML Model API (Swagger) |
| http://localhost:8001/docs | Estimator API (Swagger) |

## Apps

**App 1 — Property Value Estimator**
- Input property details and get an AI price prediction
- View estimation history and compare properties side-by-side

**App 2 — Property Market Analysis**

