from pydantic import BaseModel, Field
from typing import Optional


class HouseFeatures(BaseModel):
    square_footage: float = Field(..., gt=0, description="Total square footage")
    bedrooms: int = Field(..., ge=1, le=20)
    bathrooms: float = Field(..., ge=0.5, le=10)
    year_built: int = Field(..., ge=1800, le=2025)
    lot_size: float = Field(..., gt=0)
    distance_to_city_center: float = Field(..., ge=0)
    school_rating: float = Field(..., ge=0, le=10)


class EstimateRequest(HouseFeatures):
    label: Optional[str] = Field(None, max_length=100, description="Optional name for this estimate")


class EstimateResult(BaseModel):
    id: str
    label: Optional[str]
    predicted_price: float
    timestamp: str
    features: HouseFeatures
