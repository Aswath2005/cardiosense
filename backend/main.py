"""
CardioSense — FastAPI Backend
Provides REST API endpoints for heart disease risk prediction.
Routes:
  GET  /           → API status
  GET  /health     → Model health check
  POST /predict    → Heart disease risk prediction
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
import os

from model import ModelLoader, predict

# Initialize FastAPI app
app = FastAPI(
    title="CardioSense API",
    description="Heart Attack Risk Prediction using Logistic Regression",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3002",
        "https://*"  # Allow all HTTPS origins for production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model loader (global)
model_loader = ModelLoader(
    model_path=os.getenv("MODEL_PATH", "heart_disease_model.keras"),
    scaler_path=os.getenv("SCALER_PATH", "scaler.pkl")
)


# Pydantic models for request/response validation
class PatientData(BaseModel):
    """Patient health data for prediction."""
    age: int = Field(..., description="Age in years", ge=1, le=150)
    sex: Literal[0, 1] = Field(..., description="0=Female, 1=Male")
    cp: Literal[0, 1, 2, 3] = Field(..., description="Chest pain type")
    trestbps: int = Field(..., description="Resting blood pressure (mm Hg)")
    chol: int = Field(..., description="Serum cholesterol (mg/dl)")
    fbs: Literal[0, 1] = Field(..., description="Fasting blood sugar")
    restecg: Literal[0, 1, 2] = Field(..., description="Resting ECG")
    thalach: int = Field(..., description="Maximum heart rate achieved")
    exang: Literal[0, 1] = Field(..., description="Exercise-induced angina")
    oldpeak: float = Field(..., description="ST depression")
    slope: Literal[1, 2, 3] = Field(..., description="ST slope")
    ca: Literal[0, 1, 2, 3] = Field(..., description="Major vessels")
    thal: Literal[3, 6, 7] = Field(..., description="Thalassemia")


class PredictionResponse(BaseModel):
    """Prediction response."""
    prediction: Literal[0, 1]
    result: str
    risk_level: Literal["low", "high"]
    probability: float


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    model_loaded: bool


# Routes
@app.get("/")
def read_root() -> dict:
    """
    Root endpoint — API status check.
    
    Returns:
        dict: Status message
    """
    return {"status": "CardioSense API running"}


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """
    Health check endpoint — Verifies if model is loaded.
    
    Returns:
        HealthResponse: Status and model_loaded flag
    """
    return HealthResponse(
        status="ok",
        model_loaded=model_loader.is_loaded()
    )


@app.post("/predict", response_model=PredictionResponse)
def predict_risk(patient_data: PatientData) -> PredictionResponse:
    """
    Heart disease risk prediction endpoint.
    
    Accepts patient health data and returns cardiovascular disease risk assessment.
    
    Args:
        patient_data: PatientData model with 13 features
    
    Returns:
        PredictionResponse: Prediction result with risk level and probability
    
    Raises:
        HTTPException: 500 if model not loaded, 422 if validation fails
    """
    # Check if model is loaded
    if not model_loader.is_loaded():
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please ensure heart_disease_model.keras and scaler.pkl exist in the backend directory."
        )
    
    try:
        # Convert Pydantic model to dict
        input_dict = patient_data.model_dump()
        
        # Debug: Log the input
        print(f"\n📥 Prediction Request:")
        for key, value in input_dict.items():
            print(f"   {key}: {value}")
        
        # Make prediction
        result = predict(input_dict, model_loader)
        
        # Debug: Log detailed result
        print(f"✅ Prediction Result:")
        print(f"   prediction (0=no, 1=yes): {result.get('prediction')}")
        print(f"   probability of disease: {result.get('probability') * 100:.2f}%")
        print(f"   risk_level: {result.get('risk_level')}\n")
        
        return PredictionResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on server startup."""
    print("=" * 60)
    print("CardioSense — FastAPI Backend")
    print("=" * 60)
    print(f"✅ API initialized")
    if model_loader.is_loaded():
        print(f"✅ Model is loaded and ready for predictions")
    else:
        print(f"⚠️  Warning: Model is NOT loaded. Check model.pkl and scaler.pkl")
    print("=" * 60)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
