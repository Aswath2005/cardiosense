"""
CardioSense — Local Model Training Script
Trains a Logistic Regression model on the Cleveland Heart Disease dataset
and exports model.pkl and scaler.pkl for the FastAPI backend.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os


def load_and_preprocess_data(csv_path: str = "heart.csv"):
    """
    Load the heart disease dataset and perform preprocessing.
    
    Args:
        csv_path: Path to the heart.csv file
        
    Returns:
        tuple: (X_train_scaled, X_test_scaled, y_train, y_test, scaler)
    """
    # Load dataset
    print(f"📥 Loading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"✅ Dataset loaded! Shape: {df.shape}")
    
    # Replace '?' with NaN
    df = df.replace('?', np.nan)
    
    # Check for missing values
    if df.isnull().sum().any():
        print(f"⚠️  Warning: Missing values found. Dropping rows with NaN...")
        print(f"   Before: {len(df)} rows")
        df = df.dropna()
        print(f"   After: {len(df)} rows")
    
    # Convert all columns to numeric
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    df = df.dropna()  # Drop any remaining NaN from conversion
    
    # Separate features and target
    feature_order = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ]
    X = df[feature_order].copy()  # Explicitly order columns to match prediction order
    y = df['target'].copy()
    
    # Convert target to binary (0 or 1)
    # The UCI dataset has values 0-4, where 0 = no disease, 1-4 = disease
    y = (y > 0).astype(int)
    
    # Normalize feature values to match Kaggle/frontend format
    # CP: Convert from 1-4 to 0-3 range
    if X['cp'].max() > 3:
        print("⚙️  Normalizing cp from 1-4 to 0-3...")
        X['cp'] = X['cp'] - 1
    
    # Slope: Ensure 1-3 range (no 0)
    if X['slope'].min() == 0:
        print("⚙️  Normalizing slope from 0-2 to 1-3...")
        X['slope'] = X['slope'] + 1
    
    # Thal: Map to Kaggle format (3, 6, 7)
    print(f"⚙️  Thal unique values before mapping: {sorted(X['thal'].unique())}")
    if X['thal'].max() <= 3:
        print("⚙️  Normalizing thal from 0-3 to Kaggle format (3, 6, 7)...")
        # UCI format: 0=no thal issue, 1=normal, 2=fixed, 3=reversible
        # Kaggle format: 3=normal, 6=fixed, 7=reversible
        thal_mapping = {0: 3, 1: 3, 2: 6, 3: 7}  # 0 and 1 both -> normal
        X['thal'] = X['thal'].map(thal_mapping)
    print(f"⚙️  Thal unique values after mapping: {sorted(X['thal'].unique())}")
    
    print(f"📊 Features: {X.shape[1]} | Target classes: {y.nunique()}")
    
    # Train/test split (80/20 stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=1
    )
    print(f"✂️  Train/Test split: {len(X_train)} / {len(X_test)}")
    
    # StandardScaler preprocessing
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print(f"⚙️  StandardScaler applied")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


def train_model(X_train_scaled, y_train):
    """
    Train a Logistic Regression model.
    
    Args:
        X_train_scaled: Scaled training features
        y_train: Training target labels
        
    Returns:
        LogisticRegression: Trained model
    """
    print(f"\n🧠 Training Logistic Regression model...")
    model = LogisticRegression(max_iter=1000, random_state=1)
    model.fit(X_train_scaled, y_train)
    print(f"✅ Model trained successfully!")
    
    return model


def evaluate_model(model, X_train_scaled, X_test_scaled, y_train, y_test):
    """
    Evaluate the trained model on train and test sets.
    
    Args:
        model: Trained model
        X_train_scaled: Scaled training features
        X_test_scaled: Scaled test features
        y_train: Training target labels
        y_test: Test target labels
    """
    # Predictions
    y_train_pred = model.predict(X_train_scaled)
    y_test_pred = model.predict(X_test_scaled)
    
    # Accuracy
    train_accuracy = accuracy_score(y_train, y_train_pred)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    
    print(f"\n📊 Model Evaluation")
    print(f"Training Accuracy: {train_accuracy:.4f} ({train_accuracy * 100:.2f}%)")
    print(f"Test Accuracy:     {test_accuracy:.4f} ({test_accuracy * 100:.2f}%)")
    
    # Classification report
    print(f"\n📋 Classification Report (Test Set)")
    print(classification_report(y_test, y_test_pred, 
                              target_names=['No Disease', 'Heart Disease']))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_test_pred)
    print(f"\n🔍 Confusion Matrix (Test Set)")
    print(f"                  Predicted")
    print(f"                No Dis  Dis")
    print(f"Actual No Dis    {cm[0,0]:3d}   {cm[0,1]:3d}")
    print(f"       Dis       {cm[1,0]:3d}   {cm[1,1]:3d}")


def export_model(model, scaler, output_dir: str = "."):
    """
    Export model and scaler using joblib.
    
    Args:
        model: Trained model
        scaler: StandardScaler instance
        output_dir: Directory to save files
    """
    model_path = os.path.join(output_dir, "model.pkl")
    scaler_path = os.path.join(output_dir, "scaler.pkl")
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"\n✅ Model exported successfully!")
    print(f"📦 Files created:")
    print(f"  - {model_path}")
    print(f"  - {scaler_path}")


def test_sample_prediction(model, scaler):
    """
    Test the model with a sample patient input.
    
    Args:
        model: Trained model
        scaler: StandardScaler instance
    """
    # Sample input (Kaggle format): age=41, sex=0, cp=1, trestbps=130, chol=204, 
    #                               fbs=0, restecg=0, thalach=172, exang=0, oldpeak=1.4, 
    #                               slope=2, ca=0, thal=3
    sample_input = np.array([[41, 0, 1, 130, 204, 0, 0, 172, 0, 1.4, 2, 0, 3]])
    sample_scaled = scaler.transform(sample_input)
    
    prediction = model.predict(sample_scaled)[0]
    probability = model.predict_proba(sample_scaled)[0][1]
    
    print(f"\n🩺 Sample Prediction Test")
    print(f"Input: age=41, sex=0, cp=1, trestbps=130, chol=204, fbs=0, restecg=0")
    print(f"       thalach=172, exang=0, oldpeak=1.4, slope=2, ca=0, thal=3")
    print(f"\nPrediction: {prediction}")
    print(f"Result: {'Heart Disease Detected' if prediction == 1 else 'No Heart Disease'}")
    print(f"Probability: {probability:.4f} ({probability * 100:.2f}%)")


def main():
    """Main training pipeline."""
    print("=" * 60)
    print("CardioSense — Model Training")
    print("=" * 60)
    
    # Load and preprocess
    X_train_scaled, X_test_scaled, y_train, y_test, scaler = load_and_preprocess_data()
    
    # Train model
    model = train_model(X_train_scaled, y_train)
    
    # Evaluate
    evaluate_model(model, X_train_scaled, X_test_scaled, y_train, y_test)
    
    # Test sample
    test_sample_prediction(model, scaler)
    
    # Export
    export_model(model, scaler)
    
    print("\n" + "=" * 60)
    print("✅ Training pipeline complete!")
    print("=" * 60)
    print("\n📝 Next steps:")
    print("1. Ensure model.pkl and scaler.pkl are in /backend/")
    print("2. Run: uvicorn main:app --reload --port 8000")
    print("3. Visit: http://localhost:3000")


if __name__ == "__main__":
    main()
