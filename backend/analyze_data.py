import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Load and preprocess
df = pd.read_csv('backend/heart.csv')
df = df.replace('?', np.nan).dropna()

# Convert to numeric
for col in df.columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')
df = df.dropna()

# Normalize cp
if df['cp'].max() > 3:
    df['cp'] = df['cp'] - 1

# Get disease cases
disease_cases = df[df['target'] > 0]

print("=== HIGH RISK CASES WITH DISEASE ===\n")
print(f"Total cases with disease: {len(disease_cases)}\n")

# Find cases similar to the test case
test_case = {'age': 63, 'sex': 1, 'cp': 0, 'trestbps': 145, 'chol': 233, 'fbs': 1, 'restecg': 2, 'thalach': 148, 'exang': 0, 'oldpeak': 2.1, 'slope': 3, 'ca': 0, 'thal': 6}

print("Test case (user input):")
for k, v in test_case.items():
    print(f"  {k}: {v}")

print("\n\nSimilar disease cases in training data (age 55-70, high BP/chol):")
similar = disease_cases[(disease_cases['age'] >= 55) & (disease_cases['age'] <= 70) & 
                       (disease_cases['chol'] >= 200) & (disease_cases['trestbps'] >= 120)]
if len(similar) > 0:
    print(similar[['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']].head(10))
else:
    print("  No similar cases found!")

print("\n\nStats for disease cases:")
print(disease_cases[['age', 'chol', 'trestbps', 'oldpeak', 'thalach']].describe())

print("\n\nStats for no-disease cases:")
no_disease = df[df['target'] == 0]
print(no_disease[['age', 'chol', 'trestbps', 'oldpeak', 'thalach']].describe())
