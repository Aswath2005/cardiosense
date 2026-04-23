# CardioSense Project Structure Migration Guide

## What Changed

The CardioSense project has been reorganized from a flat structure into a modular, production-ready structure with clear separation between frontend, backend, and notebooks.

### Before
```
cardiosense/
├── app/
├── components/
├── lib/
├── backend/
├── package.json
├── next.config.ts
└── ... (mixed configuration files)
```

### After
```
cardiosense/
├── frontend/              ← All Next.js files
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── ... (Next.js configs)
├── backend/               ← FastAPI unchanged
├── notebook/              ← Jupyter notebooks
└── ... (project root configs)
```

## Migration Impact

### For Local Development

**Before**: Run from root directory
```bash
npm install
npm run dev
```

**After**: Run from frontend directory
```bash
cd frontend
npm install
npm run dev
```

### For Deployment

**Frontend (Vercel)**
- Update build command: `cd frontend && npm run build`
- Update start command: `cd frontend && npm start`
- Or connect `frontend/` as the root in Vercel dashboard

**Backend (Unchanged)**
- Deploy `backend/` as before
- Ensure `NEXT_PUBLIC_API_URL` in frontend `.env.local` points to your backend

### Path Aliases (Unchanged)
All imports continue to work the same way:
```typescript
import { Navbar } from '@/components/Navbar'     // Works!
import { api } from '@/lib/api'                  // Works!
import { predictHeartRisk } from '@/lib/api'     // Works!
```

The `@/` alias now points to `frontend/` instead of the project root, but this is transparent to your code.

## File Organization

### Frontend Structure
```
frontend/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── login/              # Login route
│   ├── signup/             # Signup route
│   └── dashboard/          # Dashboard route
│
├── components/             # React components
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── PredictSection.tsx
│   ├── ResultCard.tsx
│   ├── ResultsSection.tsx
│   ├── Footer.tsx
│   └── Auth*.tsx
│
├── lib/                    # Utilities & hooks
│   ├── types.ts           # TypeScript types
│   ├── api.ts             # API client
│   ├── supabase.ts        # Supabase client
│   ├── database.types.ts  # Database types
│   └── mockAuth.ts        # Mock auth
│
├── package.json           # Dependencies (isolated)
├── tsconfig.json          # TypeScript config
├── next.config.ts         # Next.js config
├── tailwind.config.ts     # Tailwind config
└── .env.local             # Environment vars
```

### Backend Structure (Unchanged)
```
backend/
├── main.py                # FastAPI app
├── model.py               # Model loading
├── train_model.py         # Training script
├── heart.csv              # Dataset
├── model.pkl              # Trained model
├── scaler.pkl             # StandardScaler
└── requirements.txt       # Dependencies
```

### Notebook Structure (New)
```
notebook/
├── train_and_export.ipynb # Model training
└── Heart_Attack_prediction.ipynb # (Optional)
```

## Quick Start After Migration

### 1. Setup Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 2. Setup Backend
```bash
cd ../backend
pip install -r requirements.txt
python train_model.py                          # First time only
python -m uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000
```

### 3. Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Test the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Common Tasks

### Adding a New Component
```bash
# File structure
frontend/components/MyComponent.tsx

# Import in other components
import { MyComponent } from '@/components/MyComponent'
```

### Adding a New Page
```bash
# File structure
frontend/app/newpage/page.tsx

# Automatic routing
# Visit: http://localhost:3000/newpage
```

### Adding Backend Dependencies
```bash
cd backend
pip install package-name
pip freeze > requirements.txt
```

### Adding Frontend Dependencies
```bash
cd frontend
npm install package-name
```

## Deployment Changes

### Vercel (Frontend)
1. **Option A**: Update repository root in Vercel settings to `frontend/`
2. **Option B**: Update build settings:
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Deployment File Updates
- `frontend/vercel.json` - Vercel config (moved from root)
- `backend/` - No changes needed

### Environment Variables
Configure in platform UI:
- **Frontend**: `NEXT_PUBLIC_API_URL` (in Vercel)
- **Backend**: API keys and secrets (in your backend platform)

## Troubleshooting

### "Module not found" after migration
- Verify you're in `frontend/` directory
- Check `tsconfig.json` has `"baseUrl": "."`
- Run `npm install` in `frontend/` directory

### Build fails in Vercel
- Ensure root directory is set to `frontend/`
- Check `next.config.ts` in frontend folder
- Run `npm run build` locally to test

### API requests return 404
- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Check backend is running on correct port
- Test backend with: `curl http://localhost:8000/health`

### Import paths still using old aliases
- Update imports to use `@/` aliases
- Old paths like `../../components` should become `@/components`

## Staying Compatible

### Git Ignore
The `.gitignore` at root level applies to entire project. Main patterns:
- `node_modules/` - npm packages
- `*.pyc` - Python compiled files
- `.env` files - Environment secrets
- `model.pkl`, `scaler.pkl` - Trained models

### Version Control
Structure remains git-friendly:
```bash
git clone <repo>
cd cardiosense
cd frontend && npm install
cd ../backend && pip install -r requirements.txt
```

## Summary

✅ **Cleaner organization** - Separate concerns by folder  
✅ **Independent deployment** - Frontend and backend deploy separately  
✅ **Scalability** - Easy to add services or monorepos later  
✅ **Team collaboration** - Clear ownership of frontend vs backend  
✅ **Production ready** - Matches industry standards

All your code continues to work exactly as before. The migration is purely structural.
