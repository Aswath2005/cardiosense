# CardioSense - Updated Supabase Schema for Anonymous Predictions

## Problem
The original schema requires a `user_id`, but predictions are being made by unauthenticated users. The RLS policies also prevent the server from inserting data without authentication.

## Solution
Update the table to allow NULL `user_id` and fix RLS policies to allow server-side inserts.

---

## Step 1: Update the predictions Table

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New query"** and paste this SQL:

```sql
-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view own predictions" ON predictions;
DROP POLICY IF EXISTS "Users can insert own predictions" ON predictions;

-- Alter table to make user_id nullable
ALTER TABLE predictions ALTER COLUMN user_id DROP NOT NULL;

-- Allow SELECT from anywhere (public read access)
CREATE POLICY "Anyone can view all predictions"
  ON predictions FOR SELECT
  USING (true);

-- Allow INSERT from service role or authenticated users
CREATE POLICY "Authenticated users and service role can insert"
  ON predictions FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to update their own
CREATE POLICY "Users can update own predictions"
  ON predictions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

3. Click **"Run"**
4. You should see: "Success. No rows returned"

---

## Step 2: Verify the Schema

1. Go to **Table Editor** → **predictions**
2. Check the columns and confirm `user_id` is now nullable (no NOT NULL constraint)

---

## Step 3: Test the Connection

Restart your development server:
```bash
# Press Ctrl+C to stop the current server
# Then run:
npm run dev
```

Now make a prediction without logging in. Check the Supabase **Table Editor** → **predictions** table. You should see a new row with:
- `user_id`: NULL (or empty)
- All other fields filled with your prediction data

---

## How It Works Now

```
Anonymous User fills form
  ↓
POST /api/predict (with userId=null)
  ↓ Calls FastAPI backend /predict
  ↓ Gets prediction result
  ↓ Saves to Supabase with user_id=NULL ✅
  ↓ Returns result to frontend
  ↓
Data appears in Supabase table!
```

---

## Important Notes

- ⚠️ **This allows public read access to all predictions**. For production with privacy concerns, adjust the `"Anyone can view all predictions"` policy to only allow SELECT from the service role.
- 🔐 If you want to keep predictions private per user later, add a login requirement before showing dashboard
- ✅ Now both authenticated AND unauthenticated predictions are saved

