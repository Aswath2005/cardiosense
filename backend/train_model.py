"""
CardioSense AI — Local Model Training Script
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
    
    # Check for missing values
    if df.isnull().sum().any():
        print("⚠️  Warning: Missing values found. Dropping rows with NaN...")
        df = df.dropna()
    
    # Separate features and target
    X = df.drop('target', axis=1)
    y = df['target']
    
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
    # Sample input: age=41, sex=0, cp=1, trestbps=130, chol=204, fbs=0, 
    #              restecg=0, thalach=172, exang=0, oldpeak=1.4, slope=2, ca=0, thal=2
    sample_input = np.array([[41, 0, 1, 130, 204, 0, 0, 172, 0, 1.4, 2, 0, 2]])
    sample_scaled = scaler.transform(sample_input)
    
    prediction = model.predict(sample_scaled)[0]
    probability = model.predict_proba(sample_scaled)[0][1]
    
    print(f"\n🩺 Sample Prediction Test")
    print(f"Input: age=41, sex=0, cp=1, trestbps=130, chol=204, fbs=0, restecg=0")
    print(f"       thalach=172, exang=0, oldpeak=1.4, slope=2, ca=0, thal=2")
    print(f"\nPrediction: {prediction}")
    print(f"Result: {'Heart Disease Detected' if prediction == 1 else 'No Heart Disease'}")
    print(f"Probability: {probability:.4f} ({probability * 100:.2f}%)")


def main():
    """Main training pipeline."""
    print("=" * 60)
    print("CardioSense AI — Model Training")
    print("Team PulseML")
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
