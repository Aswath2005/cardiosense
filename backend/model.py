"""
CardioSense — Model Loading and Prediction
Loads the trained KNN model (via Keras) and StandardScaler,
and provides prediction functionality for the FastAPI backend.
"""

import joblib
import numpy as np
from typing import Dict, Any
import os

try:
    import tensorflow as tf
    from tensorflow import keras
    KERAS_AVAILABLE = True
except ImportError:
    KERAS_AVAILABLE = False
    print("⚠️  TensorFlow/Keras not available, some features may not work")


class ModelLoader:
    """Load and manage ML model and scaler."""
    
    def __init__(self, model_path: str = "heart_disease_model.keras", scaler_path: str = "scaler.pkl"):
        """
        Initialize model loader.
        
        Args:
            model_path: Path to the trained Keras model file (.keras)
            scaler_path: Path to the StandardScaler file (.pkl)
        """
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model = None
        self.scaler = None
        self.loaded = False
        self.model_type = "keras"  # Track model type
        
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
            
            # Load Keras model
            if KERAS_AVAILABLE:
                self.model = keras.models.load_model(self.model_path)
                print(f"✅ Keras model loaded: {self.model_path}")
            else:
                print(f"❌ TensorFlow/Keras not available, cannot load {self.model_path}")
                return False
            
            # Load scaler
            self.scaler = joblib.load(self.scaler_path)
            print(f"✅ Scaler loaded: {self.scaler_path}")
            
            self.loaded = True
            return True
        
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            return False
    
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.loaded and self.model is not None and self.scaler is not None


def predict(input_data: Dict[str, Any], model_loader: ModelLoader) -> Dict[str, Any]:
    """
    Make a prediction using the loaded Keras model.
    
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
        print(f"   Scaled features: {features_scaled[0]}")
        
        # Make prediction using Keras model
        # Keras model outputs shape (1, 1) - single sigmoid probability
        try:
            prediction_proba = model_loader.model.predict(features_scaled, verbose=0)
            print(f"   Raw model output shape: {prediction_proba.shape}")
            print(f"   Raw model output: {prediction_proba}")
        except Exception as pred_error:
            raise ValueError(f"Keras model prediction failed: {str(pred_error)}")
        
        # Extract probability from the output
        try:
            # Model outputs shape (1, 1) with sigmoid activation
            if prediction_proba.shape == (1, 1):
                probability = float(prediction_proba[0, 0])
            elif len(prediction_proba.shape) == 1:
                probability = float(prediction_proba[0])
            else:
                # Fallback for other shapes
                probability = float(prediction_proba.flatten()[0])
        except Exception as shape_error:
            raise ValueError(f"Error extracting probability from model output: {str(shape_error)}")
        
        # IMPORTANT: Model outputs P(no disease), so invert to get P(disease)
        probability = 1.0 - probability
        print(f"   Inverted probability (P(disease)): {probability}")
        
        # Make binary prediction using 0.5 threshold
        prediction = int(probability > 0.5)
        
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
