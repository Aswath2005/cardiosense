import pandas as pd
import numpy as np

df = pd.read_csv('backend/heart.csv')
df = df.replace('?', np.nan).dropna()

print("=== UNIQUE VALUES IN DATASET ===\n")
for col in ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']:
    unique_vals = sorted(df[col].unique())
    print(f"{col:12} -> {unique_vals}")

print("\n\n=== Sample high-risk cases ===")
high_risk = df[(df['age'] > 60) & (df['chol'] > 220) & (df['target'] > 0)]
print(high_risk[['age', 'sex', 'cp', 'chol', 'trestbps', 'oldpeak', 'target']].head(10))
