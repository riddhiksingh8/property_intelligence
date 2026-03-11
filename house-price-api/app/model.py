import os
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating",
]


class HousePriceModel:
    def __init__(self) -> None:
        self.model: LinearRegression | None = None
        self.scaler = StandardScaler()
        self.feature_names = FEATURE_NAMES
        self.metrics: dict = {}
        self.training_data_size: int = 0
        self.is_trained: bool = False

    # ------------------------------------------------------------------
    # Training
    # ------------------------------------------------------------------

    def train(self, data_path: str) -> None:
        """Train a Linear Regression model on the housing dataset."""
        df = pd.read_csv(data_path)

        X = df[self.feature_names]
        y = df["price"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        self.model = LinearRegression()
        self.model.fit(X_train_scaled, y_train)

        y_pred = self.model.predict(X_test_scaled)

        self.metrics = {
            "r2_score": round(float(r2_score(y_test, y_pred)), 4),
            "mae": round(float(mean_absolute_error(y_test, y_pred)), 2),
            "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2),
            "training_samples": int(len(X_train)),
            "test_samples": int(len(X_test)),
        }

        self.training_data_size = len(df)
        self.is_trained = True

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------

    def predict_single(self, features: dict) -> float:
        """Return a price prediction for a single house."""
        X = pd.DataFrame([features])[self.feature_names]
        X_scaled = self.scaler.transform(X)
        return float(self.model.predict(X_scaled)[0])

    def predict_batch(self, features_list: list[dict]) -> list[float]:
        """Return price predictions for a list of houses."""
        X = pd.DataFrame(features_list)[self.feature_names]
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled).tolist()

    # ------------------------------------------------------------------
    # Introspection
    # ------------------------------------------------------------------

    def get_info(self) -> dict:
        """Return model metadata, coefficients, and performance metrics."""
        # Convert scaled coefficients back to original-feature space so they
        # represent the expected price change per unit increase in each feature.
        original_coefs = self.model.coef_ / self.scaler.scale_
        coefficients = {
            name: round(float(coef), 4)
            for name, coef in zip(self.feature_names, original_coefs)
        }

        return {
            "model_type": "Linear Regression",
            "feature_names": self.feature_names,
            "coefficients": coefficients,
            "intercept": round(float(self.model.intercept_), 2),
            "performance_metrics": self.metrics,
            "training_data_size": self.training_data_size,
        }


# Module-level singleton – imported by main.py
house_price_model = HousePriceModel()
