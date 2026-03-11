import os
import uuid
from datetime import datetime

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import EstimateRequest, EstimateResult, HouseFeatures

ML_MODEL_URL = os.getenv("ML_MODEL_URL", "http://localhost:8000")

_history: list[dict] = []

app = FastAPI(
    title="Property Estimator API",
    description="Backend for the Property Value Estimator – stores estimation history and proxies the ML model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Ops"])
def health():
    return {"status": "healthy", "service": "property-estimator-api"}


@app.post("/estimate", response_model=EstimateResult, tags=["Estimator"])
async def estimate(request: EstimateRequest):
    """Submit property features → get a price prediction and persist it in history."""
    features = {
        k: v for k, v in request.model_dump().items() if k != "label"
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.post(f"{ML_MODEL_URL}/predict", json=features)
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"ML model returned {e.response.status_code}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"ML model unreachable: {e}")

    prediction = resp.json()
    item = {
        "id": str(uuid.uuid4()),
        "label": request.label,
        "predicted_price": prediction["predicted_price"],
        "timestamp": datetime.now().isoformat(),
        "features": features,
    }
    _history.append(item)
    return item


@app.get("/history", response_model=list[EstimateResult], tags=["Estimator"])
def get_history():
    """Return all saved estimates, newest first."""
    return list(reversed(_history))


@app.delete("/history/{item_id}", tags=["Estimator"])
def delete_item(item_id: str):
    global _history
    before = len(_history)
    _history = [h for h in _history if h["id"] != item_id]
    if len(_history) == before:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Deleted"}


@app.delete("/history", tags=["Estimator"])
def clear_history():
    _history.clear()
    return {"message": "History cleared"}
