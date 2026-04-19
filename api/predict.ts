import { VercelRequest, VercelResponse } from '@vercel/node';
import joblib from 'joblib'; // or use python-joblib
import numpy as np;

let model: any;
let scaler: any;

export default async (req: VercelRequest, res: VercelResponse) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const {
        age, sex, cp, trestbps, chol, fbs, restecg, 
        thalach, exang, oldpeak, slope, ca, thal
      } = req.body;

      // Load model (cache it)
      if (!model) {
        model = joblib.load('./model.pkl');
        scaler = joblib.load('./scaler.pkl');
      }

      // Scale and predict
      const inputArray = np.array([[
        age, sex, cp, trestbps, chol, fbs, restecg,
        thalach, exang, oldpeak, slope, ca, thal
      ]]);
      
      const scaled = scaler.transform(inputArray);
      const prediction = model.predict(scaled)[0];
      const probability = model.predict_proba(scaled)[0][1];

      return res.status(200).json({
        prediction,
        result: prediction === 1 ? 'Heart Disease Detected' : 'No Heart Disease',
        risk_level: prediction === 1 ? 'high' : 'low',
        probability: Math.round(probability * 100) / 100
      });
    } catch (error) {
      return res.status(500).json({ error: 'Prediction failed' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
};
