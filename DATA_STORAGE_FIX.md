# CardioSense - Data Storage Troubleshooting

## Quick Diagnosis

Data is not storing because of one of these reasons:
1. ❌ RLS policies blocking inserts
2. ❌ Missing `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
3. ❌ Supabase client not initialized

---

## Step 1: Check Environment Variables

1. **Open `.env.local`** in your project root
2. **Verify these variables exist:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://jkhulkbhytcywgjlsfpe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (should be LONG)
BACKEND_URL=http://localhost:8000
```

⚠️ **If `SUPABASE_SERVICE_ROLE_KEY` is missing, that's the problem!**

### Get Service Role Key:
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Look for **"service_role"** key (NOT anon key)
3. Copy the full key and add to `.env.local`
4. **Restart dev server:** `npm run dev`

---

## Step 2: Fix RLS Policies

Go to **Supabase Dashboard** → **SQL Editor** and run this:

### For `predictions` table:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read all predictions" ON predictions;
DROP POLICY IF EXISTS "Service role can insert without auth" ON predictions;

-- Create new permissive policies (allow all)
CREATE POLICY "Enable all"
  ON predictions
  AS PERMISSIVE
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

### For `user_logins` table:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Service role can insert logins" ON user_logins;
DROP POLICY IF EXISTS "Users can view own logins" ON user_logins;

-- Create new permissive policy (allow all)
CREATE POLICY "Enable all"
  ON user_logins
  AS PERMISSIVE
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

---

## Step 3: Debug in Browser

1. **Open Browser DevTools:** Press `F12`
2. **Go to Console tab**
3. **Make a prediction or login**
4. **Look for logs like:**
   - ✅ `📝 Attempting to save prediction...`
   - ✅ `✅ Prediction saved to database successfully`
   - ❌ `❌ Database save error: ...`
   - ❌ `⚠️ Supabase server client not initialized`

### If you see "not initialized":
- Your `SUPABASE_SERVICE_ROLE_KEY` is missing or wrong
- Check Step 1 above

### If you see a database error:
- RLS policy is blocking it
- Check Step 2 above

---

## Step 4: Verify Tables Exist

1. Go to **Supabase Dashboard** → **Table Editor**
2. Verify these tables exist:
   - ✅ `predictions`
   - ✅ `user_logins`
   - ✅ `users` (should exist)

If tables are missing, create them:

### Create `predictions` table:
```sql
CREATE TABLE predictions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  age integer NOT NULL,
  sex integer NOT NULL,
  cp integer NOT NULL,
  trestbps integer NOT NULL,
  chol integer NOT NULL,
  fbs integer NOT NULL,
  restecg integer NOT NULL,
  thalach integer NOT NULL,
  exang integer NOT NULL,
  oldpeak float NOT NULL,
  slope integer NOT NULL,
  ca integer NOT NULL,
  thal integer NOT NULL,
  risk_level text NOT NULL,
  probability float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all"
  ON predictions
  AS PERMISSIVE
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

### Create `user_logins` table:
```sql
CREATE TABLE user_logins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  login_time timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  auth_method text CHECK (auth_method IN ('email', 'google', 'github', 'mock')),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE user_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all"
  ON user_logins
  AS PERMISSIVE
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

---

## Step 5: Test Data Storage

1. **Restart dev server:** `npm run dev`
2. **Make a prediction or login**
3. **Check Supabase Table Editor:**
   - `predictions` table → should see new row
   - `user_logins` table → should see new row

---

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` missing | Get from Settings → API → service_role key |
| "Enable all" policy shows 403 error | Delete old policies first, then create new one |
| Data still not saving | Check browser console for actual error message |
| Tables don't exist | Run the CREATE TABLE SQL above |

---

## Getting Help

If data still isn't storing:
1. **Share the error from browser console** (F12 → Console tab)
2. **Check if `SUPABASE_SERVICE_ROLE_KEY` exists** in `.env.local`
3. **Verify RLS policies** in Supabase Dashboard → Authentication → Policies

