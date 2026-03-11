from pydantic import BaseModel, Field
from typing import List, Dict, Any


class HouseFeatures(BaseModel):
    square_footage: float = Field(..., gt=0, description="Total square footage of the house", example=1850)
    bedrooms: int = Field(..., ge=1, description="Number of bedrooms", example=3)
    bathrooms: float = Field(..., ge=0.5, description="Number of bathrooms (0.5 increments)", example=2.0)
    year_built: int = Field(..., ge=1800, le=2025, description="Year the house was built", example=1998)
    lot_size: float = Field(..., gt=0, description="Lot size in square feet", example=7500)
    distance_to_city_center: float = Field(..., ge=0, description="Distance to city center in miles", example=5.6)
    school_rating: float = Field(..., ge=0, le=10, description="School district rating (0–10)", example=8.2)

    model_config = {
        "json_schema_extra": {
            "example": {
                "square_footage": 1850,
                "bedrooms": 3,
                "bathrooms": 2.0,
                "year_built": 1998,
                "lot_size": 7500,
                "distance_to_city_center": 5.6,
                "school_rating": 8.2,
            }
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted house price in USD")
    features_used: HouseFeatures


class BatchPredictionRequest(BaseModel):
    houses: List[HouseFeatures] = Field(..., min_length=1, description="List of houses to predict prices for")

    model_config = {
        "json_schema_extra": {
            "example": {
                "houses": [
                    {
                        "square_footage": 1850,
                        "bedrooms": 3,
                        "bathrooms": 2.0,
                        "year_built": 1998,
                        "lot_size": 7500,
                        "distance_to_city_center": 5.6,
                        "school_rating": 8.2,
                    },
                    {
                        "square_footage": 2400,
                        "bedrooms": 4,
                        "bathrooms": 3.0,
                        "year_built": 2010,
                        "lot_size": 10500,
                        "distance_to_city_center": 8.2,
                        "school_rating": 9.0,
                    },
                ]
            }
        }
    }


class BatchPredictionItem(BaseModel):
    index: int
    predicted_price: float
    features: HouseFeatures


class BatchPredictionResponse(BaseModel):
    count: int
    predictions: List[BatchPredictionItem]


class PerformanceMetrics(BaseModel):
    r2_score: float = Field(..., description="R² coefficient of determination (closer to 1 is better)")
    mae: float = Field(..., description="Mean Absolute Error in USD")
    rmse: float = Field(..., description="Root Mean Squared Error in USD")
    training_samples: int
    test_samples: int


class ModelInfoResponse(BaseModel):
    model_type: str
    feature_names: List[str]
    coefficients: Dict[str, float] = Field(..., description="Feature coefficients in the original (unscaled) space")
    intercept: float
    performance_metrics: PerformanceMetrics
    training_data_size: int


class HealthResponse(BaseModel):
    status: str
    model_trained: bool
    model_type: str
