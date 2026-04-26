# CardioSense - User Login & Profile Storage

Since you already have a `users` table in Supabase, we need to:
1. Create a `user_logins` table to track login history
2. Create an API route to record logins
3. Update signup/login to record user data

---

## Step 1: Create User Login History Table

1. Go to **Supabase Dashboard** → **SQL Editor** → **New query**
2. Paste and run this SQL:

```sql
-- Create user_logins table to track login history
CREATE TABLE IF NOT EXISTS user_logins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  login_time timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  auth_method text CHECK (auth_method IN ('email', 'google', 'github', 'mock')),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create RLS policy to allow service role to insert
ALTER TABLE user_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert logins"
  ON user_logins FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own logins"
  ON user_logins FOR SELECT
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_logins_user_id ON user_logins(user_id);
CREATE INDEX idx_user_logins_login_time ON user_logins(login_time DESC);
```

---

## Step 2: Create API Route to Record Login

The system will automatically record:
- ✅ When users sign up
- ✅ When users log in
- ✅ Timestamp of login
- ✅ Email address
- ✅ Auth method (email, google, github, mock)

---

## Step 3: How to Check Stored Logins

1. Go to **Supabase Dashboard** → **Table Editor**
2. Select **user_logins** table
3. You'll see all user login history with:
   - `user_id` (from auth)
   - `email` (who logged in)
   - `login_time` (when they logged in)
   - `auth_method` (how they logged in)

