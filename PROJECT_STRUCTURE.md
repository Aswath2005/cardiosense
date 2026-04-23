# CardioSense Project Structure

## Overview
The CardioSense project is organized into three main sections: Frontend (Next.js), Backend (FastAPI), and Notebooks (ML training).

## Directory Structure

```
cardiosense/
│
├── frontend/                    ← Next.js Application
│   ├── app/
│   │   ├── layout.tsx           ← Root layout with fonts and providers
│   │   ├── page.tsx             ← Home page (renders all sections)
│   │   ├── globals.css          ← Global styles and animations
│   │   ├── login/
│   │   │   └── page.tsx         ← Login page with authentication
│   │   ├── signup/
│   │   │   └── page.tsx         ← Signup page with registration
│   │   └── dashboard/
│   │       └── page.tsx         ← Prediction history dashboard
│   │
│   ├── components/
│   │   ├── Navbar.tsx           ← Fixed header with navigation
│   │   ├── HeroSection.tsx      ← Welcome banner
│   │   ├── AboutSection.tsx     ← Project overview
│   │   ├── PredictSection.tsx   ← Prediction form with 13 inputs
│   │   ├── ResultCard.tsx       ← Risk result display
│   │   ├── ResultsSection.tsx   ← Model metrics
│   │   ├── Footer.tsx           ← Footer with links
│   │   ├── AuthContext.tsx      ← Auth provider
│   │   ├── AuthGuard.tsx        ← Auth wrapper
│   │   └── ProtectedRoute.tsx   ← Route protection
│   │
│   ├── lib/
│   │   ├── types.ts             ← TypeScript interfaces
│   │   ├── api.ts               ← API client functions
│   │   ├── supabase.ts          ← Supabase client
│   │   ├── database.types.ts    ← Database interfaces
│   │   └── mockAuth.ts          ← Mock auth for development
│   │
│   ├── package.json             ← Frontend dependencies
│   ├── tsconfig.json            ← TypeScript config
│   ├── next.config.ts           ← Next.js config
│   ├── tailwind.config.ts       ← Tailwind CSS config
│   ├── postcss.config.js        ← PostCSS config
│   ├── middleware.ts            ← Next.js middleware
│   ├── vercel.json              ← Vercel deployment config
│   ├── .env.local               ← Environment variables
│   └── next-env.d.ts            ← Next.js type definitions
│
├── backend/                     ← FastAPI Python Backend
│   ├── main.py                  ← FastAPI application
│   ├── model.py                 ← Model loading and prediction
│   ├── train_model.py           ← Training script
│   │
│   ├── heart.csv                ← Cleveland Heart Disease dataset
│   ├── heart_disease_model.keras ← Trained Keras model
│   ├── model.pkl                ← Serialized model (after training)
│   ├── scaler.pkl               ← StandardScaler (after training)
│   │
│   ├── requirements.txt         ← Python dependencies
│   ├── test_prediction.py       ← Quick test script
│   ├── final_verification.py    ← Verification tests
│   ├── analyze_data.py          ← Data analysis utilities
│   ├── inspect_model.py         ← Model inspection
│   └── download_dataset.py      ← Dataset download script
│
├── notebook/                    ← Jupyter Notebooks
│   ├── train_and_export.ipynb   ← Model training notebook
│   └── Heart_Attack_prediction.ipynb ← (Optional: your original notebook)
│
├── README.md                    ← Project documentation
├── SUPABASE_SETUP.md            ← Database setup guide
├── PROJECT_STRUCTURE.md         ← This file
│
├── .gitignore                   ← Git ignore rules
├── package.json                 ← Root dependencies (if shared)
└── package-lock.json            ← Dependency lock file
```

## Key Files by Purpose

### Frontend Configuration
- `frontend/tsconfig.json` - TypeScript compiler options with path aliases (`@/*`)
- `frontend/tailwind.config.ts` - Tailwind CSS theme and plugins
- `frontend/next.config.ts` - Next.js build and runtime configuration
- `frontend/vercel.json` - Vercel deployment settings

### Backend Configuration
- `backend/requirements.txt` - Python package dependencies
- `backend/main.py` - FastAPI server and routes

### Environment & Secrets
- `frontend/.env.local` - Frontend environment variables (API URL)
- Root `.gitignore` - Git ignore rules for entire project

## Running the Application

### Frontend
```bash
cd frontend
npm install
npm run dev          # Development: http://localhost:3000
npm run build        # Production build
npm start            # Production server
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python train_model.py           # Train the model (generates .pkl files)
python -m uvicorn main:app --reload --port 8000
```

### Notebooks
```bash
cd notebook
jupyter notebook train_and_export.ipynb
```

## Path Aliases

### Frontend
The frontend uses TypeScript path aliases defined in `frontend/tsconfig.json`:
- `@/components/*` → `frontend/components/*`
- `@/lib/*` → `frontend/lib/*`
- `@/app/*` → `frontend/app/*`

This allows clean imports like:
```typescript
import { Navbar } from '@/components/Navbar'
import { api } from '@/lib/api'
```

## Deployment

### Frontend
- **Vercel** (Recommended): Connected to GitHub, automatic deployments
- **Netlify**: Manual or connected deployments
- **Docker**: Build with `npm run build` then serve with Node

### Backend
- **Heroku**: Use Procfile with Gunicorn
- **Railway**: GitHub integration
- **AWS Lambda**: Wrap with Mangum ASGI adapter
- **Docker**: Use Python 3.11 slim base image

## File Organization Best Practices

1. **App Routes**: New pages go in `frontend/app/[route]/page.tsx`
2. **Reusable Components**: Put in `frontend/components/`
3. **Utilities**: Put in `frontend/lib/`
4. **Styles**: Use Tailwind CSS inline or in `globals.css`
5. **Backend Routes**: Add endpoints to `backend/main.py`
6. **Python Scripts**: Add to `backend/` for utilities

## Next Steps

1. ✅ **Project Structure**: Complete
2. 📝 **Environment Setup**: Configure `.env.local` with API URL
3. 🚀 **Development**: Run frontend and backend locally
4. 🔄 **Testing**: Run verification scripts
5. 🌐 **Deployment**: Deploy frontend and backend

---

For more details, see [README.md](README.md) and [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
