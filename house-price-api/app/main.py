import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from app.model import house_price_model
from app.schemas import (
    BatchPredictionItem,
    BatchPredictionRequest,
    BatchPredictionResponse,
    HealthResponse,
    HouseFeatures,
    ModelInfoResponse,
    PerformanceMetrics,
    PredictionResponse,
)

# ---------------------------------------------------------------------------
# Dataset path – resolved relative to this file so it works inside Docker too
# ---------------------------------------------------------------------------
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "House Price Dataset.csv")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Train the model once on startup."""
    house_price_model.train(DATA_PATH)
    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="House Price Prediction API",
    description=(
        "A regression model API that predicts house prices based on property features.\n\n"
        "## Endpoints\n"
        "- **POST /predict** – single prediction\n"
        "- **POST /predict/batch** – batch predictions\n"
        "- **GET /model-info** – model coefficients & performance metrics\n"
        "- **GET /health** – liveness check\n"
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    tags=["Ops"],
)
def health():
    """Returns the service status and whether the model is ready."""
    return HealthResponse(
        status="healthy",
        model_trained=house_price_model.is_trained,
        model_type="Linear Regression",
    )


# ---------------------------------------------------------------------------
# Predict – single
# ---------------------------------------------------------------------------


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict price for a single house",
    tags=["Predictions"],
)
def predict(features: HouseFeatures):
    """
    Accepts the features of a single house and returns its predicted price.

    All feature fields are required. See the schema below for valid ranges.
    """
    if not house_price_model.is_trained:
        raise HTTPException(status_code=503, detail="Model is not ready yet.")

    price = house_price_model.predict_single(features.model_dump())
    return PredictionResponse(
        predicted_price=round(price, 2),
        features_used=features,
    )


# ---------------------------------------------------------------------------
# Predict – batch
# ---------------------------------------------------------------------------


@app.post(
    "/predict/batch",
    response_model=BatchPredictionResponse,
    summary="Predict prices for multiple houses",
    tags=["Predictions"],
)
def predict_batch(request: BatchPredictionRequest):
    """
    Accepts a list of houses and returns a predicted price for each one.

    The response preserves the original order and includes a zero-based index
    so results can be matched back to the input list.
    """
    if not house_price_model.is_trained:
        raise HTTPException(status_code=503, detail="Model is not ready yet.")

    features_list = [h.model_dump() for h in request.houses]
    prices = house_price_model.predict_batch(features_list)

    predictions = [
        BatchPredictionItem(
            index=i,
            predicted_price=round(price, 2),
            features=house,
        )
        for i, (house, price) in enumerate(zip(request.houses, prices))
    ]

    return BatchPredictionResponse(count=len(predictions), predictions=predictions)


# ---------------------------------------------------------------------------
# Model info
# ---------------------------------------------------------------------------


@app.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Model coefficients and performance metrics",
    tags=["Model"],
)
def model_info():
    """
    Returns:
    - **model_type** – algorithm used
    - **coefficients** – per-feature weights in original (unscaled) units,
      i.e. the expected USD change per unit increase in each feature
    - **intercept** – regression intercept
    - **performance_metrics** – R², MAE, RMSE evaluated on the held-out test set
    - **training_data_size** – total rows used for training + evaluation
    """
    if not house_price_model.is_trained:
        raise HTTPException(status_code=503, detail="Model is not ready yet.")

    info = house_price_model.get_info()
    return ModelInfoResponse(
        model_type=info["model_type"],
        feature_names=info["feature_names"],
        coefficients=info["coefficients"],
        intercept=info["intercept"],
        performance_metrics=PerformanceMetrics(**info["performance_metrics"]),
        training_data_size=info["training_data_size"],
    )
