"""
Test the specific prediction case that returned 1% risk
"""

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import numpy as np
import joblib
from tensorflow import keras

# Load model and scaler
model = keras.models.load_model('heart_disease_model.keras')
scaler = joblib.load('scaler.pkl')

# Test case from user: age 66, likely high-risk case
test_data = {
    'age': 66,
    'sex': 1,
    'cp': 0,
    'trestbps': 145,
    'chol': 223,
    'fbs': 0,
    'restecg': 2,
    'thalach': 150,
    'exang': 0,
    'oldpeak': 2.1,
    'slope': 3,
    'ca': 0,
    'thal': 6,
}

print("=" * 70)
print("PREDICTION TEST - User Case Analysis")
print("=" * 70)

print("\nINPUT DATA:")
print("-" * 70)
for key, value in test_data.items():
    print(f"  {key}: {value}")

# Create feature vector
features = np.array([[
    test_data['age'],
    test_data['sex'],
    test_data['cp'],
    test_data['trestbps'],
    test_data['chol'],
    test_data['fbs'],
    test_data['restecg'],
    test_data['thalach'],
    test_data['exang'],
    test_data['oldpeak'],
    test_data['slope'],
    test_data['ca'],
    test_data['thal']
]], dtype=float)

print("\nRAW FEATURE VECTOR:")
print("-" * 70)
print(f"  Shape: {features.shape}")
print(f"  Values: {features[0]}")

# Scale features
scaled_features = scaler.transform(features)
print("\nSCALED FEATURES:")
print("-" * 70)
print(f"  Shape: {scaled_features.shape}")
print(f"  Values: {scaled_features[0]}")

# Make prediction
prediction = model.predict(scaled_features, verbose=0)
probability = float(prediction[0, 0])

print("\nMODEL OUTPUT:")
print("-" * 70)
print(f"  Raw output: {prediction}")
print(f"  Shape: {prediction.shape}")
print(f"  Probability: {probability:.4f}")
print(f"  Percentage: {probability * 100:.2f}%")
print(f"  Classification: {'DISEASE' if probability > 0.5 else 'NO DISEASE'}")

# Check scaler statistics
print("\nSCALER STATISTICS:")
print("-" * 70)
print(f"  Features: {scaler.get_feature_names_out()}")
print(f"  Mean values:")
for i, (feat, val) in enumerate(zip(scaler.get_feature_names_out(), scaler.mean_)):
    print(f"    {feat}: {val:.2f}")

print(f"\n  Standard deviation (scale):")
for i, (feat, val) in enumerate(zip(scaler.get_feature_names_out(), np.sqrt(scaler.var_))):
    print(f"    {feat}: {val:.2f}")

# Compare to training data distribution
print("\nFEATURE COMPARISON (Input vs Training Mean):")
print("-" * 70)
feature_names = scaler.get_feature_names_out()
for i, (name, mean) in enumerate(zip(feature_names, scaler.mean_)):
    actual = features[0][i]
    scaled = scaled_features[0][i]
    std_dev = np.sqrt(scaler.var_[i])
    deviation = (actual - mean) / std_dev if std_dev > 0 else 0
    print(f"  {name}: {actual:.1f} (mean: {mean:.1f}, scaled: {scaled:.2f}, sigma: {deviation:.2f})")

print("\n" + "=" * 70)
