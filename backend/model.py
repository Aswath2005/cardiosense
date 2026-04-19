"""
CardioSense AI — Model Loading and Prediction
Loads the trained Logistic Regression model and StandardScaler,
and provides prediction functionality for the FastAPI backend.
"""

import joblib
import numpy as np
from typing import Dict, Any
import os


class ModelLoader:
    """Load and manage ML model and scaler."""
    
    def __init__(self, model_path: str = "model.pkl", scaler_path: str = "scaler.pkl"):
        """
        Initialize model loader.
        
        Args:
            model_path: Path to the trained model file
            scaler_path: Path to the StandardScaler file
        """
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model = None
        self.scaler = None
        self.loaded = False
        
        self.load_model()
    
    def load_model(self) -> bool:
        """
        Load model and scaler from disk.
        
        Returns:
            bool: True if loading successful, False otherwise
        """
        try:
            # Check if files exist
            if not os.path.exists(self.model_path):
                print(f"⚠️  Model file not found: {self.model_path}")
                return False
            
            if not os.path.exists(self.scaler_path):
                print(f"⚠️  Scaler file not found: {self.scaler_path}")
                return False
            
            # Load model and scaler
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            self.loaded = True
            
            print(f"✅ Model loaded: {self.model_path}")
            print(f"✅ Scaler loaded: {self.scaler_path}")
            
            return True
        
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            return False
    
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.loaded and self.model is not None and self.scaler is not None


def predict(input_data: Dict[str, Any], model_loader: ModelLoader) -> Dict[str, Any]:
    """
    Make a prediction using the loaded model.
    
    Args:
        input_data: Dictionary with 13 feature values:
                   age, sex, cp, trestbps, chol, fbs, restecg,
                   thalach, exang, oldpeak, slope, ca, thal
        model_loader: ModelLoader instance with loaded model and scaler
    
    Returns:
        dict: Prediction results with keys:
              - prediction: 0 or 1
              - result: "Heart Disease Detected" or "No Heart Disease"
              - risk_level: "high" or "low"
              - probability: float (0-1, 2 decimals)
    
    Raises:
        ValueError: If model is not loaded or input validation fails
    """
    if not model_loader.is_loaded():
        raise ValueError("Model not loaded. Cannot make predictions.")
    
    # Extract features in correct order
    feature_order = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ]
    
    # Validate all features are present
    missing_features = [f for f in feature_order if f not in input_data]
    if missing_features:
        raise ValueError(f"Missing features: {missing_features}")
    
    try:
        # Create feature vector in correct order
        features = np.array([[
            input_data['age'],
            input_data['sex'],
            input_data['cp'],
            input_data['trestbps'],
            input_data['chol'],
            input_data['fbs'],
            input_data['restecg'],
            input_data['thalach'],
            input_data['exang'],
            input_data['oldpeak'],
            input_data['slope'],
            input_data['ca'],
            input_data['thal']
        ]], dtype=float)
        
        # Scale features
        features_scaled = model_loader.scaler.transform(features)
        
        # Make prediction
        prediction = int(model_loader.model.predict(features_scaled)[0])
        probability = float(model_loader.model.predict_proba(features_scaled)[0][1])
        
        # Format probability to 2 decimal places
        probability_rounded = round(probability, 2)
        
        # Determine risk level
        risk_level = "high" if prediction == 1 else "low"
        
        # Determine result message
        result = "Heart Disease Detected" if prediction == 1 else "No Heart Disease"
        
        return {
            "prediction": prediction,
            "result": result,
            "risk_level": risk_level,
            "probability": probability_rounded
        }
    
    except Exception as e:
        raise ValueError(f"Prediction failed: {str(e)}")
