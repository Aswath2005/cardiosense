import pandas as pd

df = pd.read_csv('backend/heart.csv')
print('CSV Columns:', df.columns.tolist())
print('\nFirst 5 rows:')
print(df.head())
print('\nData types:')
print(df.dtypes)

# Check a high-risk case from the data
print('\n\n=== Checking high-risk cases ===')
df = df.replace('?', pd.isna)
df = df.dropna()

# Look for high-risk patterns
high_risk = df[(df['age'] > 60) & (df['chol'] > 230) & (df['trestbps'] > 140) & (df['target'] == 1)]
print(f"\nHigh-risk cases with disease (target=1):")
print(high_risk[['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']].head())
