import urllib.request
import os

# Cleveland Heart Disease dataset from UCI
url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data'

try:
    print("Downloading Cleveland Heart Disease dataset...")
    urllib.request.urlretrieve(url, 'backend/heart_raw.data')
    print("✅ Dataset downloaded!")
    
    # Read the raw data and convert to CSV with headers
    df_data = []
    with open('backend/heart_raw.data', 'r') as f:
        for line in f:
            line = line.strip()
            if line:
                df_data.append(line)
    
    # Save as CSV with proper headers
    headers = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']
    
    with open('backend/heart.csv', 'w') as f:
        f.write(','.join(headers) + '\n')
        for line in df_data:
            f.write(line + '\n')
    
    print("✅ heart.csv created successfully!")
    os.remove('backend/heart_raw.data')
    
except Exception as e:
    print(f"❌ Error: {e}")
