# Supabase Setup for CardioSense

Complete step-by-step guide to integrate Supabase authentication and prediction history storage.

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project" → sign in with GitHub (or create account)
3. Click "New project"
4. Fill in:
   - **Name**: `cardiosense-ai`
   - **Database password**: Create a strong password and save it somewhere safe
   - **Region**: Pick the region closest to your users (e.g., us-east-1, eu-west-1)
5. Wait 2-3 minutes for the project to provision
6. Once ready, you'll see the Supabase dashboard

## Step 2: Create the predictions Table

1. In the Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** (or the `+` icon)
3. Copy and paste the SQL below, then click **"Run"**:

```sql
CREATE TABLE predictions (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  age         integer NOT NULL,
  sex         integer NOT NULL,
  cp          integer NOT NULL,
  trestbps    integer NOT NULL,
  chol        integer NOT NULL,
  fbs         integer NOT NULL,
  restecg     integer NOT NULL,
  thalach     integer NOT NULL,
  exang       integer NOT NULL,
  oldpeak     float   NOT NULL,
  slope       integer NOT NULL,
  ca          integer NOT NULL,
  thal        integer NOT NULL,
  risk_level  text    NOT NULL CHECK (risk_level IN ('high','low')),
  probability float   NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

The policies ensure users can only access their own predictions.

## Step 3: Get Your API Keys

1. In the Supabase dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see two important values:
   - **Project URL** → Copy this
   - **Anon public key** → Copy this (it's listed under "Project API keys")
4. Save these values — you'll need them in the next step

## Step 4: Configure Environment Variables

1. In your project root, open `.env.local`
2. Add or update these lines:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Replace `<your-project-url>` and `<your-anon-key>` with the values from Step 3.

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Install Supabase Packages

In your terminal, run:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Or if using yarn:
```bash
yarn add @supabase/supabase-js @supabase/ssr
```

## Step 6: Configure Auth Settings (Optional but Recommended)

1. In the Supabase dashboard, click **Authentication** in the left sidebar
2. Click **Providers** → **Email**
3. Ensure "Enable Email Signup" is **ON**
4. Optional for development: Turn **OFF** "Confirm email" to test easily
   - Users can sign up and log in immediately without email confirmation
   - (For production, keep email confirmation enabled for security)

## Step 7: Test Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/signup
3. Create a test account with:
   - Name: John Doe
   - Email: test@example.com
   - Password: Test123456

4. You should be redirected to `/dashboard`
5. Go to http://localhost:3000/login and sign in with your test credentials

6. Go to the home page and make a prediction (section with heart risk form)
7. Check your dashboard — the prediction should appear in the table

8. Verify it was saved in Supabase:
   - Supabase dashboard → **Table Editor** → **predictions**
   - You should see a new row with your user ID and prediction data

## Step 8: Deploy to Vercel (Production)

1. Commit all changes to git:
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push
   ```

2. Go to your **Vercel dashboard** → select your CardioSense project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)

5. Click **Save**
6. Go to **Deployments** and redeploy (or push again to trigger redeploy)
7. Once deployed, visit your live site and test signup/login

## Troubleshooting

### "Cannot find module @supabase/ssr"
- Run `npm install @supabase/supabase-js @supabase/ssr` again
- Restart your dev server

### CORS errors in browser console
- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct in `.env.local`
- Restart dev server after changing `.env.local`

### Predictions not saving
- Check browser console for errors
- Verify user is logged in before making predictions
- Open Supabase dashboard → SQL Editor → run: `SELECT * FROM predictions;`
- Check that RLS policies are enabled on the predictions table

### "Row Level Security violation"
- This means the `user_id` in the insert doesn't match the auth user
- Ensure `savePrediction()` in `lib/supabase.ts` receives the correct `user.id`

### Email confirmation not being sent
- Go to Supabase dashboard → Authentication → Settings
- Check that "Enable Email Confirmations" is toggled **ON**
- For development, you can turn it **OFF** to skip confirmation

## File Structure

The Supabase integration adds these files:

```
lib/
  ├── supabase.ts           ← Supabase client & savePrediction()
  ├── database.types.ts     ← TypeScript interfaces for DB
  ├── types.ts              ← Existing (PatientData, PredictionResult)
  └── api.ts                ← Existing (predictHeartRisk)

app/
  ├── login/page.tsx        ← Sign in form
  ├── signup/page.tsx       ← Create account form
  └── dashboard/page.tsx    ← User prediction history (protected)

components/
  ├── AuthGuard.tsx         ← Route protection wrapper
  ├── Navbar.tsx            ← Updated with auth buttons
  ├── PredictSection.tsx    ← Updated to save predictions
  └── ...existing components

.env.local                   ← Updated with Supabase keys
```

## Next Steps

- **Invite users**: Share `cardiosense1.vercel.app` with others
- **Monitor usage**: View user signups in Supabase → Authentication → Users
- **Analyze data**: Check `SELECT * FROM predictions;` in SQL Editor to see patterns
- **Add more features**:
  - Download prediction history as CSV
  - Share results with doctors
  - Integration with wearable devices
  - Push notifications for high-risk scores

## Database Schema Reference

**predictions** table columns:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto-generated, primary key |
| user_id | uuid | Foreign key to auth.users |
| age | integer | Patient age (18-120) |
| sex | integer | 0=Female, 1=Male |
| cp | integer | Chest pain type (0-3) |
| trestbps | integer | Resting blood pressure (mmHg) |
| chol | integer | Serum cholesterol (mg/dl) |
| fbs | integer | Fasting blood sugar > 120 mg/dl (0=No, 1=Yes) |
| restecg | integer | Resting electrocardiographic results (0-2) |
| thalach | integer | Max heart rate achieved (bpm) |
| exang | integer | Exercise induced angina (0=No, 1=Yes) |
| oldpeak | float | ST depression induced by exercise |
| slope | integer | Slope of ST segment (1-3) |
| ca | integer | Major vessels colored by fluoroscopy (0-3) |
| thal | integer | Thalassemia (3=Normal, 6=Fixed Defect, 7=Reversible) |
| risk_level | text | 'high' or 'low' |
| probability | float | Prediction confidence (0.0-1.0) |
| created_at | timestamptz | Timestamp of prediction (auto-set) |

---

**Happy predicting!** 💓

For issues or questions, check the [Supabase documentation](https://supabase.com/docs) or the [CardioSense repo](https://github.com/cardiosense/cardiosense).
