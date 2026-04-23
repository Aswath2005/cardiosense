"""
Inspect the Keras model to understand its architecture and requirements.
"""

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging

import tensorflow as tf
from tensorflow import keras
import numpy as np
import joblib

print("=" * 70)
print("KERAS MODEL INSPECTION")
print("=" * 70)

# Load the model
try:
    model = keras.models.load_model('heart_disease_model.keras')
    print("\n✅ Model loaded successfully")
except Exception as e:
    print(f"\n❌ Failed to load model: {e}")
    exit(1)

# Print model architecture
print("\n📋 MODEL ARCHITECTURE:")
print("-" * 70)
model.summary()

# Check input shape
print("\n📥 INPUT SPECIFICATIONS:")
print("-" * 70)
input_shape = model.input_shape
print(f"Model input shape: {input_shape}")
if len(input_shape) > 1:
    print(f"  - Number of features: {input_shape[1]}")

# Check output shape
print("\n📤 OUTPUT SPECIFICATIONS:")
print("-" * 70)
output_shape = model.output_shape
print(f"Model output shape: {output_shape}")
if len(output_shape) > 1:
    print(f"  - Output units: {output_shape[1]}")

# Test with dummy input
print("\n🧪 TEST PREDICTION WITH DUMMY DATA:")
print("-" * 70)
dummy_input = np.random.rand(1, 13).astype(np.float32)  # 13 features
print(f"Input shape: {dummy_input.shape}")
print(f"Input data: {dummy_input[0]}")

try:
    prediction = model.predict(dummy_input, verbose=0)
    print(f"\nPrediction output shape: {prediction.shape}")
    print(f"Prediction values: {prediction}")
    print(f"Prediction[0]: {prediction[0]}")
    if len(prediction[0]) > 1:
        print(f"  - Class 0 probability: {prediction[0][0]:.4f}")
        print(f"  - Class 1 probability: {prediction[0][1]:.4f}")
    else:
        print(f"  - Probability output: {prediction[0][0]:.4f}")
except Exception as e:
    print(f"❌ Prediction failed: {e}")

# Load and check scaler
print("\n" + "=" * 70)
print("SCALER INSPECTION")
print("=" * 70)

try:
    scaler = joblib.load('scaler.pkl')
    print("\n✅ Scaler loaded successfully")
    print(f"Scaler type: {type(scaler)}")
    print(f"Number of features: {scaler.n_features_in_}")
    print(f"Feature names: {scaler.get_feature_names_out() if hasattr(scaler, 'get_feature_names_out') else 'N/A'}")
    
    # Check scaling parameters
    if hasattr(scaler, 'mean_'):
        print(f"\nMean values: {scaler.mean_}")
        print(f"Scale values: {scaler.scale_}")
        print(f"Variance: {scaler.var_}")
        
except Exception as e:
    print(f"\n❌ Failed to load scaler: {e}")

print("\n" + "=" * 70)
