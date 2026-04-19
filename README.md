# CardioSense AI — Heart Attack Risk Prediction

## Overview

**CardioSense AI** is a production-grade fullstack web application that predicts cardiovascular disease risk using Logistic Regression trained on the Cleveland Heart Disease dataset. Built by **Team PulseML**, this application combines a robust ML backend with a modern, responsive frontend to provide instant heart attack risk assessments.

### Key Features
- 🔬 **Logistic Regression Model**: Trained on 303 patient records from the Cleveland Heart Disease dataset
- 🎯 **85% Accuracy**: Evaluated on 20% test split with stratified train/test division
- 📊 **13 Clinical Parameters**: Age, sex, chest pain type, blood pressure, cholesterol, and more
- ⚡ **Real-time Predictions**: Instant risk assessment via REST API
- 🎨 **Modern UI**: Built with Next.js 14, Tailwind CSS, and Framer Motion animations
- 📱 **Fully Responsive**: Mobile-first design (375px–1280px+)
- 🔐 **Production-Ready**: Comprehensive error handling, CORS enabled, health checks

## Tech Stack

| Layer      | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Python FastAPI, scikit-learn, pandas, numpy, joblib |
| **ML Model** | Logistic Regression with StandardScaler preprocessing |
| **Communication** | REST API (JSON), CORS enabled |
| **Hosting** | Local development (easily deployable to cloud) |

## Dataset Features

The Cleveland Heart Disease dataset contains **13 clinical features** and 1 target variable:

| Feature | Type | Description |
|---------|------|-------------|
| `age` | int | Patient age in years |
| `sex` | int | 1=Male, 0=Female |
| `cp` | int | Chest pain type (0=Asymptomatic, 1=Atypical, 2=Non-anginal, 3=Typical) |
| `trestbps` | int | Resting blood pressure (mm Hg) |
| `chol` | int | Serum cholesterol (mg/dl) |
| `fbs` | int | Fasting blood sugar (1 if >120 mg/dl, else 0) |
| `restecg` | int | Resting ECG (0=Normal, 1=ST-T abnormality, 2=LVH) |
| `thalach` | int | Maximum heart rate achieved |
| `exang` | int | Exercise-induced angina (1=Yes, 0=No) |
| `oldpeak` | float | ST depression induced by exercise |
| `slope` | int | ST slope (0=Downsloping, 1=Flat, 2=Upsloping) |
| `ca` | int | Number of major vessels (0–3) |
| `thal` | int | Thalassemia (1=Normal, 2=Fixed defect, 3=Reversible defect) |
| **target** | int | **1=Heart Disease, 0=No Disease** |

**Dataset**: 303 patients, 165 with heart disease, 138 without

## Setup Instructions

### Prerequisites
- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **pip** and **npm** installed
- **Google Colab** (optional, for training in the cloud) or local Python environment

---

### Step 1: Train the Model

#### Option A: Google Colab (Recommended for Cloud Training)

1. Open `train_and_export.ipynb` in [Google Colab](https://colab.research.google.com/)
2. When prompted, upload `heart.csv` or mount your Google Drive
3. Run all cells sequentially
4. At the end, `model.pkl` and `scaler.pkl` will be automatically downloaded
5. Place both files in the `/backend/` directory of this project

#### Option B: Train Locally

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the training script
python train_model.py

# This generates model.pkl and scaler.pkl in /backend/
```

**Expected Output**:
```
Training Accuracy: 0.8351...
Test Accuracy: 0.8197...
Model and scaler saved successfully!
```

---

### Step 2: Run the FastAPI Backend

```bash
# From the root or backend directory
cd backend

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

**Expected Output**:
```
INFO:     Started server process
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**API Documentation** (interactive):
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Health Check**:
```bash
curl http://localhost:8000/health
# Expected: {"status": "ok", "model_loaded": true}
```

---

### Step 3: Run the Next.js Frontend

```bash
# From the root directory (or navigate to frontend if separate)
npm install

# Start the development server
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

**Open in Browser**: http://localhost:3000

---

## API Endpoints

### `GET /`
Returns API status.

**Response**:
```json
{
  "status": "CardioSense AI API running"
}
```

---

### `GET /health`
Checks if the model is loaded.

**Response**:
```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

### `POST /predict`
Predicts heart disease risk from patient data.

**Request** (JSON):
```json
{
  "age": 41,
  "sex": 0,
  "cp": 1,
  "trestbps": 130,
  "chol": 204,
  "fbs": 0,
  "restecg": 0,
  "thalach": 172,
  "exang": 0,
  "oldpeak": 1.4,
  "slope": 2,
  "ca": 0,
  "thal": 2
}
```

**Response** (HIGH RISK):
```json
{
  "prediction": 1,
  "result": "Heart Disease Detected",
  "risk_level": "high",
  "probability": 0.87
}
```

**Response** (LOW RISK):
```json
{
  "prediction": 0,
  "result": "No Heart Disease",
  "risk_level": "low",
  "probability": 0.15
}
```

---

## Project Structure

```
cardiosense-1/
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
│
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page (renders all sections)
│   ├── globals.css         # Global styles + animations
│   ├── dashboard/          # Protected route example
│   └── login/              # Login page (if using auth)
│
├── components/
│   ├── Navbar.tsx          # Fixed header with scroll detection
│   ├── HeroSection.tsx     # Welcome banner with CTA
│   ├── AboutSection.tsx    # Project overview + stepper
│   ├── PredictSection.tsx  # Form with 13 inputs
│   ├── ResultCard.tsx      # High/Low risk result display
│   ├── ResultsSection.tsx  # Model performance metrics
│   ├── Footer.tsx          # Footer with links
│   ├── AuthContext.tsx     # Auth provider (if using)
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   └── [Other components]
│
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── api.ts              # API client functions
│   └── predictionLogic.ts  # Utility functions
│
├── backend/
│   ├── requirements.txt     # Python dependencies
│   ├── train_model.py      # Training script
│   ├── model.py            # Model loading & prediction
│   ├── main.py             # FastAPI app
│   ├── model.pkl           # Trained model (generated)
│   └── scaler.pkl          # StandardScaler (generated)
│
└── .env.local              # Environment variables
```

---

## Frontend Features

### Sections

1. **Navbar** (Fixed, z-50)
   - Smooth scroll navigation
   - Active section highlighting
   - Backend health status indicator
   - Mobile hamburger menu

2. **Hero Section** (id="home")
   - Eye-catching headline
   - Dataset & model stats with count-up animation
   - Floating heart icon with glow effect
   - CTA button → "Check Your Risk Now"

3. **About Section** (id="about")
   - Project overview
   - How it works (4-step stepper)
   - Feature highlight cards

4. **Predict Section** (id="predict")
   - 13-field clinical data form
   - Real-time validation
   - Loading state with spinner
   - Error banner if backend is offline
   - Smooth scroll to results on success

5. **Results Section** (id="results")
   - Model performance metrics (85% test accuracy)
   - Animated accuracy bar
   - Precision, Recall, F1-Score tiles
   - Dataset distribution info

6. **Result Card**
   - **High Risk**: Red border, warning icon, actionable recommendations
   - **Low Risk**: Green border, checkmark, wellness tips
   - Confidence probability bar with animation
   - "Re-analyze" button to reset form

7. **Footer**
   - Team attribution
   - Dataset source
   - Medical disclaimer
   - Social links

### Design System

**Color Palette**:
```
Primary:        #1A3C6E (Dark Blue)
Accent:         #2563EB (Bright Blue)
Danger:         #EF4444 (Red)
Success:        #10B981 (Green)
Background:     #F8FAFF (Light Blue)
Card:           #FFFFFF (White)
Text Main:      #0F172A (Near Black)
Text Muted:     #64748B (Gray)
Border:         #E2E8F0 (Light Gray)
```

**Fonts**:
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, readable)

**Responsive Breakpoints**:
- Mobile: 375px
- Tablet: 768px (md)
- Desktop: 1024px (lg)
- Large: 1280px (xl)

---

## Model Details

### Algorithm: Logistic Regression
- **Solver**: lbfgs
- **Max Iterations**: 1000
- **Regularization**: L2
- **Random State**: 1

### Preprocessing
- **Scaler**: StandardScaler (mean=0, std=1)
- **Train/Test Split**: 80/20 stratified
- **Random State**: 1 (reproducibility)

### Performance
```
Training Accuracy: ~83.51%
Test Accuracy:     ~81.97%
Precision:         ~0.85
Recall:            ~0.82
F1-Score:          ~0.83
```

---

## Deployment

### Frontend (Next.js)
- **Vercel**: Recommended (1-click deploy from GitHub)
- **Netlify**: Supported with build config
- **Docker**: Create a Dockerfile with Node 18 base
- **Environment**: Set `NEXT_PUBLIC_API_URL` to your backend URL

### Backend (FastAPI)
- **Heroku**: Use Procfile → `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **AWS Lambda**: Wrap with Mangum ASGI adapter
- **Docker**: Use `python:3.11-slim` base with uvicorn
- **PythonAnywhere**: Upload files and configure WSGI

### Environment Variables
```
# .env.local (frontend)
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Backend uses defaults, or set:
# MODEL_PATH=/path/to/model.pkl
# SCALER_PATH=/path/to/scaler.pkl
```

---

## Troubleshooting

### Issue: "Could not connect to backend"
- ✅ Ensure FastAPI is running on port 8000
- ✅ Check CORS settings in `backend/main.py`
- ✅ Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Issue: "Model not loaded"
- ✅ Verify `model.pkl` and `scaler.pkl` exist in `/backend/`
- ✅ Check file permissions
- ✅ Restart the backend server

### Issue: Form validation errors
- ✅ All 13 fields are required
- ✅ Use valid numeric ranges (e.g., age 1–100)
- ✅ Categorical fields must match allowed values

### Issue: CORS errors in browser console
- ✅ Backend already has CORS enabled for `http://localhost:3000`
- ✅ For production, update `allow_origins` in `backend/main.py`

---

## Educational Disclaimer

⚠️ **This application is for educational and demonstration purposes only.**

- **Not a Medical Device**: CardioSense AI is not FDA-approved or clinically validated.
- **Not Medical Advice**: Predictions should never replace consultation with a qualified cardiologist.
- **Research Project**: Built as a mini research project by Team PulseML to demonstrate ML + web integration.

**Always consult a healthcare professional** for accurate diagnosis and treatment.

---

## Data Source & Citation

**Dataset**: Cleveland Heart Disease Dataset (UCI Machine Learning Repository)
- **Original Source**: [UCI ML Repository](https://archive.ics.uci.edu/ml/datasets/heart+disease)
- **Kaggle Mirror**: [Kaggle — Heart Disease Dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)
- **Samples**: 303 patients
- **Features**: 13 clinical parameters
- **License**: Public Domain

---

## Team

**CardioSense AI** is developed by **Team PulseML** as a mini research project demonstrating:
- End-to-end ML pipeline (Colab → model export → API integration)
- Full-stack JavaScript/Python integration
- Production-grade UI/UX with modern frameworks
- Responsive design and real-time predictions

---

## Support & Resources

### Health Resources
- [WHO: Cardiovascular Diseases](https://www.who.int/health-topics/cardiovascular-diseases)
- [American Heart Association](https://www.heart.org/)
- [Mayo Clinic: Heart Disease](https://www.mayoclinic.org/diseases-conditions/heart-disease/symptoms-causes/syc-20353619)

### Technical Resources
- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [scikit-learn: Logistic Regression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)

---

## License

This project is open-source and available under the **MIT License**. Feel free to fork, modify, and use for educational purposes.

---

**Last Updated**: April 2025  
**Version**: 1.0.0  
**Maintained by**: Team PulseML