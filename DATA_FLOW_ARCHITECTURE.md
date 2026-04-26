# CardioSense Data Flow & Architecture Overview

## Executive Summary

CardioSense is a full-stack heart disease risk prediction application with three main layers:
- **Frontend**: Next.js (React) with TypeScript - handles UI, authentication, and data submission
- **Backend**: FastAPI (Python) - performs ML predictions using a Keras neural network
- **Database**: Supabase (PostgreSQL) - stores user predictions with Row Level Security (RLS)

---

## 1. Database Layer (Supabase)

### Database Connection Configuration
- **Type**: PostgreSQL (Supabase managed)
- **Client**: `@supabase/supabase-js`
- **Initialization File**: [lib/supabase.ts](lib/supabase.ts)

**Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema: `predictions` Table

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | uuid | PRIMARY KEY | Unique prediction record ID |
| `user_id` | uuid | REFERENCES auth.users(id) ON DELETE CASCADE | Links prediction to authenticated user |
| `age` | integer | NOT NULL | Patient age in years (18-120) |
| `sex` | integer | NOT NULL | 0=Female, 1=Male |
| `cp` | integer | NOT NULL | Chest pain type (0-3) |
| `trestbps` | integer | NOT NULL | Resting blood pressure (mmHg) |
| `chol` | integer | NOT NULL | Serum cholesterol (mg/dl) |
| `fbs` | integer | NOT NULL | Fasting blood sugar > 120 (0 or 1) |
| `restecg` | integer | NOT NULL | Resting ECG result (0-2) |
| `thalach` | integer | NOT NULL | Maximum heart rate achieved |
| `exang` | integer | NOT NULL | Exercise-induced angina (0 or 1) |
| `oldpeak` | float | NOT NULL | ST depression |
| `slope` | integer | NOT NULL | ST slope (1-3) |
| `ca` | integer | NOT NULL | Major vessels count (0-3) |
| `thal` | integer | NOT NULL | Thalassemia type (3, 6, or 7) |
| `risk_level` | text | CHECK IN ('high','low') | Prediction outcome |
| `probability` | float | NOT NULL | Confidence score (0-1) |
| `created_at` | timestamptz | DEFAULT now() | Timestamp of prediction |

### Row Level Security (RLS) Policies

```sql
-- Users can only view their own predictions
CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own predictions
CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Impact**: Each user can only see/save their own prediction history. Even with database access, users cannot view other users' data.

### Database Functions in Code

**File**: [lib/supabase.ts](lib/supabase.ts)

#### `savePrediction(userId, formData, result)`
- **Called by**: [components/PredictSection.tsx](components/PredictSection.tsx#L227)
- **When**: After successful ML prediction and user is authenticated
- **Action**: Inserts new row into `predictions` table
- **Graceful Degradation**: If Supabase is unavailable (network error), silently logs warning but doesn't block the prediction result display

```typescript
// Usage example
const { error } = await savePrediction(userId, patientData, predictionResult);
if (error) {
  console.error('Failed to save:', error);
} else {
  console.log('✅ Prediction saved to database');
}
```

#### `getPredictions(userId)`
- **Called by**: [app/dashboard/page.tsx](app/dashboard/page.tsx#L48)
- **When**: User loads dashboard page
- **Action**: Retrieves all predictions for the user, sorted by most recent first
- **Returns**: Array of `PredictionRecord` objects or error

```typescript
// Usage example
const { data: predictions, error } = await getPredictions(userId);
```

---

## 2. Authentication Layer

### Current Implementation Status

#### Primary (Production Ready): Supabase OAuth
- **Providers**: Google, GitHub
- **Implementation**: [app/api/auth/oauth/route.ts](app/api/auth/oauth/route.ts)
- **Flow**:
  1. User clicks "Sign in with Google/GitHub" on [app/login/page.tsx](app/login/page.tsx)
  2. Frontend sends provider to OAuth endpoint
  3. Supabase returns authorization URL
  4. User redirected to OAuth provider (Google/GitHub)
  5. After approval, user redirected to [app/auth/callback/page.tsx](app/auth/callback/page.tsx)
  6. Callback page retrieves session and redirects to dashboard

**Session Management**: Supabase automatically handles session persistence via:
```typescript
const supabase = createClient(url, anonKey, {
  persistSession: true,
  auth: { persistSession: true }
})
```

#### Fallback (Development): Mock Auth
- **Implementation**: [lib/mockAuth.ts](lib/mockAuth.ts)
- **Storage**: localStorage with `mock_auth_user` and `mock_auth_users` keys
- **Use Case**: When Supabase is unreachable (network/firewall issues)
- **Limitations**: 
  - Data NOT persisted to Supabase database
  - Predictions NOT saved (intentional)
  - Credentials stored in localStorage (insecure, dev-only)

**Hook**: `useMockAuth()`
```typescript
const mockAuth = useMockAuth();
if (mockAuth.user) {
  // User logged in via mock auth
  userId = mockAuth.user.id; // Mock ID like "mock_1234567890"
}
```

### User ID Retrieval Strategy

**File**: [components/PredictSection.tsx](components/PredictSection.tsx#L64-L85)

```typescript
// Check mock auth first (faster, local)
if (mockAuth.user) {
  setUser({ id: mockAuth.user.id });
  return;
}

// Fall back to Supabase session
const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  setUser({ id: session.user.id });
}
```

**Result**: 
- With real auth: `userId = "550e8400-e29b-41d4-a716-446655440000"` (UUID)
- With mock auth: `userId = "mock_1712345678000"` (timestamp-based)

### Protected Routes

**File**: [components/AuthGuard.tsx](components/AuthGuard.tsx)
- Wraps dashboard and other protected pages
- Redirects unauthenticated users to login

---

## 3. Frontend Data Submission Flow

### Form Submission Path

```
User fills form (PredictSection)
    ↓
Validates 13 medical fields
    ↓
Submits to FastAPI backend (/predict)
    ↓
Receives prediction result
    ↓
If authenticated: Saves to Supabase
    ↓
Displays risk result (ResultCard)
```

### Detailed Walkthrough

**File**: [components/PredictSection.tsx](components/PredictSection.tsx)

#### Step 1: Form Validation
- 13 required fields: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
- Type checking: numeric fields validated against min/max ranges
- Enum fields: limited to specific values (e.g., sex: 0-1, cp: 0-3)

#### Step 2: API Prediction Call
```typescript
const numericData: PatientData = {
  age: parseFloat(formData.age),
  sex: parseFloat(formData.sex),
  // ... all 13 fields
};

const data = await predictHeartRisk(numericData); // Calls FastAPI
```

**Endpoint**: `POST http://localhost:8000/predict` (or production URL)

#### Step 3: Database Save (if authenticated)
```typescript
if (user?.id) {
  const { error } = await savePrediction(user.id, numericData, data);
  // Error handling: logs silently, doesn't block UI
}
```

#### Step 4: Result Display
- Shows risk level: "HIGH RISK" or "LOW RISK"
- Shows probability percentage
- Provides "Reanalyze" button to run another prediction

### Form Field Configuration

**Source**: [components/PredictSection.tsx](components/PredictSection.tsx#L98-L140)

All 13 fields with labels, types, and validation rules:

| Field | Label | Type | Range | Options |
|-------|-------|------|-------|---------|
| age | Age | number | 18-120 | Input box |
| sex | Sex | select | 0-1 | Female (0), Male (1) |
| cp | Chest Pain Type | select | 0-3 | Asymptomatic, Atypical, Non-anginal, Typical |
| trestbps | Resting BP (mmHg) | number | 80-200 | Input box |
| chol | Cholesterol (mg/dl) | number | 100-400 | Input box |
| fbs | Fasting Blood Sugar > 120 | select | 0-1 | No (0), Yes (1) |
| restecg | Resting ECG | select | 0-2 | Normal, ST Abnormality, LV Hypertrophy |
| thalach | Max Heart Rate | number | 60-220 | Input box |
| exang | Exercise-Induced Angina | select | 0-1 | No (0), Yes (1) |
| oldpeak | ST Depression | number | 0-10 (0.1 step) | Input box |
| slope | ST Slope | select | 1-3 | Upsloping, Flat, Downsloping |
| ca | Major Vessels Count | select | 0-3 | 0, 1, 2, 3 |
| thal | Thalassemia | select | 3,6,7 | Normal, Fixed Defect, Reversible Defect |

---

## 4. Backend ML Prediction Layer

### FastAPI Server

**File**: [backend/main.py](backend/main.py)

**Endpoints**:

#### `GET /` - Health Check
```python
Returns: {"status": "CardioSense API running"}
```

#### `GET /health` - Model Status
```python
Returns: {
  "status": "ok",
  "model_loaded": true/false
}
```

#### `POST /predict` - Prediction Endpoint
**Request**: PatientData (13 fields)
**Response**: 
```json
{
  "prediction": 0,              // 0=no disease, 1=disease present
  "result": "No disease risk",  
  "risk_level": "low",
  "probability": 0.15
}
```

**Request Validation**: Pydantic schema enforces:
- age: 1-150
- sex: 0 or 1
- cp: 0-3
- trestbps: integer
- chol: integer
- fbs: 0 or 1
- restecg: 0-2
- thalach: integer
- exang: 0 or 1
- oldpeak: float
- slope: 1-3
- ca: 0-3
- thal: 3, 6, or 7

**Invalid requests return**: HTTP 422 with validation errors

### Model Loading

**File**: [backend/model.py](backend/model.py)

- **Model Type**: Keras Neural Network
- **File**: `heart_disease_model.keras`
- **Scaler**: StandardScaler (for feature normalization) - `scaler.pkl`
- **Loading Strategy**: Global `ModelLoader` instance created on server startup
- **Status Check**: `model_loader.is_loaded()` prevents predictions if model fails to load

**Error Handling**:
- If model file missing → HTTP 500 with helpful error message
- If scaler unavailable → prediction fails with clear feedback

### Prediction Logic

**File**: [backend/model.py](backend/model.py)

1. Load trained Keras model
2. Normalize input features using fitted StandardScaler
3. Run neural network inference
4. Convert raw output to risk classification:
   - Probability ≥ 0.5 → "high" risk
   - Probability < 0.5 → "low" risk
5. Return result with probability percentage

**Output**:
- `prediction`: 0 or 1 (raw model output)
- `probability`: float 0-1 (confidence)
- `risk_level`: "high" or "low" (human-readable)
- `result`: descriptive text

---

## 5. Data Flow Diagram

### Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User fills prediction form (13 fields)                  │
│     ↓                                                         │
│  2. validateForm() - Check all fields present & valid        │
│     ↓                                                         │
│  3. POST /predict (FastAPI backend)                          │
│     ↓                                                         │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI/Python)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Validate request (Pydantic schema)                       │
│     ↓                                                         │
│  2. Check if model is loaded                                 │
│     ↓                                                         │
│  3. Normalize features (StandardScaler)                      │
│     ↓                                                         │
│  4. Run Keras neural network inference                       │
│     ↓                                                         │
│  5. Convert to risk classification (high/low)                │
│     ↓                                                         │
│  6. Return PredictionResponse                                │
│     └─→ {"prediction": 0/1, "risk_level": "low"/"high",    │
│           "probability": 0.15, ...}                         │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Back at Client)                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Receive prediction result                                │
│     ↓                                                         │
│  2. Display ResultCard with risk level & probability         │
│     ↓                                                         │
│  3. If user is authenticated:                                │
│     ├─ POST to Supabase                                      │
│     ├─ Save {user_id, 13_features, risk_level,             │
│     │  probability, created_at}                             │
│     └─ Log success/error silently (don't block UI)           │
│     ↓                                                         │
│  4. Display "Sign in to save" prompt (if not authenticated)  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (Supabase/PostgreSQL)              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Insert new row into `predictions` table                  │
│     ↓                                                         │
│  2. Row Level Security policy enforced:                      │
│     - Only authenticated user_id matches auth.uid()          │
│     ↓                                                         │
│  3. Timestamp auto-generated (created_at)                    │
│     ↓                                                         │
│  4. Record persisted and available for future queries        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Retrieval Flow (Dashboard)

```
┌──────────────────────────────────────┐
│  User navigates to /dashboard        │
│  ↓                                    │
│  checkAuth() verifies session        │
│  ↓                                    │
│  getPredictions(userId)              │
│  ├─→ SELECT * FROM predictions       │
│  ├─→ WHERE user_id = current_user    │
│  └─→ ORDER BY created_at DESC        │
│  ↓                                    │
│  Render prediction history table     │
│  ├─ Risk level badge (HIGH/LOW)      │
│  ├─ Prediction date/time             │
│  ├─ All 13 medical parameters        │
│  └─ Probability percentage           │
│  ↓                                    │
│  Filter by risk level (optional)     │
│  Paginate results (10 per page)      │
└──────────────────────────────────────┘
```

---

## 6. Data Types & Interfaces

### TypeScript Type Definitions

**File**: [lib/types.ts](lib/types.ts)

```typescript
interface PatientData {
  age: number;
  sex: number;           // 0 or 1
  cp: number;            // 0-3
  trestbps: number;
  chol: number;
  fbs: number;           // 0 or 1
  restecg: number;       // 0-2
  thalach: number;
  exang: number;         // 0 or 1
  oldpeak: number;
  slope: number;         // 1-3
  ca: number;            // 0-3
  thal: number;          // 3, 6, or 7
}

interface PredictionResult {
  prediction: 0 | 1;
  result: string;
  risk_level: 'high' | 'low';
  probability: number;
}
```

**File**: [lib/database.types.ts](lib/database.types.ts)

```typescript
interface PredictionRecord {
  id: string;            // UUID
  user_id: string;       // UUID of authenticated user
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
  risk_level: 'high' | 'low';
  probability: number;
  created_at: string;    // ISO timestamp
}

interface AuthUser {
  id: string;
  email: string | undefined;
}
```

---

## 7. CORS & Cross-Origin Configuration

**File**: [backend/main.py](backend/main.py) - Lines 18-26

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Local development
        "http://localhost:3002",      # Alternate dev port
        "https://*"                   # All HTTPS in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Purpose**: Allows frontend (different origin) to make requests to backend API.

**For Production**: Replace `https://*` with specific domain:
```python
"https://cardiosense.vercel.app",
"https://yourdomain.com"
```

---

## 8. Error Handling & Graceful Degradation

### Scenario 1: Backend Unavailable
- **Where it happens**: During `predictHeartRisk()` call
- **User impact**: Sees error message "Failed to connect to backend API"
- **Fix**: Ensure FastAPI server is running on port 8000

### Scenario 2: Supabase Unavailable (During Save)
- **Where it happens**: After successful prediction, during `savePrediction()`
- **User impact**: ZERO - prediction result still displays
- **Code behavior**: Logs warning, returns `{error: null}` to not block UI
- **File**: [lib/supabase.ts](lib/supabase.ts) - Lines 55-60 (catch block)

```typescript
catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error'
  console.warn('⚠️  Supabase unavailable:', errorMessage)
  console.log('✅ Prediction computed locally (database save skipped)')
  return { error: null } // Don't block prediction UI
}
```

### Scenario 3: Model Not Loaded
- **Where it happens**: Backend startup or prediction request
- **User impact**: HTTP 500 error from FastAPI
- **Cause**: Missing `heart_disease_model.keras` or `scaler.pkl`
- **Check**: Visit `http://localhost:8000/health` in browser

### Scenario 4: User Not Authenticated
- **Where it happens**: Prediction completes, tries to save
- **User impact**: Prediction displays, no save attempted
- **UI response**: Shows "Sign in to save" banner
- **File**: [components/PredictSection.tsx](components/PredictSection.tsx#L225-L238)

---

## 9. Environment & Configuration Files

### Frontend Configuration

**File**: `.env.local` (Must exist before running)
```env
# Required for Supabase integration
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Optional: Override API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**File**: [next.config.ts](next.config.ts)
- Webpack configuration
- Image optimization settings

**File**: [middleware.ts](middleware.ts)
- Next.js middleware for authentication

### Backend Configuration

**File**: [backend/requirements.txt](backend/requirements.txt)
- FastAPI, Pydantic, TensorFlow/Keras, scikit-learn, etc.

**File**: [backend/main.py](backend/main.py) - Environment variables used:
```python
model_path=os.getenv("MODEL_PATH", "heart_disease_model.keras")
scaler_path=os.getenv("SCALER_PATH", "scaler.pkl")
```

---

## 10. Feature Descriptions (Medical Context)

### Input Features Explained

1. **Age** (18-120): Patient age in years
2. **Sex** (0=Female, 1=Male): Biological sex
3. **CP** (Chest Pain Type): 
   - 0 = Asymptomatic
   - 1 = Atypical Angina
   - 2 = Non-anginal Pain  
   - 3 = Typical Angina
4. **Trestbps** (Resting Blood Pressure): mmHg, normal range 80-200
5. **Chol** (Serum Cholesterol): mg/dL, typical 100-400
6. **FBS** (Fasting Blood Sugar > 120): Binary (0=No, 1=Yes)
7. **Restecg** (Resting Electrocardiogram):
   - 0 = Normal
   - 1 = ST Abnormality
   - 2 = LV Hypertrophy
8. **Thalach** (Max Heart Rate Achieved): 60-220 bpm
9. **Exang** (Exercise-Induced Angina): Binary (0=No, 1=Yes)
10. **Oldpeak** (ST Depression): 0-10 units, decimal allowed
11. **Slope** (ST Segment Slope):
    - 1 = Upsloping
    - 2 = Flat
    - 3 = Downsloping
12. **Ca** (Number of Major Vessels): 0-3 (colored by fluoroscopy)
13. **Thal** (Thalassemia):
    - 3 = Normal
    - 6 = Fixed Defect
    - 7 = Reversible Defect

---

## 11. Training Data & Model Information

**File**: [backend/heart.csv](backend/heart.csv)
- Cleveland Heart Disease dataset
- 303 patient records (historical)
- Used to train the Keras model

**Model File**: [backend/heart_disease_model.keras](backend/heart_disease_model.keras)
- Keras neural network format
- Trained on heart.csv data
- Accepts 13 features, outputs binary classification (0 or 1)

**Training Code**: [backend/train_model.py](backend/train_model.py)
- Can retrain model with new data
- Exports as .keras format

---

## 12. Security Considerations

### Row Level Security (Database)
✅ **Enabled**: Users cannot query other users' data via SQL
- Enforced at database level (not application level)
- Even with stolen credentials, data is protected

### Authentication
- ✅ OAuth (Google/GitHub) - industry standard
- ⚠️ Mock auth only for development (credentials in localStorage)

### API Keys
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Public, intentional for browser
  - Limited to Supabase RLS policies
  - Cannot write to other users' records
  - No direct database access from frontend
  - Safe to expose in frontend code

- **NEXT_PUBLIC_SUPABASE_URL**: Public, needed for client connection

### Data in Transit
- HTTPS enforced in production
- Supabase uses HTTPS by default

### Sensitive Data
- ✅ Passwords: NOT stored in app (OAuth handles auth)
- ✅ API keys: Kept in .env.local (not committed to git)
- ⚠️ Medical data: Stored in Supabase with RLS (users can see their own data)

---

## 13. Testing & Debugging

### Health Check
```bash
curl http://localhost:8000/health
# Response: {"status":"ok","model_loaded":true}
```

### Manual Prediction Test
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 45,
    "sex": 1,
    "cp": 1,
    "trestbps": 120,
    "chol": 200,
    "fbs": 0,
    "restecg": 0,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 0.5,
    "slope": 1,
    "ca": 0,
    "thal": 3
  }'
```

### Browser Console Debugging
```javascript
// Check Supabase connection
console.log('✅ Supabase initialized:', supabaseUrl);

// Check auth status
const { data: { session } } = await supabase.auth.getSession();
console.log('Current user:', session?.user.email);

// Check predictions for user
const { data: predictions } = await getPredictions(userId);
console.log('Predictions:', predictions);
```

### Backend Logs
Look for these in FastAPI console:
```
📥 Prediction Request:
   age: 45
   sex: 1
   ...
✅ Prediction Result:
   prediction (0=no, 1=yes): 1
   probability of disease: 75.50%
   risk_level: high
```

---

## 14. Deployment Considerations

### Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to repo
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically on push

### Backend (Any Python Host)
1. Install dependencies: `pip install -r requirements.txt`
2. Ensure model files exist: `heart_disease_model.keras`, `scaler.pkl`
3. Run: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`
4. Update frontend API URL in `.env.local` or CORS configuration

### Database (Supabase)
- Already managed (serverless)
- No deployment needed
- Automatic backups enabled
- SSL/TLS configured

---

## 15. API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/` | GET | No | API status check |
| `/health` | GET | No | Model health check |
| `/predict` | POST | No | Heart risk prediction |
| `/auth/oauth` | POST | No | Initiate OAuth sign-in |
| `/auth/callback` | GET | Yes | OAuth callback handler |
| (Supabase) `predictions` | INSERT | Yes (RLS) | Save prediction to DB |
| (Supabase) `predictions` | SELECT | Yes (RLS) | Retrieve user predictions |

---

## 16. Future Enhancement Opportunities

### Database Enhancements
- [ ] Add indexes on `user_id` and `created_at` for faster queries
- [ ] Implement soft deletes (is_deleted flag) for audit trail
- [ ] Add `updated_at` timestamp for modification tracking
- [ ] Store prediction confidence intervals (not just point probability)

### API Enhancements
- [ ] Batch prediction endpoint (multiple patients at once)
- [ ] Export predictions as PDF/CSV
- [ ] Webhook integration for prediction alerts (high risk)

### ML Enhancements
- [ ] Model versioning (track which model version made each prediction)
- [ ] A/B testing multiple models
- [ ] Periodic retraining on new data
- [ ] Explainability (SHAP/LIME) for predictions

### Security Enhancements
- [ ] Rate limiting on `/predict` endpoint
- [ ] Request validation (backend IP whitelist)
- [ ] Audit logging (who accessed which predictions, when)
- [ ] Encryption at rest (if needed for compliance)

---

## 17. Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| "Missing Supabase environment variables" | Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` |
| Backend returns 500 on predict | Run `curl http://localhost:8000/health` - check `model_loaded` status |
| Predictions not saving to DB | Check auth status with `supabase.auth.getSession()` in browser console |
| "Model not loaded" error | Ensure `heart_disease_model.keras` and `scaler.pkl` exist in backend/ directory |
| CORS errors from frontend | Backend CORS middleware should include frontend origin |
| Dashboard shows no predictions | User must be authenticated with Supabase OAuth (mock auth doesn't persist to DB) |

---

## Summary

**CardioSense** implements a complete machine learning prediction pipeline:

1. **User** fills medical form in Next.js frontend
2. **Form** validated client-side (13 required fields)
3. **Request** sent to FastAPI backend (`/predict` endpoint)
4. **Model** performs Keras neural network inference
5. **Result** returned with risk classification and probability
6. **Frontend** displays prediction immediately (no wait for DB)
7. **If authenticated**: Prediction saved to Supabase (with user_id)
8. **Database**: Row Level Security ensures users see only their data
9. **Dashboard**: Users can view complete prediction history with filtering

The architecture prioritizes user experience (instant feedback) while maintaining data persistence and security.
